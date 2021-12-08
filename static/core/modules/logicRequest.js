
/*
 * TODO: Need to remember path from src --> dest.
 * - After reaching destination, the request will follow the EXACT SAME path it
 *      took to get to that destination.
 * - Returning requests don't have to go through processing time
 * - Returning requests have own queue in each processor that takes priority
 * - Want to have individual connection types/latencies
 * 
 * - Every request has a TOTAL LIFESPAN
 * - Keep track of requests
 * 
 * - Send Eli notes for levelView.update() and logicRequest.RequestStateMachine
 * - Add SPAWN state & isResponse attribute
 * - Seperate spawn and transmit into two steps from client
 */

import generateUUID from '../../utilities/uuid.js';

const TIMEOUT = 10;
const INIT_DELAY = 1;

export const RequestStateDefs = {
    spawned: 'SPAWNED',
    blocked: 'BLOCKED',
    processing: 'PROCESSING',
    intransit: 'INTRANSIT',
    completed: 'COMPLETED',
    timedout: 'TIMEOUT',
    killed: 'KILLED'
};

export var LogicRequest = (source, destID) => {

    var req = {
        id: generateUUID(),
        age: 0,
        traveledPath: [],
        isResponse: false,

        currComponent: source,
        nextComponent: undefined,
        prevConnection: undefined,
        currConnection: undefined,

        destID: destID,

        _stateChange: function() { 
            this.processing = false;
            this.blocked = false;
            this.inTransit = false;
            this.currProcessTime = 0;
        },

        setCompleted: function() {
            this._stateChange();
            this.completed = true;
        },

        setResponse: function() {
            this.isResponse = true;
        },

        // Called by a component when it's accepted THIS request into its queue
        pendingProcessing: function(component) {
            this.currComponent = component;
            this.nextComponent = null;
            this.prevConnection = this.currConnection;
            this.currConnection = null;

            this.traveledPath.push(component);

            this._stateChange();
            this.blocked = true;
        },

        // Called by a component when it's started to process THIS request
        beginProcessing: function() {
            this._stateChange();
            this.processing = true;
        },

        // Called by a component when it's done processing THIS request (gives it a new connection and component)
        transmit: function(connection) { 
            this.prevConnection = this.currConnection;
            this.currConnection = connection;
            // this.currComponent = null;

            this.nextComponent = connection.des;

            this._stateChange();
            this.inTransit = true;
        },

        // Called every timestep
        processTimestep: function() {
            this.age++;
            this.currProcessTime++;
            if (this.age == 1) {
                return RequestStateFactory(RequestStateDefs.spawned, this);
            }
            if (this.blocked) {
                if (this.currProcessTime > TIMEOUT) {
                    console.log("I timed out!");
                    this.timedout = true;
                    return RequestStateFactory(RequestStateDefs.timedout, this);
                } else {
                    return RequestStateFactory(RequestStateDefs.blocked, this);
                }
            }

            if (this.processing) {
                return RequestStateFactory(RequestStateDefs.processing, this);
            }

            if (this.inTransit) {
                if (this.currProcessTime >= TIMEOUT) {
                    console.log("I timed out!");
                    this.timedout = true;
                    return RequestStateFactory(RequestStateDefs.timedout, this);
                } else {
                    return RequestStateFactory(RequestStateDefs.intransit, this);
                }
            } 

            if (this.completed) {
                return RequestStateFactory(RequestStateDefs.completed, this);
            }

            // Request died (most likely because there wasn't a connection to it's destination)
            this.killed = true;
            return RequestStateFactory(RequestStateDefs.killed, this);
        }
    }
    return req;
};




const RequestStateFactory = (stateName, req) => {
    var state;
    switch(stateName) {
        case RequestStateDefs.spawned:
            state = {
                stateName: RequestStateDefs.spawned,
                currComponentID: req.currComponent.id
            };
            break;
        case RequestStateDefs.blocked:
            state = {
                stateName: RequestStateDefs.blocked,
                percent: req.currProcessTime / TIMEOUT,
                currComponentID: req.currComponent.id,
                isResponse: req.isResponse
            };
            break;
        case RequestStateDefs.processing:
            state = {
                stateName: RequestStateDefs.processing,
                percent: req.currProcessTime / req.currComponent.throughput,
                currComponentID: req.currComponent.id,
                isResponse: req.isResponse
            };
            break;
        case RequestStateDefs.intransit:
            state = {
                stateName: RequestStateDefs.intransit,
                percent: req.currProcessTime / req.currConnection.latency,
                currComponentID: req.currComponent.id,
                nextComponentID: req.nextComponent.id,
                isResponse: req.isResponse
            };
            break;
        case RequestStateDefs.timedout:
            state = {
                stateName: RequestStateDefs.timedout
            };
            break;
        case RequestStateDefs.killed:
            state = {
                stateName: RequestStateDefs.killed
            }
            break;
        case RequestStateDefs.completed:
            state = {
                stateName: RequestStateDefs.completed
            };
            break;
    }
    state['age'] = req.age;
    state['uuid'] = req.id;
    return state;
};

