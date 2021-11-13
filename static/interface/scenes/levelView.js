/*
 * Current implementation uses this as the "base" for all levels. 
 * 
 * This is a scene object that holds everything on the game play screen (banner,
 * status bar, components, connections, etc.)
 * 
 * It does very little graphical minipulation on it's own. It's main job is to
 * contain all of the other components
 */


import k from '../kaboom/index.js';

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



export function LevelView() {
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
        heightRatio: 0.045, 
        widthRatio: 1,
    },
    statusBar: {
        heightRatio: 0.05,
        widthRatio: 1
    },
    playField: {
        heightRatio: 0.775, 
        widthRatio: 1
    },
    selectionBar: {
        heightRatio: 0.14,
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

};

// Used as the actual scene "object" for Kaboom
LevelView.prototype.buildScene = function() {
    this.bannerBar.build();
    this.statusBar.build();
    this.playField.build();
    this.selectionBar.build();

    this.initStage();
    this.registerEvents();
};

// Load a level object into this view
LevelView.prototype.load = function(levelLogic) {
    this.currentLvlLogic = levelLogic;

    // Remove all components from the screen
    k.destroyAll('_component');

    FieldControls.loadLogic(levelLogic);
    this.selectionBar.setComponents(levelLogic.levelSpecs.availableComponents);
};

// Meant to represent updating animations. However these could be dealt with through Kaboom
// UPDATE ALL REQUESTS HERE?
LevelView.prototype.update = function(timestamp, speedup) {
    console.log(`Animation timestep: ${timestamp} @ ${speedup}x`);
};

// Add all of the predefined, initial components to the PlayField
// Methodology isn't perfect but it's a start
LevelView.prototype.initStage = function() {
    if (!this.currentLvlLogic) {
        return;
    }

    let initClients = this.currentLvlLogic.levelSpecs.clients;
    let initProcessors = this.currentLvlLogic.levelSpecs.processors;
    let initEndpoints = this.currentLvlLogic.levelSpecs.endpoints;

    FieldControls.initStage(initClients, initProcessors, initEndpoints, this.playField);
};


LevelView.prototype.stageCleared = function(newStageSpecs) {
    // maybe alert here?
    console.log("STAGE CLEARED!");
    TimerControls.append(newStageSpecs.timeBonus);
    
    let addedClients = newStageSpecs.addedClients;
    let addedProcessors = newStageSpecs.addedProcessors;
    let addedEndpoints = newStageSpecs.addedEndpoints;

    // Update selection bar with newly available components
    let additionalComponents = newStageSpecs.additionalComponents;
    for (const component of additionalComponents) {
        this.selectionBar.update(component.name, component.quantity);
    }
    // Store data in Game Logic
    FieldControls.initStage(addedClients, addedProcessors, addedEndpoints, this.playField);
}


// Deal with mouse & keyboard events 
LevelView.prototype.registerEvents = function() { 
    // When left button is HELD --> start of drag
    k.onMouseDown('left', (pos) => {
        if (k.isMouseMoved() && dragControls.current()) {
            let currDrag = dragControls.current();
            k.cursor("move");
            let offset = this.playField.inProcessorSide(pos.x, pos.y, currDrag.width, currDrag.height);
            currDrag.updatePos(k.vec2(...offset));
        }
    });
    
    // When left button is released --> end a drag or display selection
    k.onMouseRelease('left', (pos) => {
        if (!dragControls.dragging()) {
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
    this.scene = () => { this.buildScene(); this.levelBtns.build(); };
};


// Beta version. Will most likely come in handy later. Not currently used
const SyncComponets = function() {
    // remove components that game logic has removed
    k.every('client', (obj) => {
        if (!State.visibleClientIDs.includes(obj.getId())) {
            k.destroy(obj);
        }
    });
    k.every('processor', (obj) => {
        if (!State.visibleProcessorIDs.includes(obj.getId())) {
            k.destroy(obj);
        }
    });
    k.every('connection', (obj) => {
        let exists = State.connections.find(x => { obj.equals(x); });
        if (!exists) {
            k.destroy(obj);
        }
    })
};

export default LevelView;
