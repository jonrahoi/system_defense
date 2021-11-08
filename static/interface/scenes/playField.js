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

// k.loadSprite("gateway", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/gateway.png?token=ALRAJWEOGIVVVFYUAPK4QLDBPMGMU")
// k.loadSprite("server", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/server.png?token=ALRAJWCSY6RQPP4F6AXEGE3BPMGX6")
// k.loadSprite("router", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/router.png?token=ALRAJWAUZFDQR547SVAEOLLBPMGNC")
// k.loadSprite("cache", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/cache.png?token=ALRAJWGIMJCRWGJLRKEES4LBPMGL6")
// k.loadSprite("database", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/database.png?token=ALRAJWGEWJWAUWHU2OAEKVTBPMGMG")
// k.loadSprite("desktop", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/desktop.png?token=ALRAJWA2F4W7S53SZLSWUNTBPMGMO")
// k.loadSprite("hub", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/hub.png?token=ALRAJWDBJ5GQEPCA5XSS2VLBPMGM2")

// Do we want this constant?
const ComponentImgWidth = 75;
const ComponentImgHeight = 75;
const width = window.innerWidth; // or k.width()?
const height = window.innerHeight; // k.height()?
let componentArr = new Array();
let connectionArr = new Array();
let tempArr = new Array();
let temp = 0;

export function PlayField(bannerActions) {
    this.init(bannerActions);
    
    const userControls = {
        placeComponent: this.placeComponent.bind(this),
        connect: this.connect.bind(this),
        removeComponent: this.removeComponent.bind(this),
        disconnect: this.disconnect.bind(this)
    };
    

    this.scene = () => { this.buildScene(userControls); };
    this.test = () => { this.testLevel(userControls); };
    // this.buildObject();
    
    // this.build1 = () => { this.buildObject(); };

    // const test1 = k.add([
    //     k.text("TEST")
    // ]);

    // this.scene = () => { this.buildScene(test1); };

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

    let statusDimension = this.statusBar.dimensions;
    this.buildParameters(this.currentLvlLogic,
            statusDimension.x,
            statusDimension.y + statusDimension.height,
            k.width(),
            k.height() - (statusDimension.y + statusDimension.height));
};

PlayField.prototype.buildParameters = function(level, screenX, screenY, screenWidth, screenHeight) {

    this.screenParams = {
        screenX: screenX,
        screenY: screenY,
        screenWidth: screenWidth,
        screenHeight: screenHeight,
    }

    this.containerParams = {
        backgroundColor: k.color(100, 160, 200),
        backgroundOpacity: k.opacity(0.5),
        backgroundOutline: k.outline(2, k.color(0, 0, 0)),
    };

    this.containerParams['width'] = screenWidth - screenWidth * 0.1;
    this.containerParams['height'] = screenHeight * 0.8;

    this.containerParams['x'] = screenX + screenWidth * 0.1;
    this.containerParams['y'] = screenY;


};



PlayField.prototype.buildScene = function(controls) {
    let backdrop_color = k.color(180, 200, 250);
    k.add([
        k.rect(k.width(), k.height()),
        backdrop_color,
    ]);

    this.bannerBar.build();
    this.statusBar.build();
    this.buildObject();

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

PlayField.prototype.addIconText = function(text, pos) {
    k.add([
        k.text(text, {
          size: width * height * 0.000025,
        }),
        k.pos(pos),
        origin("center"),
    ]);
}

PlayField.prototype.addStaticIcon = function(sprite, pos) {
    return k.add([
        k.sprite(sprite),
        k.pos(pos),
        k.area(),
        k.scale(width * height * 0.0000001),
        origin("center"),
        // drag(),
        k.color(255, 255, 255)
    ]);
}

let dragging = null;

function drag() {
    let offset = k.vec2(0);

    return {
        id: "drag",
        require: [ "pos", "area", ],
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

PlayField.prototype.addDragableIcon = function(sprite, pos) {
    return k.add([
        k.sprite(sprite),
        k.pos(pos),
        k.area(),
        k.scale(width * height * 0.00000014),
        origin("center"),
        drag(),
        k.color(255, 255, 255),
        k.mouseRelease(() => {
            dragging = null;
            const mouseX = k.mousePos().x
            const mouseY = k.mousePos().y
            const leftBorder = this.containerParams.x
            const rightBorder = this.containerParams.x + this.containerParams.width
            const upBorder = this.containerParams.y
            const bottomBorder = this.containerParams.y + this.containerParams.height
            if (mouseX >= leftBorder && mouseX <= rightBorder && mouseY >= upBorder && mouseY <= bottomBorder) {
                // if ()



                // TODO: add component with id and position
                // Maybe do this: create a list of added components and assign id to them
                // const id = generateID()
                // this.controls.placeComponent(k.mousePos(), name);
                // The following code is for testing purpose
                console.log("TEST: icon \"" + sprite + "\" is in valid position")

                if (desTaken == 1) {
                    srcPos = desPos;
                    desPos = k.mousePos();
                } else if (srcTaken == 1) {
                    desPos = k.mousePos();
                    desTaken = 1;
                } else { // no src and no des
                    srcPos = k.mousePos();
                    srcTaken = 1;
                }

                if (srcTaken == 1 && desTaken == 1) { // we should have a connect, but, verify the connection first
                    // TODO: generate ids for src and des in some place
                    // TODO: verify the connection
                    // this.controls.connect(srcID, desID);
                    // TODO: drawLine() is not working somehow
                    // k.drawLine([
                    //     p1: srcPos,
                    //     p2: desPos
                    // ]);
                    console.log("Connection created");
                    console.log("srcpos: " +srcPos.x + " & " + srcPos.y);
                    console.log("despos: " + desPos.x+ " & " + desPos.y);
                }
            }
           
        })
    ]);
}

/* ********************************************************************** *
*                  Add containers & objects to view                      *
* ********************************************************************** */
PlayField.prototype.buildObject = function() {

    // k.add([
    //     k.text("TEST - screenX & Y"),
    //     k.pos(vec2(this.screenParams.screenX, this.screenParams.screenY))
    // ])

    // k.add([
    //     k.text("TEST - screenWidth & Height"),
    //     k.pos(vec2(this.screenParams.screenWidth - 100, this.screenParams.screenHeight))
    // ])


    // var self = this;

    // Control panel container
    k.add([
        k.rect(this.containerParams.width, this.containerParams.height),
        k.pos(this.containerParams.x, this.containerParams.y),
        this.containerParams.backgroundColor,
        this.containerParams.backgroundOpacity,
        this.containerParams.backgroundOutline,
        origin("topleft")
    ]);

    // Add gateway
    k.add([
        k.sprite("gateway"),
        k.pos(width * 0.05, height * 0.5),
        k.area(),
        k.scale(width * height * 0.0000002),
        origin("center"),
        k.color(255, 255, 255)
    ]);

    // Add icon text
    const h1 = height * 0.96;
    this.addIconText("Server", k.vec2(width * 0.27, h1));
    this.addIconText("Router", k.vec2(width * 0.39, h1));
    this.addIconText("Cache", k.vec2(width * 0.51, h1));
    this.addIconText("Database", k.vec2(width * 0.63, h1));
    this.addIconText("Desktop", k.vec2(width * 0.75, h1));
    this.addIconText("Hub", k.vec2(width * 0.87, h1));

    // Add static icons
    const h2 = height * 0.89;
    this.serverBtn = this.addStaticIcon("server", k.vec2(width * 0.27, h2));
    this.routerBtn = this.addStaticIcon("router", k.vec2(width * 0.39, h2));
    this.cacheBtn = this.addStaticIcon("cache", k.vec2(width * 0.51, h2));
    this.databaseBtn = this.addStaticIcon("database", k.vec2(width * 0.63, h2));
    this.desktopBtn = this.addStaticIcon("desktop", k.vec2(width * 0.75, h2));
    this.hubBtn = this.addStaticIcon("hub", k.vec2(width * 0.87, h2));

    const testTemp = k.add([
                        k.text("testTemp"),
                    ]);

    let i = 0;
    k.onUpdate(() => {
        k.add([
                k.text("abcdefg"),
                pos(0, i),
            ]);
        // if (temp == 1) {
        //     k.add([
        //         k.text(tempArr[5]),
        //     ]);
        // }
    })


    const dragablePos = k.vec2(width * 0.15, height * 0.89);
    this.serverBtn.clicks(() => {
        // this.addDragableIcon("server", dragablePos);
        let comp = this.placeComponent("WEB_SERVER", dragablePos);

        

    });

    this.routerBtn.clicks(() => {
        // this.addDragableIcon("router", dragablePos);
        this.placeComponent("ROUTER", dragablePos);
    });

    this.cacheBtn.clicks(() => {
        // this.addDragableIcon("cache", dragablePos);
        this.placeComponent("CACHE", dragablePos);
    });

    this.databaseBtn.clicks(() => {
        // this.addDragableIcon("database", dragablePos);
        this.placeComponent("DATABASE", dragablePos);
    });

    this.desktopBtn.clicks(() => {
        // this.addDragableIcon("desktop", dragablePos);
        this.placeComponent("DESKTOP", dragablePos);
    });

    this.hubBtn.clicks(() => {
        // this.addDragableIcon("hub", dragablePos);
        this.placeComponent("HUB", dragablePos);
    });

}

// Take in simple string name for a component 
PlayField.prototype.placeComponent = function(componentName, pos) {
    // let valid = -1;
    console.log('ADDING COMPONENT');
    let specs = this.currentLvlLogic.componentSpecs(componentName);
    let size = this.scaleComponentImage(ComponentImgWidth, ComponentImgHeight);
    let clientTag = specs.isClient ? "client" : "processor";
    let t = k.add([
        k.sprite(componentName, { width: size.width, height: size.height}),
        k.pos(pos),
        k.area(),
        drag(),
        clientTag,
        componentName, // use id as tag also?
        ViewComponent(componentName, specs.isClient),
        k.mouseRelease(() => {
            dragging = null;

            const mouseX = k.mousePos().x
            const mouseY = k.mousePos().y
            const leftBorder = this.containerParams.x
            const rightBorder = this.containerParams.x + this.containerParams.width
            const upBorder = this.containerParams.y
            const bottomBorder = this.containerParams.y + this.containerParams.height
            if (mouseX >= leftBorder && mouseX <= rightBorder && mouseY >= upBorder && mouseY <= bottomBorder) {
                const test = true;
                if (/* verification function for components */test) {
                    // valid = 1;
                    // k.add([
                    //     k.text("valid component"),
                    // ]);
                    // componentArr.push(t);
                    // for (let i = 0; i < componentArr.length; i++) {
                    //     k.add([
                    //         k.text(componentArr[i]),
                    //         k.pos(vec2(0, i * 50)),
                    //     ]);
                    // }
                    temp = 1;
                    tempArr =  ["a","b","c","d","e","f"];
                    
                }
            }

            // this.controls.placeComponent(k.mousePos(), name);


            // if (desTaken == 1) {
            //     srcPos = desPos;
            //     desPos = k.mousePos();
            // } else if (srcTaken == 1) {
            //     desPos = k.mousePos();
            //     desTaken = 1;
            // }
        })
    ]);
    // return ["a","b","c","d","e","f"];
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
    // this.build1();
    // this.buildObject();

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
