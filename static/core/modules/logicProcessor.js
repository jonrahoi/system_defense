
/*
 * Inherits from logicComponent.js
 */


import LogicComponent from './logicComponent.js';
import { StateMachine } from '../../shared/state.js';


export default function LogicProcessor(id, name, specs, goal) {
    LogicComponent.call(this, id, name, specs, goal);

    this.processingRequests = [];
    this.numProcessing = 0;
    this.level = 0; // temp initial upgrade level
    this.upgrade();
};

// Establish inheritance
LogicProcessor.prototype = Object.create(LogicComponent.prototype);
Object.defineProperty(LogicProcessor.prototype, 'constructor', { 
    value: LogicProcessor,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
});

LogicProcessor.prototype.processTimestep = function() {
    // Inspect processing requests
    var reqArray = [];
    let i = this.numProcessing;
    while (i--) {
        let reqPackage = this.processingRequests[i];
        if (++reqPackage[0] >= this.latency) {
            this.numProcessing--;
            this.numProcessed++;
            if (this.goal && reqPackage[1].destID == this.id) {
                reqPackage[1].setCompleted();
                StateMachine.incrementCompletedReqs();
                if (this.numProcessed >= this.goal) {
                    // Callback function here or set a flag?
                    this.goalMet = true;
                    return [];
                }
            } else {
                let nextConnection = this.transmitFunc(this.id, reqPackage[1].destID);
                // Check that a path exists
                if (nextConnection) {
                    nextConnection.addRequest(reqPackage[1]);
                    reqPackage[1].transmit(nextConnection);
                }
            }
            this.processingRequests.splice(i, 1);
        }
        reqArray.push(reqPackage[1]);
    }
    
    // Try to accept new requests from incoming queue to be processed
    let toBeProcessed = Math.min(this.throughput - this.numProcessing, this.incomingRequestQueue.length);
    let req;
    for (let i = 0; i < toBeProcessed; i++) {
        req = this.incomingRequestQueue.pop();
        this.processingRequests.push([0, req]);
        req.beginProcessing();
        this.numProcessing++;
        reqArray.push(req);
    }
    return reqArray;
};

LogicProcessor.prototype.upgrade = function() {
    this.level += 1;
    let upgradeSpecs = this.upgrades[this.level];
    Object.assign(this, upgradeSpecs);
};

LogicProcessor.prototype.softReset = function() {
    this.numProcessed = 0;
    this.goal = null;
    this.goalMet = false;
    this.incomingRequestQueue = [];
    this.processingRequests = [];
    this.numProcessing = 0;
};

LogicProcessor.prototype.hardReset = function() {
    this.softReset();
    this.connectedInputs = 0;
    this.connectedOutputs = 0;
    this.level = 0;
    this.upgrade();
};