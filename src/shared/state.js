/*
 * The game state object. This object can be accessed by any file and will
 * reflect the current game state without needing to be passed from object to
 * object. A file only needs to `import State`
 * 
 * GameLogic will have access to the `StateMachine` object which is responsible
 * for controlling the state and is the only way to adjust its values.
 */

export var State = {
    coins: 0, // coins in “wallet”
    score: 0, // current accumulated score
    level: 1, // current level
    goal: 0, // number of requests to complete in order to complete level
    numCompletedReqs: 0, // number of requests that have fufilled mission
    requestStates: new Map(), // map of requestID ⟶ requestState (ex. blocked, inTransit, processing...)
    visibleClientIDs:  [], // list of client ids that are currently in network
    visibleProcessorIDs : [], // list of data processor ids that are currently in network
    connections: [] // list of lists of length 2 in format of [sourceID, targetID]
};

// can adjust to only include pertinent information for interface and have
// additional object appended to `State` for GameLogic tracking

/** RESERVED FOR GAME LOGIC **/
export const StateMachine = {
    getState: () => { return State; },
    incrementCoins: (amount) => { State.coins += (amount || 1); },
    incrementScore: (amount) => { State.score += (amount || 1); },
    incrementCompleted: (amount) => { State.numCompletedReqs += (amount || 1); },
    setRequestStates: (newStates) => { State.requestStates = newStates; },
    addConnection: (sourceID, targetID) => { State.connections.push([sourceID, targetID]); },

    levelChange: function(levelNumber, newSpecs) {
        State.coins += newSpecs.coinReward; // want to add on to existing?
        State.goal = newSpecs.goal;
        State.level = levelNumber;
    },
    // functions to modify state from within `GameLogic`
    placedComponent: function(component) {
        if (component.isClient()) {
            State.visibleClientIDs.push(component.id);
        } else {
            State.visibleProcessorIDs.push(component.id);
        }
    },

    reset: function() {
        State = {
            coins: 0,
            score: 0,
            level: 1,
            goal: 0,
            numCompletedReqs: 0,
            requestStates: new Map(),
            placedClientIDs:  [],
            placedProcessorIDs : [],
            connections: []
        };
    }
};

export default State;