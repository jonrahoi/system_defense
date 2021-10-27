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

import {Network} from "./components/network.js";
import LogicComponent from './components/logicComponent.js';

// Controller for the global `State` object
import { StateMachine } from "../shared/state.js";

// for interface <--> game communication
import Level from "../shared/level.js";

// to get available components and request goal
import { findComponent, componentEntries, findLevel } from "../shared/lookup.js";


const REL_PATH_TO_ROOT = '../';

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

GameLogic.prototype.componentSpecs = (componentName) => {
    let specs = findComponent(componentName);
    let allComponents = componentEntries();
    specs['isClient'] = allComponents['clients'].hasOwnProperty(componentName);

    return specs;
};

GameLogic.prototype.addComponent = function(componentName, componentID) {

    // verify component at the game level ex: component is available
    let specs = this.componentSpecs(componentName);
    var newComponent = new LogicComponent(componentName, componentID, specs);
    StateMachine.placedComponent(newComponent);
    return this.network.addComponent(newComponent)
};

GameLogic.prototype.removeComponent = function(componentID) {
    return this.network.removeComponent(componentID);
};

GameLogic.prototype.addConnection = function(src_id, dest_id) {
    // verify connection at the game level
    return this.network.addConnection(src_id, dest_id);
};

GameLogic.prototype.removeConnection = function(src_id, dest_id) {
    return this.network.removeConnection(src_id, dest_id);
};

GameLogic.prototype.processInterval = function(timestamp, speedup) {
    console.log('Game Logic timestep ', timestamp);

    // Testing communication from Timer --> Logic --> Interface
    StateMachine.incrementCoins();
    StateMachine.incrementScore();

    // This will be the "brain" for determing game development
};

export default GameLogic;