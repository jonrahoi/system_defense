/*
 * Graphic object for testing various features. Can be injected into the 'PlayField'
 * scene and used as a way to generate signals/events in a more simplified way
 * than what finished development will look like (ie. click a button rather than
 * drag and drop an object)
 */


import k from '../kaboom.js';

import ViewComponent from './viewComponent.js';
import State from '../../shared/state.js';
import generateID from './viewComponent.js';

// k.loadSprite("gateway", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/gateway.png?token=ALRAJWEOGIVVVFYUAPK4QLDBPMGMU")
// k.loadSprite("server", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/server.png?token=ALRAJWCSY6RQPP4F6AXEGE3BPMGX6")
// k.loadSprite("router", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/router.png?token=ALRAJWAUZFDQR547SVAEOLLBPMGNC")
// k.loadSprite("cache", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/cache.png?token=ALRAJWGIMJCRWGJLRKEES4LBPMGL6")
// k.loadSprite("database", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/database.png?token=ALRAJWGEWJWAUWHU2OAEKVTBPMGMG")
// k.loadSprite("desktop", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/desktop.png?token=ALRAJWA2F4W7S53SZLSWUNTBPMGMO")
// k.loadSprite("hub", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/hub.png?token=ALRAJWDBJ5GQEPCA5XSS2VLBPMGM2")

var sx = 0;
var sy = 0;
const width = window.innerWidth;
const height = window.innerHeight;

var srcPos;
var desPos;
var srcTaken = 0;
var desTaken = 0;


/* ********************************************************************** *
*                      Graphic object definitions                        *
* ********************************************************************** */
export function TestPanel(level, screenX, screenY, screenWidth, screenHeight) {
    sx = screenX;
    sy = screenY;
    // width = window.innerWidth;
    // height = window.innerHeight;

    this.level = level;

    this.buildParameters(level, screenX, screenY, screenWidth, screenHeight);

    this.connect = (controls) => { this.controls = controls; };
    this.build = () => { this.buildObject(); };
}


TestPanel.prototype.buildParameters = function(level, screenX, screenY, screenWidth, screenHeight) {

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

        xOuterOffsetRatio: 0.1, 
        yOuterOffsetRatio: 0.15,
    };

    // TODO: remove, no need
    this.containerParams['xOuterSpacer'] = this.containerParams.xOuterOffsetRatio * screenWidth;
    this.containerParams['yOuterSpacer'] = this.containerParams.yOuterOffsetRatio * screenHeight;

    this.containerParams['width'] = screenWidth - screenWidth * 0.1;
    this.containerParams['height'] = screenHeight * 0.8;

    this.containerParams['x'] = screenX + screenWidth * 0.1;
    this.containerParams['y'] = screenY;



    /* 
     * Control panel --> for testing events that cause reactions
     * Define container properties
     */ 
    this.controlPanelParams = {
        backgroundColor: k.color(100, 160, 200),
        backgroundOpacity: k.opacity(0.5),
        btnColor: k.color(86, 199, 95),
        btnOpacity: k.opacity(0.8),
        btnOutline: k.outline(2, k.color(0, 0, 0)),

        textColor: k.color(0, 0, 0),
        textOpacity: k.opacity(0.8),

        x: this.containerParams.x,
        y: this.containerParams.y,
        width: this.containerParams.width,

        textWidthRatio: 0.65,
        textHeightRatio: 0.2,

        numXButtons: 2, 
        numYButtons: 2,

        xInnerOffsetRatio: 0.05, 
        yInnerOffsetRatio: 0.1,
    
        xBtnSpacerRatio: 0.1, 
        yBtnSpacerRatio: 0.1,

        panelYRatio: 0.75
    };

    this.controlPanelParams['height'] = this.containerParams.height * this.controlPanelParams.panelYRatio;

    this.controlPanelParams['xInnerSpacer'] = this.controlPanelParams.xInnerOffsetRatio * this.containerParams.width;
    this.controlPanelParams['yInnerSpacer'] = this.controlPanelParams.yInnerOffsetRatio * this.containerParams.height;

    this.controlPanelParams['xBtnSpacer'] = (this.controlPanelParams.xBtnSpacerRatio * this.containerParams.width);
    this.controlPanelParams['yBtnSpacer'] = (this.controlPanelParams.yBtnSpacerRatio * this.containerParams.height);
    
    this.controlPanelParams['btnWidth'] = ((this.containerParams.width // full box width
                - (2 * this.controlPanelParams.xInnerSpacer) // left + right boundary spacer
                - ((this.controlPanelParams.numXButtons - 1) * this.controlPanelParams.xBtnSpacer)) // x-spacer between every button
                / this.controlPanelParams.numXButtons); // get per-button width
    this.controlPanelParams['btnHeight'] = ((this.controlPanelParams.height // adjusted height
                - (2 * this.controlPanelParams.yInnerSpacer) // top + bottom boundary spacer
                - ((this.controlPanelParams.numYButtons - 1) * this.controlPanelParams.yBtnSpacer)) // y-spacer between every button
                / this.controlPanelParams.numYButtons); // get per-button height
    
    this.controlPanelParams['textWidth'] = this.controlPanelParams.btnWidth * this.controlPanelParams.textWidthRatio;
    this.controlPanelParams['textHeight'] = this.controlPanelParams.btnHeight * this.controlPanelParams.textHeightRatio;

    // Icons
    this.iconsObjs = {
        server: {
            x: 100,
            y: 100
        },
        database: {
            x: 100,
            y: 100
        }
    };


    /* 
     * Objects inside the control panel (aka buttons)
     */
    this.controlPanelObjs = {
        // In top left
        addComponent: { 
            x: (this.controlPanelParams.x + this.controlPanelParams.xInnerSpacer), // left-most edge
            y: (this.controlPanelParams.y + this.controlPanelParams.yInnerSpacer) 
        },
        // In top right
        addConnection: { 
            x: ((this.controlPanelParams.x + this.controlPanelParams.width)
                    - this.controlPanelParams.xInnerSpacer // left-most edge
                    - (this.controlPanelParams.btnWidth)), // addComponent button
            y: (this.controlPanelParams.y + this.controlPanelParams.yInnerSpacer) 
        },
        // In bottom left
        removeComponent: { 
            x: (this.controlPanelParams.x + this.controlPanelParams.xInnerSpacer), // left-most edge
            y: ((this.controlPanelParams.y + this.controlPanelParams.yInnerSpacer) // top-most edge
                    + (this.controlPanelParams.yBtnSpacer + this.controlPanelParams.btnHeight)) // addComponent button
        }, 
        // In bottom right
        removeConnection: { 
            x: ((this.controlPanelParams.x + this.controlPanelParams.width) 
                    - this.controlPanelParams.xInnerSpacer // left-most edge
                    - (this.controlPanelParams.btnWidth)), // addComponent button
            y: ((this.controlPanelParams.y + this.controlPanelParams.yInnerSpacer) // top-most edge
                    + (this.controlPanelParams.yBtnSpacer + this.controlPanelParams.btnHeight)) // addConnection button
        } 
    };

    // Center text in buttons
    this.controlPanelObjs['textObjs'] = {};
    Object.entries(this.controlPanelObjs).forEach(([key, val]) => {
        this.controlPanelObjs.textObjs[key] = {
            x: val.x + (Math.abs(this.controlPanelParams.btnWidth / 2) 
                        - (this.controlPanelParams.textWidth / 2)),
            y: val.y + (Math.abs(this.controlPanelParams.btnHeight / 2) 
                        - (this.controlPanelParams.textHeight / 2))
        }
    });

    /* 
     * Info display --> for outputing information on an action
     * Define container properties
     */ 
    this.infoDisplayParams = {
        btnColor: this.controlPanelParams.btnColor,
        btnOpacity: this.controlPanelParams.btnOpacity,
        btnOutline: this.controlPanelParams.btnOutline,

        textColor: this.controlPanelParams.textColor,
        textOpacity: this.controlPanelParams.textOpacity,

        textWidthRatio: 0.75,
        textHeightRatio: 0.35,

        xBtnScale: 0.5,
        yBtnScale: 0.3,

        xInnerOffsetRatio: 0.01, 
        yInnerOffsetRatio: 0.03,
        
        xBtnSpacerRatio: 0.03
    };

    this.infoDisplayParams['btnWidth'] = this.controlPanelParams.btnWidth * this.infoDisplayParams.xBtnScale;
    this.infoDisplayParams['btnHeight'] = this.controlPanelParams.btnHeight * this.infoDisplayParams.yBtnScale;

    this.infoDisplayParams['xInnerSpacer'] = this.infoDisplayParams.xInnerOffsetRatio * this.controlPanelParams.width;
    this.infoDisplayParams['yInnerSpacer'] = this.infoDisplayParams.yInnerOffsetRatio * this.controlPanelParams.height;

    this.infoDisplayParams['xBtnSpacer'] = this.infoDisplayParams.xBtnSpacerRatio * this.infoDisplayParams.btnWidth;

    this.infoDisplayParams['x'] = this.containerParams.x;
    this.infoDisplayParams['y'] = ((this.containerParams.y + this.containerParams.height) - this.infoDisplayParams.btnHeight);
    
    this.infoDisplayParams['textWidth'] = this.infoDisplayParams.btnWidth * this.infoDisplayParams.textWidthRatio;
    this.infoDisplayParams['textHeight'] = this.infoDisplayParams.btnHeight * this.infoDisplayParams.textHeightRatio;
    
    /* 
     * Objects that make up the info display interface (aka buttons)
     */
    this.infoDisplayObjs = {
        printSpecs: { 
            x: (this.infoDisplayParams.x + this.infoDisplayParams.xInnerSpacer), // left-most edge
            y: (this.infoDisplayParams.y - this.infoDisplayParams.yInnerSpacer) 
        },
        printState: { 
            x: ((this.infoDisplayParams.x + this.infoDisplayParams.xInnerSpacer) // left-most edge
                + (this.infoDisplayParams.xBtnSpacer + this.infoDisplayParams.btnWidth)), // printSpecs button + spacer
            y: (this.infoDisplayParams.y - this.infoDisplayParams.yInnerSpacer) 
        }
    };

    // Center text in buttons
    this.infoDisplayObjs['textObjs'] = {};
    Object.entries(this.infoDisplayObjs).forEach(([key, val]) => {
        this.infoDisplayObjs.textObjs[key] = {
            x: val.x + (Math.abs(this.infoDisplayParams.btnWidth / 2) 
                        - (this.infoDisplayParams.textWidth / 2)),
            y: val.y + (Math.abs(this.infoDisplayParams.btnHeight / 2) 
                        - (this.infoDisplayParams.textHeight / 2))
        }
    });
    
};

TestPanel.prototype.addIconText = function(text, pos) {
    k.add([
        k.text(text, {
          size: width * height * 0.000025,
        }),
        k.pos(pos),
        origin("center"),
    ]);
}

TestPanel.prototype.addStaticIcon = function(sprite, pos) {
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

let curDraggin = null;

function drag() {
    let offset = k.vec2(0);

    return {
        id: "drag",
        require: [ "pos", "area", ],
        add() {
            this.clicks(() => {
                if (curDraggin) {
                    return;
                }
        
                curDraggin = this;
                offset = k.mousePos().sub(this.pos);
                k.readd(this);
            });
        },
    update() {
            if (curDraggin === this) {
                k.cursor("move");
                this.pos = k.mousePos().sub(offset);
            }
        },
    };
}

TestPanel.prototype.addDragableIcon = function(sprite, pos) {
    return k.add([
        k.sprite(sprite),
        k.pos(pos),
        k.area(),
        k.scale(width * height * 0.00000014),
        origin("center"),
        drag(),
        k.color(255, 255, 255),
        k.mouseRelease(() => {
            curDraggin = null;
            const mouseX = k.mousePos().x
            const mouseY = k.mousePos().y
            const leftBorder = this.containerParams.x
            const rightBorder = this.containerParams.x + this.containerParams.width
            const upBorder = this.containerParams.y
            const bottomBorder = this.containerParams.y + this.containerParams.height
            if (mouseX >= leftBorder && mouseX <= rightBorder && mouseY >= upBorder && mouseY <= bottomBorder) {
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
TestPanel.prototype.buildObject = function() {

    // k.add([
    //     k.text("TEST - screenX & Y"),
    //     k.pos(vec2(this.screenParams.screenX, this.screenParams.screenY))
    // ])

    // k.add([
    //     k.text("TEST - screenWidth & Height"),
    //     k.pos(vec2(this.screenParams.screenWidth - 100, this.screenParams.screenHeight))
    // ])


    var self = this;
    /*
     * Control panel buttons for event testing 
     */
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


    const dragableVec = k.vec2(width * 0.15, height * 0.89);
    this.serverBtn.clicks(() => {
        this.addDragableIcon("server", dragableVec);
        // this.controls.placeComponent(k.vec2(width * 0.02, height * 0.3), "WEB_SERVER");
    });

    this.routerBtn.clicks(() => {
        this.addDragableIcon("router", dragableVec);
    });

    this.cacheBtn.clicks(() => {
        this.addDragableIcon("cache", dragableVec);
    });

    this.databaseBtn.clicks(() => {
        this.addDragableIcon("database", dragableVec);
    });

    this.desktopBtn.clicks(() => {
        this.addDragableIcon("desktop", dragableVec);
    });

    this.hubBtn.clicks(() => {
        this.addDragableIcon("hub", dragableVec);
    });




    /*
    Add Component Button
    this.addComponentBtn = k.add([
        k.rect(this.controlPanelParams.btnWidth, this.controlPanelParams.btnHeight),
        k.pos(this.controlPanelObjs.addComponent.x, this.controlPanelObjs.addComponent.y),
        k.area(),
        this.controlPanelParams.btnColor,
        this.controlPanelParams.btnOpacity,
        this.controlPanelParams.btnOutline,
        'button',
    ]);
    this.addComponentBtn.clicks(() => {
        // chose random x, y, name for testing right now
        // FIXME: Currently hardcoded. Might need to have this flip a boolean
        // to indicate the system is waiting for the user to click again for 
        // the location to place the component? 
        let x = 100;
        let y = 300;
        let name = 'IPHONE';
        this.controls.placeComponent(vec2(x,y), name);
    });

    k.add([
        k.text('Add Component', { size: this.controlPanelParams.textHeight, 
                                    width: this.controlPanelParams.textWidth }),
        k.pos(this.controlPanelObjs.textObjs.addComponent.x, 
                this.controlPanelObjs.textObjs.addComponent.y),
        this.controlPanelParams.textColor,
        this.controlPanelParams.textOpacity,
    ]);
            
    // Add Connection Button
    this.addConnectionBtn = k.add([
        k.rect(this.controlPanelParams.btnWidth, this.controlPanelParams.btnHeight),
        k.pos(this.controlPanelObjs.addConnection.x, this.controlPanelObjs.addConnection.y),
        k.area(),
        this.controlPanelParams.btnColor,
        this.controlPanelParams.btnOpacity,
        this.controlPanelParams.btnOutline,
        'button',
    ]);
    this.addConnectionBtn.clicks(this.controls.connect);
    
    k.add([
        k.text("Connect", { size: this.controlPanelParams.textHeight, 
                                width: this.controlPanelParams.textWidth }),
        k.pos(this.controlPanelObjs.textObjs.addConnection.x, 
                this.controlPanelObjs.textObjs.addConnection.y),
        this.controlPanelParams.textColor,
        this.controlPanelParams.textOpacity,
    ]);

    // Remove component
    this.removeComponentBtn = k.add([
        k.rect(this.controlPanelParams.btnWidth, this.controlPanelParams.btnHeight),
        k.pos(this.controlPanelObjs.removeComponent.x, this.controlPanelObjs.removeComponent.y),
        k.area(),
        this.controlPanelParams.btnColor,
        this.controlPanelParams.btnOpacity,
        this.controlPanelParams.btnOutline,
        'button',
    ]);
    this.removeComponentBtn.clicks(this.controls.removeComponent);
    
    k.add([
        k.text("Remove Component", { size: this.controlPanelParams.textHeight, 
                                        width: this.controlPanelParams.textWidth }),
        k.pos(this.controlPanelObjs.textObjs.removeComponent.x, 
                this.controlPanelObjs.textObjs.removeComponent.y),
        this.controlPanelParams.textColor,
        this.controlPanelParams.textOpacity,
    ]);

    this.removeConnectionBtn = k.add([
        k.rect(this.controlPanelParams.btnWidth, this.controlPanelParams.btnHeight),
        k.pos(this.controlPanelObjs.removeConnection.x, this.controlPanelObjs.removeConnection.y),
        k.area(),
        this.controlPanelParams.btnColor,
        this.controlPanelParams.btnOpacity,
        this.controlPanelParams.btnOutline,
        'button',
    ]);
    this.removeConnectionBtn.clicks(this.controls.disconnect);

    k.add([
        k.text("Disconnect", { size: this.controlPanelParams.textHeight, 
                                width: this.controlPanelParams.textWidth }),
        k.pos(this.controlPanelObjs.textObjs.removeConnection.x, 
                this.controlPanelObjs.textObjs.removeConnection.y),
        this.controlPanelParams.textColor,
        this.controlPanelParams.textOpacity,
    ]);
    */

    /*
    
    // Info display 

    // Print specs
    this.printSpecsBtn = k.add([
        k.rect(this.infoDisplayParams.btnWidth, this.infoDisplayParams.btnHeight),
        k.pos(this.infoDisplayObjs.printSpecs.x, this.infoDisplayObjs.printSpecs.y),
        k.area(),
        this.infoDisplayParams.btnColor,
        this.infoDisplayParams.btnOpacity,
        this.infoDisplayParams.btnOutline,
        'button', 
    ]);
    this.printSpecsBtn.clicks(() => {
        self.printSpecs();
    });
    k.add([
        k.text("Print Lvl Specs", { size: this.infoDisplayParams.textHeight, width: this.infoDisplayParams.textWidth }),
        k.pos(this.infoDisplayObjs.textObjs.printSpecs.x, this.infoDisplayObjs.textObjs.printSpecs.y),
        this.infoDisplayParams.textColor,
        this.infoDisplayParams.textOpacity,
    ]);

    // Print state
    this.printStateBtn = k.add([
        k.rect(this.infoDisplayParams.btnWidth, this.infoDisplayParams.btnHeight),
        k.pos(this.infoDisplayObjs.printState.x, this.infoDisplayObjs.printState.y),
        k.area(),
        this.infoDisplayParams.btnColor,
        this.infoDisplayParams.btnOpacity,
        this.infoDisplayParams.btnOutline,
        'button',
    ]);
    this.printStateBtn.clicks(() => {
        self.printState();
    });
    k.add([
        k.text("Print Curr State", { size: this.infoDisplayParams.textHeight, 
                                        width: this.infoDisplayParams.textWidth }),
        k.pos(this.infoDisplayObjs.textObjs.printState.x, 
                    this.infoDisplayObjs.textObjs.printState.y),
        this.infoDisplayParams.textColor,
        this.infoDisplayParams.textOpacity,
    ]);
    */
}

TestPanel.prototype.printSpecs = function() {
    console.log(`-- Level ${this.level.number} Specs --`);
    console.log(this.level.specs);
};

TestPanel.prototype.printState = function() {
    console.log(`-- Level ${this.level.number} State --`);
    console.log(State);
};

// TestPanel.prototype.connectControls = function(userControls) {
//     // chose random x, y, name for testing right now
//     let x = 100;
//     let y = 300;
//     let name = 'iphone';
//     this.addComponentBtn.clicks(() => {
//         userControls.placeComponent(x, y, name);
//     });

//     this.addConnectionBtn.clicks(userControls.connect);

//     this.removeComponentBtn.clicks(userControls.removeComponent);

//     this.removeConnectionBtn.clicks(userControls.disconnect);
// }

export default TestPanel;