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

import { dragControls, drag } from '../kaboom/components/drag.js';
import { selectControls, connectControls, select } from '../kaboom/components/select.js';

import { Popup, PopupButtons } from '../modules/popup.js';

export function LevelView() {
    this.newComponents = {};

    this.init();
    this.scene = () => { this.buildScene(); };
    this.test = (stageFuncs, lvlFuncs) => { this.includeLvlButtons(stageFuncs, lvlFuncs); };
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
        viewLayout.banner.height);
        
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
LevelView.prototype.buildScene = function() {
    this.bannerBar.build();
    this.statusBar.build();
    this.playField.build();
    this.selectionBar.build();
    
    this.registerEvents();
    this.buildStage();
};

// Meant to represent updating animations. However these could be dealt with through Kaboom
// UPDATE ALL REQUESTS HERE? (@see State.requestStates)
LevelView.prototype.update = function(timestamp, speedup) {
    // console.log(`Animation timestep: ${timestamp} @ ${speedup}x`);
    console.log(`Interface - recieved request states:`, State.requestStates);

    /*
     * NOTE: assumes 1 timestep-latecy for all components/connections (not realistic)
     *
     * 0) ClientA <--> ComponentA <--> ComponentB <--> EndpointA 
     *      (setup)
     * 
     * 1) ClientA(R1, R2) <--> ComponentA <--> ComponentB <--> EndpointA 
     *      R1 & R2 spawn at the client (emit 'SPAWN' status)
     * 
     * 2) ClientA(R3, R4) <-(R1, R2)-> ComponentA <--> ComponentB <--> EndpointA 
     *      R1 & R2 move to 'TRANSIT' state on the connection
     *      R3 & R4 sqawn at the client (emit 'SPAWN' status)
     * 
     * 3) ClientA(R5, R6) <-(R3, R4)-> (R1, R2)ComponentA <--> ComponentB <--> EndpointA 
     *      R1 & R2 move to 'BLOCKED' state at ComponentA
     *      R3 & R4 move to 'TRANSIT' state on the connection
     *      R5 & R6 sqawn at the client (emit 'SPAWN' status)
     * 
     * 4) ClientA(R7, R8) <-(R5, R6)-> (R3, R4)ComponentA(R1, R2) <--> ComponentB <--> EndpointA 
     *      R1 & R2 move to 'PROCESSING' state in ComponentA
     *      R3 & R4 move to 'BLOCKED' state at ComponentA
     *      R5 & R6 move to 'TRANSIT' state on the connection
     *      R7 & R8 sqawn at the client (emit 'SPAWN' status)
     * 
     * 4) ClientA(R9, R10) <-(R7, R8)-> (R5, R6)ComponentA(R3, R4) <-(R1, R2)-> ComponentB <--> EndpointA 
     *      R1 & R2 move to 'TRANSIT' state on the connection
     *      R3 & R4 move to'PROCESSING' state in ComponentA
     *      R5 & R6 move to 'BLOCKED' state at ComponentA
     *      R7 & R8 move to'TRANSIT' state on the connection
     *      R9 & R10 sqawn at the client (emit 'SPAWN' status)
     *
     * 
     * ...) ClientA(R17, R18) <-(R15, R16)-> (R13, R14)ComponentA(R11, R12) <-(R9, R10)-> (R7, R8)ComponentB(R5, R6) <-(R3, R4)-> (R1, R2)EndpointA 
     *      R1 & R2 become `PROCESSING` at the EndpointA (never blocked at endpoint)
     *      R3 & R4 move to 'TRANSIT' state on the connection
     *      R5 & R6 move to 'PROCESSING' state at ComponentB
     *      R7 & R8 move to'BLOCKED' state on the ComponentB
     *      R9 & R10 move to 'TRANSIT' state on the connection
     *      R11 & R12 move to 'PROCESSING' state at ComponentA
     *      R13 & R14 move to 'BLOCKED' state at ComponentA
     *      R15 & R16 move to'TRANSIT' state on the connection
     *      R17 & R18 sqawn at the client (emit 'SPAWN' status)
     * 
     *********
     * R1 now becomes a response (it's `isResponse` flag will be TRUE). 
     * It will now travel the opposite direction (maybe change shape?). It will follow
     * the same cycle of:
     * TRANSIT --> BLOCKED --> PROCESSING (will always take 1 timestep) --> TRANSIT ... --> COMPLETED
     * 
     * REPEAT!
     */
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
            // let offset = this.playField.confineComponentSpace(pos.x, pos.y, currDrag.width, currDrag.height);
            // currDrag.updatePos(k.vec2(...offset));
            currDrag.moveComponent(pos);
            // currDrag.updatePos(pos);
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
        if (dragControls.isDragging()) {
            dragControls.release();
        }
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
        let connections = k.get('_connection');
        // console.log('looking at connections...')
        for (const c of connections) {
            c.clicked(pos);
            return;
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
    this.scene = () => { this.buildScene(); this.levelBtns.build(); };
};

export default LevelView;
