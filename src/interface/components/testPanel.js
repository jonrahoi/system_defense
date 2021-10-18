/*
 * Graphic object for testing various features. Can be injected into the 'PlayField'
 * scene and used as a way to generate signals/events in a more simplified way
 * than what finished development will look like (ie. click a button rather than
 * drag and drop an object)
 */


import k from '../kaboom.js';

import ViewComponent from './viewComponent.js';
import { State } from '../../shared/state.js';


/* ********************************************************************** *
*                      Graphic object definitions                        *
* ********************************************************************** */
export function TestPanel(level, screenX, screenY, screenWidth, screenHeight) {

    this.level = level;

    this.buildParameters(level, screenX, screenY, screenWidth, screenHeight);

    this.connect = (controls) => { this.controls = controls; };
    this.build = () => { this.buildObject(); };
}


TestPanel.prototype.buildParameters = function(level, screenX, screenY, screenWidth, screenHeight) {

    this.containerParams = {
        backgroundColor: k.color(100, 160, 200),
        backgroundOpacity: k.opacity(0.5),
        backgroundOutline: k.outline(2, k.color(0, 0, 0)),

        xOuterOffsetRatio: 0.1, 
        yOuterOffsetRatio: 0.1,
    };

    this.containerParams['xOuterSpacer'] = this.containerParams.xOuterOffsetRatio * screenWidth;
    this.containerParams['yOuterSpacer'] = this.containerParams.yOuterOffsetRatio * screenHeight;

    this.containerParams['width'] = (screenWidth // full screen width
                - (2 * this.containerParams.xOuterSpacer)); // boundary between screen and box
    this.containerParams['height'] = (screenHeight // full screen height
                - (2 * this.containerParams.yOuterSpacer)); // boundary between screen and box
    
    this.containerParams['x'] = (screenX + ((screenWidth - this.containerParams.width) / 2)); // init x + half screen width - half panel width
    this.containerParams['y'] = (screenY + ((screenHeight - this.containerParams.height) / 2)); // init y + half screen height - half panel height



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

/* ********************************************************************** *
*                  Add containers & objects to view                      *
* ********************************************************************** */
TestPanel.prototype.buildObject = function() {
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
    ]);
        
    // Add Component Button
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
        this.controls.placeComponent(x, y, name);
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

    /*
     * Info display 
     */
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
        k.text("Print Lvl Specs", { size: this.infoDisplayParams.textHeight, 
                                        width: this.infoDisplayParams.textWidth }),
        k.pos(this.infoDisplayObjs.textObjs.printSpecs.x, 
                this.infoDisplayObjs.textObjs.printSpecs.y),
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
