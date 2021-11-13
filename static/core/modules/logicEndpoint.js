
/*
 * Inherits from logicComponent.js
 */


import LogicComponent from './logicComponent.js';
import { StateMachine } from '../../shared/state.js';


export default function LogicEndpoint(id, name, specs, goal) {
    LogicComponent.call(this, id, name, specs, goal);
};

// Establish inheritance
LogicEndpoint.prototype = Object.create(LogicComponent.prototype);
Object.defineProperty(LogicEndpoint.prototype, 'constructor', { 
    value: LogicEndpoint,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
});

LogicEndpoint.prototype.processTimestep = function() {
    var reqArray = [];
    for (let i = 0; i < this.incomingRequestQueue.length; i++) {
        let req = this.incomingRequestQueue.pop();
        reqArray.push(req);
        this.numProcessed++;
        if (this.goal && req.destID == this.id) {
            req.setCompleted();
            StateMachine.incrementCompletedReqs();
            if (this.numProcessed >= this.goal) {
                // Callback function here or set a flag?
                this.goalMet = true;
                return [];
            }
        }
        
        let nextConnection = this.transmitFunc(this.id, req.destID);
        // Check that a path exists
        if (nextConnection) {
            nextConnection.addRequest(req);
            req.transmit(nextConnection);
        }
    }
    return reqArray;
};
