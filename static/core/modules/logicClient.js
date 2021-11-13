
/*
 * Inherits from logicComponent.js
 */


import LogicComponent from './logicComponent.js';
import { StateMachine } from '../../shared/state.js';
import LogicRequest from './logicRequest.js';


export default function LogicClient(id, name, specs, missions, goal) {
    LogicComponent.call(this, id, name, specs, goal);
    
    this.requestMissions = missions;
    this.numMissions = 0;
    this.level = 0; // temp initial upgrade level
    this.upgrade();
};

// Establish inheritance
LogicClient.prototype = Object.create(LogicComponent.prototype);
Object.defineProperty(LogicClient.prototype, 'constructor', { 
    value: LogicClient,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
});

// BUILDS ACTUAL REQUESTS
LogicClient.prototype.processTimestep = function() {
    var reqArray = [];
    for (let i = 0; i < this.transmitRate; i++) {
        let newReq = LogicRequest(this, this.requestMissions[i % this.numMissions]);
        let nextConnection = this.transmitFunc(this.id, newReq.destID);
        // Check that a path exists
        if (nextConnection) {
            nextConnection.addRequest(newReq);
            newReq.transmit(nextConnection);
        }
        reqArray.push(newReq);
    }
    
    let numToReceive = Math.min(this.receiveRate, this.incomingRequestQueue.length);
    let req;
    for (let i = 0; i < numToReceive; i++) {
        req = this.incomingRequestQueue.pop();
        this.numProcessed++;
        if (this.goal && req.destComponent.id == this.id) {
            req.setCompleted();
            StateMachine.incrementCompletedReqs();
            if (this.numProcessed >= this.goal) {
                // Callback function here or set a flag?
                this.goalMet = true;
                return [];
            }
        }

        reqArray.push(req);
    }
    return reqArray;
};

LogicClient.prototype.setMissions = function(missionList) {
    this.requestMissions = missionList;
    this.numMissions = missionList.length;
};

LogicClient.prototype.upgrade = function() {
    this.level += 1;
    let upgradeSpecs = this.upgrades[this.level];
    Object.assign(this, upgradeSpecs);
};

LogicClient.prototype.softReset = function() {
    this.numProcessed = 0;
    this.goal = null;
    this.goalMet = false;
    this.incomingRequestQueue = [];

    this.requestMissions = [];
    this.numMissions = 0;
};

LogicClient.prototype.hardReset = function() {
    this.softReset();
    this.connectedInputs = 0;
    this.connectedOutputs = 0;
    this.level = 0;
    this.upgrade();
};