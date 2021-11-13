/*
 * Game index.js
 *
 * Simple implementation of a GameLogic object. Does not include methods like
 * `resetGame`, `loseGame`, `winGame`. It also does not do any verification
 * of user's actions on the Game level
 * 
 * Currently can receive timesteps and pass control functions in a level
 * object to the interface
 */

import Network from "./modules/network.js";
import LogicProcessor from './modules/logicProcessor.js';
import LogicClient from './modules/logicClient.js'
import LogicEndpoint from './modules/logicEndpoint.js';
import LogicConnection from './modules/logicConnection.js';

import { StateMachine, State } from "../shared/state.js";
import Level from "../shared/level.js";
import { ComponentConfig, LevelConfig, GameConfig } from "../shared/lookup.js";



const REL_PATH_TO_ROOT = '../';
const REFUND_RATE = GameConfig.get('refundRate'); // when deleted a component, only get % money back



export function GameLogic() {
    StateMachine.reset(); // reset the game state if previously in progress
    this.network = new Network(); // storage module
    this.requestHandler = [];
};

GameLogic.prototype.getLevel = function(levelNumber) {
    let levelSpecs = LevelConfig.get(levelNumber);
    if (!Object.keys(levelSpecs).length) {
        console.log("GAME WON!");
        return;
    }

    let stageSpecs = levelSpecs.stages["1"];
    let goalCount = Object.values(stageSpecs.goals).reduce((acc, x) => acc = acc + x['quantity'], 0);

    let baseSpecs = {
        'timeLimit': levelSpecs.timeLimit,
        'budget': levelSpecs.budget,
        'network': stageSpecs.networkType,
        'goal': goalCount,
        'clients': levelSpecs.clients,
        'processors': levelSpecs.processors,
        'endpoints': levelSpecs.endpoints,
        'availableComponents': stageSpecs.additionalComponents,
        'description': stageSpecs.description,
    };

    StateMachine.levelChange(levelNumber, baseSpecs);

    // Remove all existing components;
    this.network.clearComponents();

    const controlFuncs = {
        componentSpecs: this.componentSpecs.bind(this),
        initStage: this.initStage.bind(this),
        addComponent: this.addComponent.bind(this),
        removeComponent: this.removeComponent.bind(this),
        addConnection: this.addConnection.bind(this),
        removeConnection: this.removeConnection.bind(this),
        processInterval: this.processInterval.bind(this)
    };

    this.currentGoalSpecs = stageSpecs.goals;
    this.currentGoals = {}; // will collect IDs in initStage()
    return Level(levelNumber, baseSpecs, stageSpecs, controlFuncs);
};


GameLogic.prototype.getStage = function(stageNumber) {
    let stageSpecs = LevelConfig.get(State.levelNumber, stageNumber);
    // No more stages for this level
    if (!Object.keys(stageSpecs).length) { 
    //    return LevelConfig.get(Stage.levelNumber + 1);
        return false;
    }

    this.currentGoalSpecs = stageSpecs.goals;
    this.currentGoals = {}; // will collect IDs in initStage()
    let goalCount = Object.values(stageSpecs.goals).reduce((acc, x) => acc = acc + x['quantity'], 0);

    stageSpecs['goal'] = goalCount;
    StateMachine.stageChange(stageNumber, stageSpecs);

    return (({ timeBonus, addedClients, addedProcessors, addedEndpoints, additionalComponents }) => 
    ({ timeBonus, addedClients, addedProcessors, addedEndpoints, additionalComponents}))(stageSpecs);
};

// Expect object of componentIDs --> componentNames
GameLogic.prototype.initStage = function(components) {
    console.log(this.network);
    let expenses = 0;
    for (const [id, name] of Object.entries(components)) {
        let specs = this.componentSpecs(name);
        if (specs.isClient) {
            var newComponent = new LogicClient(id, name, specs);
        }
        else if (specs.isEndpoint) {
            var newComponent = new LogicEndpoint(id, name, specs)
        }
        else {
            var newComponent = new LogicProcessor(id, name, specs);
        }
        expenses += specs.usageCost;
        this.network.networkAddComponent(newComponent);
        StateMachine.placedComponent(newComponent);
    }
    
    // Setup current State
    StateMachine.incrementExpenses(-expenses);

    // Reset all components and connections
    let currentComponents = this.network._getComponents();
    currentComponents.forEach(x => x.softReset());

    let currentConnections = this.network._getConnections();
    currentConnections.forEach(x => x.reset());

    
    // Assign goals...
    let missions = []; // temporarily store so they can go to the clients
    let component;
    for (let goal of this.currentGoalSpecs) {
        component = currentComponents.find(x => {
            return !x.goal && x.name === goal.mission;
        });
        if (component) {
            component.setGoal(goal.quantity);
            missions.push(component.id);
            this.currentGoals[component.id] = false;
        }
    }

    for (let c of currentComponents) {
        if (c.isClient) {
            c.setMissions(missions);
        }
    }
}


// Kind of a silly func...
GameLogic.prototype.componentSpecs = (componentName) => {
    let specs = ComponentConfig.get(componentName);
    specs['isClient'] = specs.tags.includes('CLIENT');
    specs['isEndpoint'] = specs.tags.includes('ENDPOINT');
    return specs;
};


GameLogic.prototype.addComponent = function(componentName, componentID) {

    // Maybe do some sort of check to make sure the user's expenses aren't too high?
    
    let specs = this.componentSpecs(componentName);
    if (specs.isClient) {
        var newComponent = new LogicClient(componentID, componentName, specs, this.currentGoals.map(x => x.id));
    }
    else if (specs.isEndpoint) {
        var newComponent = new LogicEndpoint(componentID, componentName, specs)
    }
    else {
        var newComponent = new LogicProcessor(componentID, componentName, specs);
    }

    let addStatus = this.network.networkAddComponent(newComponent);

    if (addStatus.valid) {
        StateMachine.incrementExpenses(-specs.usageCost);
        StateMachine.placedComponent(newComponent);
    }
    return addStatus;
};


GameLogic.prototype.upgradeComponent = function(componentID) {
    let component = this.network.getComponent(componentID);
    if (!component) {
        return {
            valid: false, 
            info: 'Could not find component in game logic'
        }
    }

    if (State.coins < component.cost) {
        return {
            valid: false,
            info: 'Insufficient funds'
        };
    }

    let prevExpense = component.usageCost;
    component.upgrade();
    StateMachine.incrementExpenses(component.usageCost - prevExpense);

    return { 
        valid: true,
        info: 'Successfully upgraded to level ' + component.level
    }
}


GameLogic.prototype.removeComponent = function(componentID) {

    let component = this.network.getComponent(componentID);
    if (!component) {
        return {
            valid: false, 
            info: 'Could not find component in game logic'
        }
    }

    // Get refund for upgrade cost?
    if (component.level > 1) {
        let refund = Math.ceil(component.cost * REFUND_RATE);
        StateMachine.incrementCoins(refund);
    }

    let removeStatus = this.network.networkRemovedComponent(componentID);

    if (removeStatus.valid) {
        StateMachine.removedComponent(component);
        StateMachine.incrementExpenses(-component.usageCost);
    }
    return removeStatus;
};


GameLogic.prototype.addConnection = function(src_id, dest_id) {
    // verify connection at the game level
    let srcComponent = this.network.getComponent(src_id);
    let destComponent = this.network.getComponent(dest_id);

    // TEMPORARY HARD CODE
    let options = { latency: 2 };
    var connection = new LogicConnection(srcComponent, destComponent, options);

    let connectStatus = this.network.networkAddConnection(connection);

    if (connectStatus.valid) {
        StateMachine.addedConnection(connection);
    }
    return connectStatus;
};


GameLogic.prototype.removeConnection = function(src_id, dest_id) {
    let disconnectStatus = this.network.disconnect(src_id, dest_id);

    if (disconnectStatus.valid) {
        StateMachine.removedConnection(src_id, dest_id);
    }
    return disconnectStatus;
};


GameLogic.prototype.processInterval = function(timestamp, speedup) {
    // console.log('Game Logic timestep ', timestamp);

    
    StateMachine.incrementScore();
    StateMachine.incrementCoins(-State.expenses);

    // Clean up request states, don't need them anymore
    // this.requestHandler = this.requestHandler.filter(req => {
    //     return !(req.killed || req.timedout || req.completed);
    // });
    let aliveRequests = [];

    // Loop over all components to process their requests and collect them
    let components = this.network._getComponents();
    let requests, c;
    for (let i = 0; i < components.length; i++) {
        c = components[i];
        requests = c.processTimestep();

        if (c.goalMet) {
            this.currentGoals[c.id] = true;
            if (Object.values(this.currentGoals).every(e => e)) {
                StateMachine.stageCompleted();
                return [];
            }
        }

        // console.log('Collected reqs from components...', requests);
        aliveRequests.push(...requests);
    }

    // Loop over all connections to process their requests and collect them
    let connections = this.network._getConnections();
    for (let i = 0; i < connections.length; i++) {
        requests = connections[i].processTimestep();
        // console.log('Collected reqs from connections...');
        aliveRequests.push(...requests);
    }
    
    // Loop over all requests to update their states
    let reqStates = []
    let state, req;
    for (let i = 0; i < aliveRequests.length; i++) {
        req = aliveRequests[i];
        state = req.processTimestep();
        reqStates.push(state);
    }

    // An object of request IDs --> request states
    console.log(reqStates);
    // console.log(this.requestHandler);
    StateMachine.setRequestStates(reqStates);
    return reqStates;
};

export default GameLogic;