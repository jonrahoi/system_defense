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
import FieldController from '../modules/fieldControls.js';

import { dragControls, drag } from '../kaboom/components/drag.js';
import { selectControls, connectControls, select } from '../kaboom/components/select.js';
import { addSprite, addText } from '../kaboom/objectHandler.js';

export function LevelView() {
    this.init();

    this.scene = () => { this.buildScene(); };
    this.test = (lvlUpFunc, lvlDownFunc) => { this.includeLvlButtons(lvlUpFunc, lvlDownFunc); };
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

    this.initLevel();
    this.registerEvents();
};

// Deal with mouse & keyboard events 
LevelView.prototype.registerEvents = function() { 
    // When left button is HELD --> start of drag
    k.onMouseDown('left', (pos) => {
        if (k.isMouseMoved() && dragControls.current()) {
            let currDrag = dragControls.current();
            k.cursor("move");
            if (currDrag.is('processor')) {
                let offset = this.playField.inProcessorSide(pos.x, pos.y, currDrag.width, currDrag.height);
                currDrag.updatePos(k.vec2(...offset));
            } else if (currDrag.is('client')) {
                // Unsure if dragging clients is allowed?
            } 
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
                    FieldController.connect(connectControls.current().src, connectControls.current().dest);
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
                    return FieldController.disconnect(selection.src(), selection.dest());
                }
                if (FieldController.removeComponent(selection)) {
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


// Add all of the predefined, initial components to the PlayField
// Methodology isn't perfect but it's a start
LevelView.prototype.initLevel = function() {
    if (!this.currentLvlLogic) {
        return;
    }

    let initClients = this.currentLvlLogic.specs.initClients;
    let initProcessors = this.currentLvlLogic.specs.initProcessors;

    let numClients = Object.values(initClients).reduce((acc,curr) => acc = acc + curr["quantity"],0);
    let numProcessors = Object.values(initProcessors).reduce((acc,curr) => acc = acc + curr["quantity"],0);

    // Evenly space clients within the clientSpace
    let clientSpace = this.playField.clientSpace.rect;
    let initClientX = clientSpace.leftBoundary + (clientSpace.width / 2);
    let initClientYSpacer = clientSpace.height / (numClients + 1);

    let currY = clientSpace.topBoundary + initClientYSpacer;
    for (const client of initClients) {
        // NOTE: can't delete initial components
        for (let i = 0; i < client.quantity; i++) {
            FieldController.placeComponent(client.name, k.vec2(initClientX, currY), true, true);
            currY += initClientYSpacer;
        }
    }

    // Spread processors out in a line on the field
    let processorSpace = this.playField.processorSpace.rect;
    let initProcessorY = processorSpace.topBoundary + (processorSpace.height / 2);
    let initProcessorXSpacer = processorSpace.width / (numProcessors + 1);

    let currX = processorSpace.leftBoundary + initProcessorXSpacer;
    for (const processor of initProcessors) {
        // NOTE: can't delete initial components
        for (let i = 0; i < processor.quantity; i++) {
            FieldController.placeComponent(processor.name, k.vec2(currX, initProcessorY), false, true);
            currX += initClientYSpacer;
        }
    }
};

// Load a level object into this view
LevelView.prototype.load = function(levelLogic) {
    this.currentLvlLogic = levelLogic;
    FieldController.loadLogic(levelLogic); 
    this.selectionBar.setComponents(levelLogic.specs.availableProcessors);
};

// Meant to represent updating animations. However these will most likely
// be dealt with by another module
LevelView.prototype.update = function(timestamp, speedup) {
    // Probably don't need to redraw this every timestep?
    console.log(`Animation timestep: ${timestamp} @ ${speedup}x`);
};



/**********
* TESTING *
**********/

LevelView.prototype.includeLvlButtons = function(lvlUpFunc, lvlDownFunc) {
    let width = 75;
    let height = 15;

    this.levelBtns = new TestLevelChange(viewLayout.playField.x + (viewLayout.playField.width - (3 * width)), 
    viewLayout.playField.y + height, width, height, lvlUpFunc, lvlDownFunc);

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
