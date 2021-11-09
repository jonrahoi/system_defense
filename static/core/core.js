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
import LogicComponent from './modules/logicComponent.js';

// Controller for the global `State` object
import { StateMachine, State } from "../shared/state.js";

// for interface <--> game communication
import Level from "../shared/level.js";

// to get available components and request goal
import { findComponent, componentEntries, findLevel } from "../shared/lookup.js";


const REL_PATH_TO_ROOT = '../';

const REFUND_RATE = 0.75; // when deleted a component, only get 75% money back

export function GameLogic() {
    StateMachine.reset(); // reset the game state if previously in progress
    this.network = new Network(); // storage module

    // will probably need other instantiated properties...
};

GameLogic.prototype.getLevel = function(levelNumber) {
    var levelSpecs = findLevel(levelNumber);
    this.availableClients = levelSpecs['initClients']
    this.availableProcessors = levelSpecs['initProcessors']
    StateMachine.levelChange(levelNumber, levelSpecs);

    const funcs = {
        componentSpecs: this.componentSpecs.bind(this),
        addComponent: this.addComponent.bind(this),
        removeComponent: this.removeComponent.bind(this),
        addConnection: this.addConnection.bind(this),
        removeConnection: this.removeConnection.bind(this),
        processInterval: this.processInterval.bind(this)
    };

    return Level(levelNumber, levelSpecs, funcs);
};

const isClient = (componentName) => {
    let allComponents = componentEntries();
    return allComponents['clients'].hasOwnProperty(componentName);
}

GameLogic.prototype.componentSpecs = (componentName) => {
    componentName = componentName.toUpperCase();
    let specs = findComponent(componentName, REL_PATH_TO_ROOT);
    specs['isClient'] = isClient(componentName);
    return specs;
};

GameLogic.prototype.addComponent = function(componentName, componentID, initial=false) {

    let specs = this.componentSpecs(componentName);
    
    // Unnecessary when initial but OK
    if (State.coins < specs.cost) {
        return {
            valid: false,
            info: 'Insufficient funds'
        };
    }
    
    var newComponent = new LogicComponent(componentID, componentName, specs);
    StateMachine.placedComponent(newComponent);
    if (!initial) {
        StateMachine.incrementCoins(-specs.cost);
    }

    return this.network.networkAddComponent(newComponent);
};

GameLogic.prototype.removeComponent = function(componentID) {

    let component = this.network.getComponent(componentID);

    StateMachine.removedComponent(component);
    
    let refund = Math.ceil(component.cost * REFUND_RATE);
    StateMachine.incrementCoins(refund);

    return this.network.networkRemovedComponent(componentID);
};

GameLogic.prototype.addConnection = function(src_id, dest_id) {
    // verify connection at the game level
    let srcComponent = this.network.getComponent(src_id);
    let destComponent = this.network.getComponent(dest_id);

    return this.network.networkAddConnection(src_id, dest_id);
};

GameLogic.prototype.removeConnection = function(src_id, dest_id) {
    return this.network.disconnect(src_id, dest_id);
};

GameLogic.prototype.processInterval = function(timestamp, speedup) {
    console.log('Game Logic timestep ', timestamp);

    // Testing communication from Timer --> Logic --> Interface
    StateMachine.incrementScore();

    // This will be the "brain" for determing game development
};

export default GameLogic;