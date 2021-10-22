/*
 * Current implementation uses this as the "base" for all levels. Another
 * possibility is to have different scenes for each level...unsure if that will
 * make things more or less complicated. 
 * 
 * This is a scene object that holds everything on the game play screen (banner,
 * status bar, components, connections, etc.)
 * 
 * Next big things to figure out are user controls and animation
 */


import k from '../kaboom.js';

import Banner from '../components/banner.js';
import StatusBar from '../components/statusBar.js';
import TestPanel from '../components/testPanel.js';
import State from '../../shared/state.js';
import ViewComponent from '../components/viewComponent.js';

// Do we want this constant?
const ComponentImgWidth = 75;
const ComponentImgHeight = 75;

export function PlayField(bannerActions) {
    this.init(bannerActions);
    // necessary to preserve `this` reference (check out arrow functions if unfamiliar)
    
    const userControls = {
        placeComponent: this.placeComponent.bind(this),
        connect: this.connect.bind(this),
        removeComponent: this.removeComponent.bind(this),
        disconnect: this.disconnect.bind(this)
    };
    
    this.scene = () => { this.buildScene(userControls); };
    this.test = () => { this.testLevel(userControls); };

    // More to update/add to scene...
};

// may need other initialization objects/values
PlayField.prototype.init = function(bannerActions) {

    this.scaleComponentImage = (w, h) => {
        var ratio = Math.min((ComponentImgWidth / w), (ComponentImgHeight / h));
        return {
            width: (w * ratio),
            height: (h * ratio)
        };
    };

    // both objects take "relative screen" dimensions for ease of coordinate
    // references in the objects (ie. status bar's screen start below the banner)
    this.bannerBar = new Banner(0, 0, k.width(), k.height(), bannerActions);
    let bannerDimensions = this.bannerBar.dimensions;

    this.statusBar = new StatusBar(
        bannerDimensions.x,
        bannerDimensions.y + bannerDimensions.height,
        bannerDimensions.width,
        k.height()
    );
};


PlayField.prototype.buildScene = function(controls) {
    let backdrop_color = k.color(180, 200, 250);
    k.add([
        k.rect(k.width(), k.height()),
        backdrop_color,
    ]);

    this.bannerBar.build();
    this.statusBar.build();
};


/** Depending on if each level will have a new scene, wrap this function into `init()` 
 * Otherwise want to have seperate load level function to not constantly create
 * statusbar and other objects **/
 PlayField.prototype.load = function(levelLogic) {
    this.currentLvlLogic = levelLogic;
    // will need to load initial components that are to be placed on the screen
};

// Meant to represent updating animations. However these will most likely
// be dealt with by another module
PlayField.prototype.update = function(timestamp, speedup) {
    // Probably don't need to redraw this everytime? (^)
    console.log(`Animation timestep: ${timestamp} @ ${speedup}x`);

    // If so, use the game state object to draw.
    // SyncComponets();
};

/**  Overall: not sure how x, y will work...**/

let dragging = null;

function drag() {
	let offset = k.vec2(0);

	return {
		id: "drag",
		require: [ "pos", "area"],
		add() {
			this.clicks(() => {
				if (dragging) {
					return;
				}
        
			    dragging = this;
				offset = k.mousePos().sub(this.pos);
				k.readd(this);
			});
		},
        update() {
			if (dragging === this) {
				k.cursor("move");
				this.pos = k.mousePos().sub(offset);
			}
		},
	};
}

// Take in simple string name for a component 
PlayField.prototype.placeComponent = function(x, y, componentName) { 
    console.log('ADDING COMPONENT');
    let specs = this.currentLvlLogic.componentSpecs(componentName);
    let size = this.scaleComponentImage(ComponentImgWidth, ComponentImgHeight);
    let clientTag = specs.isClient ? "client" : "processor";
    let t = k.add([
        k.sprite(componentName, { width: size.width, height: size.height}),
        k.pos(x, y),
        k.area(),
        drag(),
        clientTag,
        componentName, // use id as tag also?
        ViewComponent(componentName, specs.isClient),
        k.mouseRelease(() => {
            dragging = null;
        })
    ]);
};


// Takes in two sprite/Kaboom objects. (unsure about this. at least one 
//      alternative is to use ids)
PlayField.prototype.connect = function(srcComponent, destComponent) {
    console.log('CONNECTING -- in construction');
};

// Same as above function
PlayField.prototype.removeComponent = function(component) {
    console.log('REMOVING COMPONENT -- in construction');
};

// Same as `connect()`
PlayField.prototype.disconnect = function(srcComponent, destComponent) {
    console.log('DISCONNECTING -- in construction');
};


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


/**********
* TESTING *
**********/

PlayField.prototype.testLevel = function(controls) {

    let statusDimension = this.statusBar.dimensions;
    this.testPanel = new TestPanel(this.currentLvlLogic,
            statusDimension.x,
            statusDimension.y + statusDimension.height,
            k.width(),
            k.height() - (statusDimension.y + statusDimension.height)
    );
    this.testPanel.connect(controls);

    // override scene function
    this.scene = () => { this.buildScene(); this.testPanel.build(); };
};


export default PlayField;
