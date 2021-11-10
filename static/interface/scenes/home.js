
/* 
Object used as the home page/main menu of the game.


GRAPHIC SPACING DEFINITIONS

Legend:
- yO & xO = yOffset & xOffset --> provide ability to "offset" object from center
- yOS & xOS = yOuterSpacer & xOuterSpacer --> gives "cusion" between outer objects
- yIS & xIS = yInnerSpacer & yInnerSpacer --> gives "cusion" between inner objects

                        (PARENT OBJECT (aka Window/Screen))
________________________________________________________________________________
|                                        | yO                                  |
|                                       --                                     |
|                                        | yOS                                 |
|          ______________________________________________________________      |
|          |                             | yIS                          |      |
|          |                            --                              |      |
|          |                                                            |      |
|          |                                                            |      |
|          |                                                            |      |
| -- | --  | -- |                                                       |      |
| xO | xOS | xIS                                                        |      |
|          |                                                            |      |
|          |                                                            |      |
|          |                                                            |      |
|          |                                                            |      |
|          |                (CHILD OBJECT (aka MenuBox))                |      |
|          --------------------------------------------------------------      |
|                                                                              |
|                                                                              |
--------------------------------------------------------------------------------
*/

import k from '../kaboom/index.js';
import { SceneControls } from '../interface.js';

// Constant image size
const backgroundImgWidth = 1200;
const backgroundImgHeight = 800;

export function Home(levelOneFunc) {
    this.levelOneFunc = levelOneFunc;
    this.init();

    // necessary to preserve `this` reference (check out arrow functions if unfamiliar)
    this.scene = () => { this.buildScene(); };
};

/**
 * Initialize all parameters (sizing, position, spacing...) for the welcome scene
 */
Home.prototype.init = function() {
    
    this.params = {
        screenX: 0, // minimum x value relative to screenWidth
        screenY: 0, // minimum y value relative to screenHeight
        screenWidth: k.width(), // total screen width
        screenHeight: k.height(), // total screen height

        backdropColor: k.color(180, 200, 250), // backdrop color (behind transparent image)
        backdropOpacity: k.opacity(1), // opacity of backdrop

        titleWidthRatio: 0.35, // ratio compared to the screen width
        titleHeightRatio: 0.08, // ratio compared to the screen height
        yTitleOffsetRatio: 0.75, // ratio of y-spacing from screen top based on title height

        menuBox: {
            backgroundColor: k.color(52, 149, 235), // background color of the menu box
            backgroundOpacity: k.opacity(0.5), // opacity of the menu box
            
            numXButtons: 1, // number of buttons stacked vertically
            numYButtons: 3, // number of buttons positioned horizontally
            buttonColor: k.color(0, 0, 0), // universal color of the menu buttons
            buttonOpacity: k.opacity(0.9), // universal opacity of the menu buttons

            textColor: k.color(255, 255, 255), // universal color of the menu buttons' text
            textOpacity: k.opacity(0.9), // universal opacity of the menu buttons' text

            yOffsetRatio: 0.7, // ratio of spacing from top of screen (offets menu lower from center)

            xInnerOffsetRatio: 0.03, // ratio of distance from left/right-most objects to menu left/right boundary
            yInnerOffsetRatio: 0.04, // ratio of distance from top/bottom of objects to menu top/bottom

            xOuterOffsetRatio: 0.42, // ratio of distance from screen left/right to boundary of menu
            yOuterOffsetRatio: 0.2, // ratio of distance from screen top/button to boundary of menu

            xButtonSpacerRatio: 0.1, // ratio of x-spacing ratio based on button width
            yButtonSpacerRatio: 0.1, // ratio of y-spacing ratio based on button height

            textWidthRatio: 0.65, // ratio of text width based on button width
            textHeightRatio: 0.5 // ratio of text height based on button height
        }
    };

    // Ratio for the background image size
    this.params['backgroundImgRatio'] = Math.min(this.params.screenWidth / backgroundImgWidth, 
                                                this.params.screenHeight / backgroundImgHeight);
    
    // Adjusted width/height for the background image
    this.params['backgroundWidth'] = this.params.backgroundRatio * backgroundImgWidth;
    this.params['backgroundHeight'] = this.params.backgroundRatio * backgroundImgHeight;
    
    // Adjusted width/height for the title text
    this.params['titleWidth'] = this.params.screenWidth * this.params.titleWidthRatio;
    this.params['titleHeight'] = this.params.screenHeight * this.params.titleHeightRatio;

    // Calculated distance between top of title and top of screen
    this.params['yTitleSpacer'] = this.params.titleHeight * this.params.yTitleOffsetRatio;


    let menuBoxParams = this.params.menuBox;

    // Set spacing between the top of the screen and the top of the menu box
    this.params['yOffsetSpacer'] = this.params.screenHeight * menuBoxParams.yOffsetRatio;

    // Set spacing between the boundary of the menu box and it's neighbors (essentially expand it's bounding box)
    menuBoxParams['xOuterSpacer'] = this.params.screenWidth * menuBoxParams.xOuterOffsetRatio;
    menuBoxParams['yOuterSpacer'] = (this.params.screenHeight - this.params.yOffsetSpacer) * menuBoxParams.yOuterOffsetRatio;

    // Calculated width/height of the menu box based on the previously defined spacers and screen dimensions
    menuBoxParams['width'] = (this.params.screenWidth - (menuBoxParams.xOuterSpacer * 2));
    menuBoxParams['height'] = ((this.params.screenHeight  - this.params.yOffsetSpacer) - (menuBoxParams.yOuterSpacer * 2));

    // x & y of top-left cornor of the menu box
    menuBoxParams['x'] = (this.params.screenX + ((this.params.screenWidth - menuBoxParams.width) / 2)); // init x + half screen width - half panel width
    menuBoxParams['y'] = (this.params.screenY + ((this.params.screenHeight - menuBoxParams.height + this.params.yOffsetSpacer) / 2)); // init y + half screen height - half panel height + offsetSpacer

    // Spacer between the boundary of the menu box and it's internal components
    menuBoxParams['xInnerSpacer'] = menuBoxParams.width * menuBoxParams.xInnerOffsetRatio;
    menuBoxParams['yInnerSpacer'] = menuBoxParams.height * menuBoxParams.yInnerOffsetRatio; 

    // x & y spacers between each button
    menuBoxParams['xBtnSpacer'] = menuBoxParams.width * menuBoxParams.xButtonSpacerRatio;
    menuBoxParams['yBtnSpacer'] = menuBoxParams.height * menuBoxParams.yButtonSpacerRatio;

    // Calculated button width/height based on the menu box sizing and spacers
    menuBoxParams['btnWidth'] = ((menuBoxParams.width // full box width
        - (2 * menuBoxParams.xInnerSpacer) // left + right boundary spacer
        - ((menuBoxParams.numXButtons - 1) * menuBoxParams.xBtnSpacer)) // x-spacer between every button
        / menuBoxParams.numXButtons); // get per-button width
    menuBoxParams['btnHeight'] = ((menuBoxParams.height // adjusted height
        - (2 * menuBoxParams.yInnerSpacer) // top + bottom boundary spacer
        - ((menuBoxParams.numYButtons - 1) * menuBoxParams.yBtnSpacer)) // y-spacer between every button
        / menuBoxParams.numYButtons); // get per-button height
    
    // Adjusted menu button text width/size based on button sizing
    menuBoxParams['textWidth'] = menuBoxParams.btnWidth * menuBoxParams.textWidthRatio;
    menuBoxParams['textHeight'] = menuBoxParams.btnHeight * menuBoxParams.textHeightRatio;
    
    /* 
     * Objects inside the menu (aka buttons)
     */
    this.objects = {};
    
    // The title text at the top of the screen
    this.objects['title'] = {
        width: this.params.titleWidth,
        height: this.params.titleHeight,
        x: this.params.screenWidth / 2,
        y: (this.params.screenY + this.params.yTitleSpacer)
    }

    // The various menu box buttons
    this.objects['play'] = {
        x: (menuBoxParams.x + menuBoxParams.xInnerSpacer),
        y: (menuBoxParams.y + menuBoxParams.yInnerSpacer)
    };
    this.objects['leaderboard'] = {
        x: (this.objects.play.x),
        y: (this.objects.play.y + (menuBoxParams.btnHeight + menuBoxParams.yBtnSpacer))
    };
    this.objects['settings'] = {
        x: (this.objects.leaderboard.x),
        y: (this.objects.leaderboard.y + (menuBoxParams.btnHeight + menuBoxParams.yBtnSpacer))
    };

    // Centers all of the button text
    this.objects['textObjs'] = {};
    Object.entries(this.objects).forEach(([key, val]) => {
        this.objects.textObjs[key] = {
            x: val.x + (Math.abs(menuBoxParams.btnWidth / 2) 
                        - (menuBoxParams.textWidth / 2)),
            y: val.y + (Math.abs(menuBoxParams.btnHeight / 2) 
                        - (menuBoxParams.textHeight / 2))
        }
    });
};


/**
 * Adds all of the scene's objects to the screen using the initialized parameters
 */
Home.prototype.buildScene = function() {
    // Backdrop color
    k.add([
        k.rect(this.params.screenWidth, this.params.screenHeight),
        k.pos(this.params.screenX, this.params.screenY),
        this.params.backdropColor,
        this.params.backdropOpacity,
    ]);
    
    // Background image
    k.add([
        k.sprite('home_background', { width: this.params.backgroundWidth, 
                                height: this.params.backgroundHeight}),
        k.pos(this.params.screenWidth / 2, this.params.screenHeight / 2),
        k.origin('center'),
    ]);
    
    // Title
    k.add([
        k.text('Captain Client', { size: this.objects.title.height, width: this.objects.title.width }),
        k.pos(this.objects.title.x, this.objects.title.y),
        k.origin('center')
    ]);

    // Menu Box
    k.add([
        k.rect(this.params.menuBox.width, this.params.menuBox.height),
        k.pos(this.params.menuBox.x, this.params.menuBox.y),
        this.params.menuBox.backgroundColor,
        this.params.menuBox.backgroundOpacity,
    ]);
        

    // Play Button
    const playBtn = k.add([
        k.rect(this.params.menuBox.btnWidth, this.params.menuBox.btnHeight),
        k.pos(this.objects.play.x, this.objects.play.y),
        this.params.menuBox.buttonColor,
        this.params.menuBox.buttonOpacity,
        k.area(),
    ]);

    k.add([
        k.text('Play', { size: this.params.menuBox.textHeight, width: this.params.menuBox.textWidth }),
        k.pos(this.objects.textObjs.play.x, this.objects.textObjs.play.y),
        this.params.menuBox.textColor,
        this.params.menuBox.textOpacity,
    ]);
            

    // Leaderboard
    const leaderboardBtn = k.add([
        k.rect(this.params.menuBox.btnWidth, this.params.menuBox.btnHeight),
        k.pos(this.objects.leaderboard.x, this.objects.leaderboard.y),
        this.params.menuBox.buttonColor,
        this.params.menuBox.buttonOpacity,
        k.area(),
    ]);

    k.add([
        k.text("Leaderboard", { size: this.params.menuBox.textHeight, width: this.params.menuBox.textWidth }),
        k.pos(this.objects.textObjs.leaderboard.x, this.objects.textObjs.leaderboard.y),
        this.params.menuBox.textColor,
        this.params.menuBox.textOpacity,
    ]);


    // Settings
    const settings_btn = k.add([
        k.rect(this.params.menuBox.btnWidth, this.params.menuBox.btnHeight),
        k.pos(this.objects.settings.x, this.objects.settings.y),
        this.params.menuBox.buttonColor,
        this.params.menuBox.buttonOpacity,
        k.area(),
    ]);

    k.add([
        k.text("Settings", { size: this.params.menuBox.textHeight, width: this.params.menuBox.textWidth }),
        k.pos(this.objects.textObjs.settings.x, this.objects.textObjs.settings.y),
        this.params.menuBox.textColor,
        this.params.menuBox.textOpacity,
    ]);

    // Connect buttons to control functions
    playBtn.clicks(this.levelOneFunc);
    leaderboardBtn.clicks(SceneControls.goLeaderboard);
    settings_btn.clicks(SceneControls.goSettings);
};


export default Home;
