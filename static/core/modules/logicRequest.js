
// Factory function to generate UUIDs
const generateID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
const TIMEOUT = 20;

export var LogicRequest = (source, destID) => {

    var req = {
        id: generateID(),
        age: 0,

        currComponent: source,
        nextComponent: undefined,
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

        // Called by a component when it's accepted THIS request into its queue
        pendingProcessing: function(component) {
            this.currComponent = component;
            this.nextComponent = null;
            this.currConnection = null;

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
            this.currConnection = connection;
            this.currComponent = null;

            this.nextComponent = connection.des;

            this._stateChange();
            this.inTransit = true;
        },

        // Called every timestep
        processTimestep: function() {
            this.age++;
            this.currProcessTime++;
            if (this.blocked) {
                if (this.currProcessTime > TIMEOUT) {
                    console.log("I timed out!");
                    this.timedout = true;
                    return RequestStateFactory('TIMEDOUT', this);
                } else {
                    return RequestStateFactory('BLOCKED', this);
                }
            }

            else if (this.processing) {
                return RequestStateFactory('PROCESSING', this);
            }

            else if (this.inTransit) {
                if (this.currProcessTime >= TIMEOUT) {
                    console.log("I timed out!");
                    this.timedout = true;
                    return RequestStateFactory('TIMEDOUT', this);
                } else {
                    return RequestStateFactory('INTRANSIT', this);
                }
            }

            else if (this.completed) {
                return RequestStateFactory('COMPLETED', this);
            }

            // Request died (most likely because there wasn't a connection to it's destination)
            else {
                this.killed = true;
                return RequestStateFactory('KILLED', this);
            }
        }
    }
    return req;
};

export default LogicRequest;


const RequestStateFactory = (stateName, req) => {
    var state;
    switch(stateName) {
        case 'BLOCKED':
            state = {
                name: 'BLOCKED',
                percent: req.currProcessTime / TIMEOUT,
                currID: req.currComponent.id
            };
            break;
        case 'PROCESSING':
            state = {
                name: 'PROCESSING',
                percent: req.currProcessTime / req.currComponent.throughput,
                currID: req.currComponent.id
            };
            break;
        case 'INTRANSIT':
            state = {
                name: 'INTRANSIT',
                percent: req.currProcessTime / req.currConnection.latency,
                nextID: req.nextComponent.id
            };
            break;
        case 'TIMEDOUT':
            state = {
                name: 'TIMEDOUT'
            };
            break;
        case 'KILLED':
            state = {
                name: 'KILLED'
            }
            break;
        case 'COMPLETED':
            state = {
                name: 'COMPLETED'
            };
            break;
    }
    state['age'] = req.age;
    state['id'] = req.id;
    return state;
};