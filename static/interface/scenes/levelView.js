/*
 * Current implementation uses this as the "base" for all levels. 
 * 
 * This is a scene object that holds everything on the game play screen (banner,
 * status bar, components, connections, etc.)
 * 
 * It does very little graphical minipulation on it's own. It's main job is to
 * contain all of the other components
 */


import k from '../kaboom/kaboom.js';

import Banner from '../modules/banner.js';
import StatusBar from '../modules/statusBar.js';
import SelectionBar from '../modules/selectionBar.js';
import PlayField from '../modules/playField.js';
import TestLevelChange from '../modules/testPanel.js';
import State from '../../shared/state.js';
import FieldControls from '../modules/fieldControls.js';
import TimerControls from '../../utilities/timer.js';

import InterfaceRequest from '../kaboom/components/interfaceRequest.js';
import { dragControls, drag } from '../kaboom/components/drag.js';
import { selectControls, connectControls, select } from '../kaboom/components/select.js';
import { Popup, PopupButtons } from '../modules/popup.js';
import { getColor } from '../../config/settings.js';
import { RequestStateDefs } from '../../core/modules/logicRequest.js';


export function LevelView() {
    this.newComponents = {};

    this.init();
    this.scene = (color) => { 
      this.buildScene(color); 
    };
    this.test = (stageFuncs, lvlFuncs) => { this.includeLvlButtons(stageFuncs, lvlFuncs); }
};


// All relative to entire screen. widthRatio is sort of a placeholder if needed in the future. 
// Everything expands the whole screen vertically with no adjacent components.
// Unexpected behavior if it's set to anything other than 1. 
// (would get complicated when setting each section's 'x' value)
const viewLayout = {
    banner: {
        heightRatio: 0.05, 
        widthRatio: 1,
    },
    statusBar: {
        heightRatio: 0.055,
        widthRatio: 1
    },
    playField: {
        heightRatio: 0.765, 
        widthRatio: 1
    },
    selectionBar: {
        heightRatio: 0.13,
        widthRatio: 1
    }
}

LevelView.prototype.init = function() {

    // Define screen sizes for each view section
    let currY = 0;
    let currX = 0;
    for (const [section, dimension] of Object.entries(viewLayout)) {
        viewLayout[section]['height'] = dimension.heightRatio * k.height();
        viewLayout[section]['width'] = dimension.widthRatio * k.width();
        viewLayout[section]['y'] = currY;
        viewLayout[section]['x'] = currX;
        currY += viewLayout[section].height;
    }

    // Build all components within the LevelView
    this.bannerBar = new Banner(
        viewLayout.banner.x, 
        viewLayout.banner.y, 
        viewLayout.banner.width, 
        viewLayout.banner.height,
    );
        
    this.statusBar = new StatusBar(
        viewLayout.statusBar.x,
        viewLayout.statusBar.y,
        viewLayout.statusBar.width,
        viewLayout.statusBar.height
    );

    this.playField = new PlayField(
        viewLayout.playField.x,
        viewLayout.playField.y,
        viewLayout.playField.width,
        viewLayout.playField.height
    );
    
    this.selectionBar = new SelectionBar(
        viewLayout.selectionBar.x,
        viewLayout.selectionBar.y,
        viewLayout.selectionBar.width,
        viewLayout.selectionBar.height
    );

    // Update selection bar with newly available components and store new data in Game Logic
    this.buildStage = () => { 
        this.selectionBar.addComponents(this.newComponents.additionalComponents); 
        FieldControls.initStage(this.newComponents.clients, this.newComponents.processors, 
                                    this.newComponents.endpoints, this.playField);
        this.popup.build();
    };
};

// Used as the actual scene "object" for Kaboom
LevelView.prototype.buildScene = function(color) {
    this.bannerBar.build(color);
    this.statusBar.build();
    this.playField.build();
    this.selectionBar.build();
    
    this.registerEvents();
    this.buildStage();
};



const doublyNestedMap = () => {
    const nested = {
        data: {},
        set: (k1, k2, v) => {
            if (!k1 | !k2) { return; }
            if (!nested.data.hasOwnProperty(k1)) {
                nested.data[k1] = {}
            }
            if (!nested.data[k1].hasOwnProperty(k2)) {
                nested.data[k1][k2] = []
            }
            nested.data[k1][k2].push(v);
        },
        get: (k1, k2, v) => {
            if (k1 && nested.data.hasOwnProperty(k1)) {
                if (k2 && nested.data[k1].hasOwnProperty(k2)) {
                    return nested.data[k1][k2];
                }
                return nested.data[k1];
            }
            if (!k1 && !k2) { return nested.data; }
            return;
        },
        group: (arr, attr1, attr2) => {
            return arr.reduce((acc, obj) => {
                let key1 = obj[attr1],
                    key2 = obj[attr2];
                    
                nested.set(key1, key2, obj);
                return acc;
            });
        }
    };
    return nested;
};


const groupBy = (arr, attr) => {
    return arr.reduce((acc, obj) => {
        let key = obj[attr];
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
        }, {})
}

// const syncRequests = (states, graphics) => {



// }






// Meant to represent updating animations. However these could be dealt with through Kaboom
// UPDATE ALL REQUESTS HERE? (@see State.requestStates)
LevelView.prototype.update = function(timestamp, speedup) {
    console.log(`Animation timestep: ${timestamp} @ ${speedup}x`);


    let currReqState, currGraphicReq, currComponent, currConnection;
    let currClients = k.get('CLIENT');
    let currProcessors = k.get('EDGE').concat(k.get('PRE_PROCESSOR'), k.get('PROCESSOR'));
    let currEndpoints = k.get('ENDPOINT');
    // let currConnections = k.get('_connection');


    let visibleReqs = k.get('_request');
    let matchedReqs = groupBy(State.requestStates.concat(visibleReqs), 'uuid');
    // { id0: [reqState0, graphicReq0], id1: [reqState1, graphicReq1],... }

    
    for (let reqPair of Object.values(matchedReqs)) {
        currReqState = reqPair[0];
        currGraphicReq = reqPair[1];

        console.log('States:', currReqState, 'Graphics', currGraphicReq);

        // Only state that does not involve its graphic version
        if (currReqState.stateName == RequestStateDefs.spawned) {
            let spawnPoint;
            currComponent = currClients.find(a => a.getID() === currReqState.currComponentID);
            
            if (currComponent) {
                spawnPoint = currComponent.pos;
            } else {
                spawnPoint = k.vec2(k.width() / 2, k.height() / 2);
            }
            currGraphicReq = FieldControls.spawnRequest(currReqState, spawnPoint);
            continue;
        }

        if (!currGraphicReq) { continue; }

        if (currReqState.stateName == RequestStateDefs.intransit) {
                
            if (!currGraphicReq.isState(RequestStateDefs.intransit)) {
                currGraphicReq.stateChange(currReqState);
                
                let connection = k.get([currReqState.currComponentID, currReqState.nextComponentID]);
                if (connection.length > 0) {
                    let c = connection[0];
                    c.addRequest(currGraphicReq); 
                    currGraphicReq.setConnection(c);
                    // currGraphicReq.setConnection(c.getPosByPercent.bind(c));
                }
            }
            currGraphicReq.progress(currReqState.percent);

        } else if (currReqState.stateName == RequestStateDefs.processing) {

            // graphic differs which means there was a recent state change
            if (!currGraphicReq.isState(RequestStateDefs.processing)) { 
                currGraphicReq.stateChange(currReqState);

                let connection = k.get([currReqState.currComponentID, currReqState.nextComponentID]);
                if (connection.length > 0) {
                    let c = connection[0];
                    c.delRequest(currGraphicReq);
                    currGraphicReq.unsetConnection(c);
                }
            } 
            currGraphicReq.progress(currReqState.percent);

        } else if (currReqState.stateName == RequestStateDefs.blocked) {
            if (!currGraphicReq.isState(RequestStateDefs.blocked)) {
                currGraphicReq.stateChange(currReqState);

                let connection = k.get([currReqState.currComponentID, currReqState.nextComponentID]);
                if (connection.length > 0) {
                    let c = connection[0];
                    c.delRequest(currGraphicReq);
                    currGraphicReq.unsetConnection(c);
                }

            }
            currGraphicReq.progress(currReqState.percent);

            // } else if (currReqState.stateName == 'COMPLETED') { 
        } else {
            // anything to change for 1 timestemp before it is removed...
            delete matchedReqs[currGraphicReq.uuid];
            k.destroy(currGraphicReq);
        }

    }
    // console.log(requestTracker)

    // Deal with newly spawned requests. Need to create new graphic request objects
    // let newlySpawned = newStateGroups['SPAWNED']; // will have the form of { id0: [state], id1: [state], ...}

    // for (let i = 0; i < newlySpawned.length; i++) {
    //     currReqState = newlySpawned[i];
    //     currGraphicReq = visibleReqs.find(a => a.id() === currReqState.id);
    //     currComponent = currClients.find(a => a.id() === currReqState.id);

    //     let params = [
    //         k.pos(currComponent.pos),
    //         // k.area(),
    //         k.origin('center'),
    //         currReqState.id,
    //         '_request', // used as a group identifier
    //         InterfaceRequest(currReqState)
    //     ];
        
    //     let graphicReq =  k.add(params);
    //     visibleReqs.push(graphicReq);
    // }


    

    // // Clean up graphics from dead requests
    // let died = { ...reqPairings.get('TIMEDOUT'), ...reqPairings.get('KILLED') };
    // for (let i = 0; i < died.length; i++) {
    //     // Room for any sort of graphic changess...

    //     k.destroy(died[i]);
    // }
    
    // // Keep completed requests seperate despite technically being "killed"
    // let completed = reqPairings.get('COMPLETED');
    // for (let i = 0; i < completed.length; i++) {
    //     // Room for any sort of graphic changess...

    //     k.destroy(completed[i]);
    // }


    // let processing = reqPairings.get('PROCESSING');
    



    // let blocked = reqPairings.get('BLOCKED');
    
    
    // let inTransit = reqPairings.get('INTRANSIT');


























    // for (let i = 0; i < State.requestStates.length; i++) {       
    //     //console.log("Obj: " + JSON.stringify(State.requestStates[i]));
    //     let selectables = k.get('selectable');
    //     let clients = k.get('CLIENT');
    //     let middles = k.get('MIDDLE');
    //     let endpoints = k.get('ENDPOINT');
    //     var newRequest = new InterfaceRequest(State.requestStates[i].id, selectables[0], selectables[1],
    //                                             State.requestStates[i].name);
        
    //     var stateType = newRequest.state;

    //     for (let i = 0; i < clients.length; i++) {
    //         var clientx = clients[i].pos.x
    //         var clienty = clients[i].pos.y
    //         if (stateType == 'KILLED') {
    //             const text = k.add([
    //                 k.text(JSON.stringify(stateType)),
    //                 k.pos(clientx, clienty),
    //                 k.area(),
    //                 {
    //                     size: 10,
    //                     font: "sink",
    //                     width: 500,
    //                     color: k.rgb(0, 0, 0)
    //                 },
    //                 k.move(k.dir(90), 100),
    //                 k.cleanup(1)
    //             ])
    //         }
    //         if (stateType == 'BLOCKED') {
    //             const text = k.add([
    //                 k.text(JSON.stringify(stateType)),
    //                 k.pos(clientx, clienty),
    //                 k.area(),
    //                 {
    //                     size: 10,
    //                     font: "sink",
    //                     width: 500,
    //                     color: k.rgb(255, 0, 0)
    //                 },
    //                 k.move(k.dir(-90), 100),
    //                 k.cleanup(1)
    //             ])
    //         }
    //     }
    //     for (let i = 0; i < middles.length; i++) {
    //         var midx = middles[i].pos.x
    //         var midy = middles[i].pos.y
    //         if (stateType == 'INTRANSIT') {
    //                 const text = k.add([
    //                     k.text(JSON.stringify(stateType)),
    //                     k.pos(midx-75, midy),
    //                     k.area(),
    //                     {
    //                         size: 10,
    //                         font: "sink",
    //                         width: 500,
    //                         color: k.rgb(100, 100, 100)
    //                     },
    //                     k.move(k.dir(-90), 100),
    //                     k.cleanup(1)
    //                 ])
    //             connection = k.get([newRequest.src])
    //         }
    //         if (stateType == 'PROCESSING') {
    //                 const text = k.add([
    //                     k.text(JSON.stringify(stateType)),
    //                     k.pos(midx+25, midy),
    //                     k.area(),
    //                     {
    //                         size: 10,
    //                         font: "sink",
    //                         width: 500,
    //                         color: k.rgb(0, 255, 0)
    //                     },
    //                     k.move(k.dir(-90), 100),
    //                     k.cleanup(1)
    //                 ])
    //         }
    //     }
    //     for (let i = 0; i < endpoints.length; i++) {
    //         var endx = endpoints[i].pos.x
    //         var endy = endpoints[i].pos.y
    //         if (stateType == 'COMPLETED') {
    //             const text = k.add([
    //                 k.text(JSON.stringify(stateType)),
    //                 k.pos(endx, endy),
    //                 k.area(),
    //                 {
    //                     size: 10,
    //                     font: "sink",
    //                     width: 500,
    //                     color: k.rgb(0, 0, 255)
    //                 },
    //                 k.move(k.dir(-90), 100),
    //                 k.cleanup(1)
    //             ])
    //         }
    //     }
    // }
};

// Load a level object into this view
LevelView.prototype.load = function(levelLogic) {

    // Remove all components from the screen
    k.destroyAll('_component');

    FieldControls.loadLogic(levelLogic);
    this.selectionBar.clear();
    this.initStage(levelLogic.levelSpecs, true);
};

// Seti[] new stage data for the existing playfield and selection bar
LevelView.prototype.initStage = function(newStageSpecs, newLevel=false) {
    let clients, processors, endpoints, additionalComponents;
    if (newLevel) {
        this.popup = new Popup(null, null, null, null, State.stageDescription, [PopupButtons.OK], `Level ${State.levelNumber}!`);
        this.newComponents['clients'] = newStageSpecs.clients;
        this.newComponents['processors'] = newStageSpecs.processors;
        this.newComponents['endpoints'] = newStageSpecs.endpoints;
        this.newComponents['additionalComponents'] = newStageSpecs.availableComponents;
    } else {
        this.popup = new Popup(null, null, null, null, State.stageDescription, [PopupButtons.OK], `Stage ${State.stageNumber}!`);
        console.log("STAGE CLEARED!");
        TimerControls.append(newStageSpecs.timeBonus);
        
        this.newComponents['clients'] = newStageSpecs.addedClients;
        this.newComponents['processors'] = newStageSpecs.addedProcessors;
        this.newComponents['endpoints'] = newStageSpecs.addedEndpoints;
        this.newComponents['additionalComponents'] = newStageSpecs.additionalComponents;

        this.popup.build();
        this.buildStage();
    }
};

// Deal with mouse & keyboard events. Connect TimerControls and State callbacks
LevelView.prototype.registerEvents = function() { 

     // Register function to update status bar time
     TimerControls.register(this.statusBar.updateTime, this.statusBar, TimerControls.RegistrationTypes.SPEEDUP_INTERVAL);
     TimerControls.register(this.statusBar.updateTime, this.statusBar, TimerControls.RegistrationTypes.TIME_ADJUSTEMENT);
 
     // Register function update status bar state values
     State.register(this.statusBar.updateState, this.statusBar);
 
     // When left button is HELD --> start of drag
     k.onMouseDown('left', (pos) => {
         if (k.isMouseMoved() && dragControls.current()) {
             let currDrag = dragControls.current();
             k.cursor("move");
             let offset = this.playField.confineComponentSpace(pos.x, pos.y, currDrag.width, currDrag.height);
             currDrag.updatePos(k.vec2(...offset));
         }
     });
     
     // When left button is released --> end a drag or display selection
     k.onMouseRelease('left', (pos) => {
         if (!dragControls.isDragging()) {
             // Get all processors
             let selectables = k.get('selectable');
             for (const c of selectables) {
                 if (c.hasPoint(pos)) {
                     selectControls.acquire(c);
                     return;
                 }
             }
             selectControls.release();
         }
         dragControls.release();
     });
 
     // When left button is clicked/pressed --> component selected
     k.onMousePress('left', (pos) => {
         // Default remove any in-progress connections
         connectControls.release();
 
         // Get all 'drag' components
         let dragComponents = k.get('draggable');
         for (const c of dragComponents) {
             if (c.hasPoint(pos)) {
                 dragControls.acquire(c, pos);
                 return;
             }
         }
     });
 
     // When right button is pressed --> indicates a connection being made
     k.onMousePress('right', (pos) => {
         // Default remove current selections
         selectControls.release();
 
         // Get all selectable components
         let selectables = k.get('selectable');
         for (const c of selectables) {
             if (c.hasPoint(pos)) {
                 connectControls.acquire(c);
                 if (connectControls.isValid()) {
                     FieldControls.connect(connectControls.current().src, connectControls.current().dest);
                     connectControls.release();
                 }
                 return;
             }
         }
         connectControls.release();
     });
 
     // When delete key is pressed --> destroy currently selected component (if deletable)
     k.onKeyPress('backspace', () => {
         // Check for currently selected processor
         if (selectControls.current()) {
             let selection = selectControls.current();
             if (selection.is('deletable')) {
                 if (selection.is('connection')) {
                     selectControls.release();
                     return FieldControls.disconnect(selection.src(), selection.dest());
                 }
                 if (FieldControls.removeComponent(selection)) {
                     let componentName = selection.name().toUpperCase();
                     this.selectionBar.update(componentName, 1);
                 }
             } else {
                 console.debug("Can't delete this item");
             }
         }
         selectControls.release();
         connectControls.release();
     });
};








/**********
* TESTING *
**********/

LevelView.prototype.includeLvlButtons = function(stageFuncs, lvlFuncs) {
    let width = 300;
    let height = 60;

    this.levelBtns = new TestLevelChange(
        viewLayout.playField.x + (viewLayout.playField.width - width),
        viewLayout.playField.y, 
        width, 
        height, 
        stageFuncs, lvlFuncs);

    // override scene function
    this.scene = () => { 
      this.buildScene(getColor());
      this.levelBtns.build();
    };
};

export default LevelView;
