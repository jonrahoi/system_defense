/*
 * The game state object. This object can be accessed by any file and will
 * reflect the current game state without needing to be passed from object to
 * object. A file only needs to `import State`
 * 
 * GameLogic will have access to the `StateMachine` object which is responsible
 * for controlling the state and is the only way to adjust its values.
 */

import Broadcast from '../utilities/broadcast.js';

export var State = {
    // _listeners: new Broadcast(),
    register: (func, context) => { State._listeners.register(func, context); },
    stateChange: () => { State._listeners.dispatch(); }

    // THESE VALUES ACTUALLY EXIST but they aren't defined on initiliazation
    // coins: 0, // coins in “wallet”
    // score: 0, // current accumulated score
    // level: 1, // current level
    // goal: 0, // number of requests to complete in order to complete level
    // numCompletedReqs: 0, // number of requests that have fufilled mission
    // requestStates: new Map(), // map of requestID ⟶ requestState (ex. blocked, inTransit, processing...)
    // visibleClientIDs:  [], // list of client ids that are currently in network
    // visibleProcessorIDs : [], // list of data processor ids that are currently in network
    // connections: [] // list of lists of length 2 in format of [sourceID, targetID]
};

// can adjust to only include pertinent information for interface and have
// additional object appended to `State` for GameLogic tracking

/** RESERVED FOR GAME LOGIC **/
export const StateMachine = {
    getState: () => { return State; },
    incrementCoins: (amount) => { State.coins += (amount || 1); State.stateChange(); },
    incrementScore: (amount) => { State.score += (amount || 1); State.stateChange(); },
    incrementCompleted: (amount) => { State.numCompletedReqs += (amount || 1); State.stateChange(); },
    setRequestStates: (newStates) => { State.requestStates = newStates; State.stateChange(); },
    addConnection: (sourceID, targetID) => { State.connections.push([sourceID, targetID]); State.stateChange(); },

    levelChange: function(levelNumber, newSpecs) {
        State.coins += newSpecs.coinReward; // want to add on to existing?
        State.goal = newSpecs.goal;
        State.level = levelNumber;
        State.stateChange();
    },
    // functions to modify state from within `GameLogic`
    placedComponent: function(component) {
        if (component.isClient) {
            State.placedClientIDs.push(component.id);
        } else {
            State.placedProcessorIDs.push(component.id);
        }
        State.stateChange();
    },

    removedComponent: function(component) {
        let index, arr;
        if (component.isClient) {
            index = State.placedClientIDs.indexOf(component.id);
            arr = State.placedClientIDs;
        } else {
            index = State.placedProcessorIDs.indexOf(component.id);
            arr = State.placedProcessorIDs;
        }
        if (index > -1) {
            arr.splice(index, 1);
        }
        State.stateChange();
    },

    reset: function() {
        Object.defineProperties(State, {
            coins: {
                value: 0,
                writable: true
            },
            score: {
                value: 0,
                writable: true
            },
            level: {
                value: 1,
                writable: true
            },
            goal: {
                value: 0,
                writable: true
            },
            numCompletedReqs: {
                value: 0,
                writable: true
            },
            requestStates: {
                value: new Map(),
                writable: true
            },
            placedClientIDs: {
                value: [],
                writable: true
            },
            placedProcessorIDs: {
                value: [],
                writable: true
            },
            connections: {
                value: [],
                writable: true
            },
            _listeners: {
                value: new Broadcast(),
                writable: false
            }
        });
    }
};

export default State;