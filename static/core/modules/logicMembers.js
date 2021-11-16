
import { StateMachine } from '../../shared/state.js';
import LogicRequest from './logicRequest.js';
import LogicComponent from './logicComponent.js';

/*
 * All inherit from logicComponent.js
 */


/*************************** Helper Functions ***************************/
 var extend = (base, derived) => {
    // copy the prototype from the base to setup inheritance
    derived.prototype = Object.create(base.prototype);
    Object.defineProperty(derived.prototype, 'constructor', {
        value: derived,
        enumerable: false, // so that it does not appear in 'for in' loop
        writable: true
    });
};


/**************************** DECLARATIONS ******************************/

/****************
 ***  CLIENT  ***
 ****************/
export function LogicClient(id, name, specs, transmission, goal) {
    LogicComponent.call(this, id, name, specs, transmission);
    
    this.requestMissions = [];
    this.numMissions = 0;
    this.setGoal(goal);
};

/*****************
 *** PROCESSOR ***
 *****************/
export function LogicProcessor(id, name, specs, transmission) {
    LogicComponent.call(this, id, name, specs, transmission);

    this.processingRequests = [];
    this.numProcessing = 0;
    this.numProcessed = 0;
};

/****************
 *** ENDPOINT ***
 ****************/
export function LogicEndpoint(id, name, specs, transmission) {
    LogicComponent.call(this, id, name, specs, transmission);
};

// Establish inheritance
extend(LogicComponent, LogicClient);
extend(LogicComponent, LogicProcessor);
extend(LogicComponent, LogicEndpoint);


/****************************** DEFINITIONS *****************************/

/****************
 ***  CLIENT  ***
 ****************/
// BUILDS ACTUAL REQUESTS
LogicClient.prototype.processTimestep = function() {
    var modifiedRequests = [];
    let newReq, nextConnection;
    for (let i = 0; i < this.transmitRate; i++) {
        newReq = LogicRequest(this, this.requestMissions[i % this.numMissions]);
        nextConnection = this.transmitFunc(newReq);
        // Check that a path exists
        if (nextConnection) {
            nextConnection.addRequest(newReq);
            newReq.transmit(nextConnection);
            this.numTransmitted++;
        }
        modifiedRequests.push(newReq);
    }
    
    let numToReceive = Math.min(this.receiveRate, this.incomingRequestQueue.length);
    let req;
    for (let i = 0; i < numToReceive; i++) {
        req = this.incomingRequestQueue.pop();
        this.numReceived++;
        if (this.goal && req.destComponent.id == this.id) {
            req.setCompleted();
            StateMachine.incrementCompletedReqs();
            if (this.numReceived >= this.goal) {
                this.goalMet = true;
                return [];
            }
        }
        modifiedRequests.push(req);
    }
    return modifiedRequests;
};

LogicClient.prototype.setMissions = function(missionList) {
    this.requestMissions = missionList;
    this.numMissions = missionList.length;
};

LogicClient.prototype.softReset = function() {
    LogicComponent.prototype.softReset.call(this);
    this.requestMissions = [];
    this.numMissions = 0;
};


/*****************
 *** PROCESSOR ***
 *****************/
LogicProcessor.prototype.processTimestep = function() {
    // Inspect processing requests
    var modifiedRequests = [];
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
                    this.goalMet = true;
                    return [];
                }
            } else {
                let nextConnection = this.transmitFunc(reqPackage[1]);
                // Check that a path exists
                if (nextConnection) {
                    nextConnection.addRequest(reqPackage[1]);
                    reqPackage[1].transmit(nextConnection);
                    this.numTransmitted++;
                }
            }
            this.processingRequests.splice(i, 1);
        }
        modifiedRequests.push(reqPackage[1]);
    }
    
    // Try to accept new requests from incoming queue to be processed
    let toBeProcessed = Math.min(this.throughput - this.numProcessing, this.incomingRequestQueue.length);
    let req;
    for (let i = 0; i < toBeProcessed; i++) {
        req = this.incomingRequestQueue.pop();
        this.processingRequests.push([0, req]); // [elapsedTime, request]
        req.beginProcessing();
        this.numProcessing++;
        this.numReceived++;
        modifiedRequests.push(req);
    }
    return modifiedRequests;
};

LogicProcessor.prototype.softReset = function() {
    LogicComponent.prototype.softReset.call(this);
    this.processingRequests = [];
    this.numProcessing = 0;
    this.numProcessed = 0;
};


/****************
 *** ENDPOINT ***
 ****************/
LogicEndpoint.prototype.processTimestep = function() {
    var modifiedRequests = [];
    let req;
    while(this.incomingRequestQueue.length) {
        req = this.incomingRequestQueue.pop();
        modifiedRequests.push(req);
        this.numReceived++;
        if (this.goal && req.destID == this.id) {
            req.setCompleted();
            StateMachine.incrementCompletedReqs();
            if (this.numReceived >= this.goal) {
                this.goalMet = true;
                return [];
            }
        }
        
        let nextConnection = this.transmitFunc(req);
        // Check that a path exists
        if (nextConnection) {
            nextConnection.addRequest(req);
            req.transmit(nextConnection);
            this.numTransmitted++;
        }
    }
    return modifiedRequests;
};