/*
 * Graphic "bar" similar to the 'banner' object which is displayed over
 * the game field during play. This displays game state information such
 * as current score, # of coins, time remaining, etc. It also holds the time
 * control buttons. Again, due to different screen sizing and the way Kaboom
 * implements object placement, the code gets a bit complicated. Totally okay
 * to wipe this out and restart with the intent of simplifying. 
 */


import k from "../kaboom.js";

import TimerControls from '../utilities/timer.js';
import State from '../../shared/state.js';

/*
    * ------------------------------ BANNER -----------------------------------
    * USFLogo USFCSLogo               TITLE  CapLogo  HOME VOLUME/MUTE SETTINGS
    * ---------------------------- STATUS BAR ---------------------------------
    * LEVEL X SCORE X COINS X              COMPLETE/GOAL TIME PLAY|PAUSE|RESTART
*/

// ALL ICONS HAVE SAME SIZE (512p x 512p)
const iconWidth = 512;
const iconHeight = 512;

export function StatusBar(screenX, screenY, screenWidth, screenHeight) {

    // Register function to update status bar with timer increments
    TimerControls.register(this.updateState, this, TimerControls.RegistrationTypes.SPEEDUP_INTERVAL);
    // TimerControls.register(this.handleClock, this, TimerControls.RegistrationTypes.SPEEDUP_INTERVAL);

    this.buildParameters(screenX, screenY, screenWidth, screenHeight);

    // expose functions to ensure correct context
    this.build = () => { this.buildObject(); };
};


StatusBar.prototype.buildParameters = function(screenX, screenY, screenWidth, screenHeight) {

    /* ********************************************************************** *
     *                      Graphic object definitions                        *
     * ********************************************************************** */

    const heightRatio = 0.03; // the height of the banner based on the given screenHeight

    /*
     * Status Bar --> displayed under banner and updates with game play
     * Container specs
     */
    this.params = { 
        x: screenX, 
        y: screenY,
        width: screenWidth,
        backgroundColor: k.color(135, 145, 160),
        backgroundOpacity: k.opacity(1),

        xInnerOffsetRatio: 0.01, // distance from left/right-most objects to banner left/right boundary
        yInnerOffsetRatio: 0.15, // distance from top/bottom of objects to banner top/bottom        

        iconXSpacerRatio: 0.2, // spacing ratio based on scaled icon width
        iconYSpacerRatio: 0.0,

        controlIconScale: 0.85, // used to resize the control icons (play, pause, restart...)
        constrolIconXSpacerRatio: 0.35 // spacing ratio based on scaled icon width
    };

    this.params['height'] = screenHeight * heightRatio;
    this.params['iconRatio'] = Math.min((this.params.width / iconWidth), 
                                        (this.params.height / iconHeight));
    
    this.params['xInnerSpacer'] = this.params.xInnerOffsetRatio * this.params.width;
    this.params['yInnerSpacer'] = this.params.yInnerOffsetRatio * this.params.height;

    this.params['iconWidth'] = (iconWidth - this.params.xInnerSpacer) * this.params.iconRatio;
    this.params['iconHeight'] = (iconHeight - this.params.yInnerSpacer) * this.params.iconRatio;

    this.params['xObjSpacer'] = this.params.iconWidth * this.params.iconXSpacerRatio;
    this.params['yObjSpacer'] = this.params.iconHeight * this.params.iconYSpacerRatio;

    this.params['controlIcons'] = { // icons with actions (home, volume, settings)
        width: iconWidth * this.params.iconRatio * this.params.controlIconScale, // scaled width based on above ratio
        height: iconHeight * this.params.iconRatio * this.params.controlIconScale // scaled height based on above ratio
    };
    this.params['controlIcons'].xSpacer = this.params.controlIcons.width * this.params.constrolIconXSpacerRatio;
    this.params['controlIcons'].ySpacer = (this.params.height / 2) - (this.params.controlIcons.height / 2);

    this.params['textObjs'] = { // would be nice if these could auto-size...
        level: {
            width: this.params.iconWidth * 1.5,
            height: this.params.iconHeight * 0.95
        },

        // These need to be larger (longer)

        score: {
            width: this.params.iconWidth * 3,
            height: this.params.iconHeight * 0.95
        },
        coins: {
            width: this.params.iconWidth * 3,
            height: this.params.iconHeight * 0.95
        },
        time: {
            width: this.params.iconWidth * 3,
            height: this.params.iconHeight * 0.95
        },
        requests: {
            width: this.params.iconWidth * 4,
            height: this.params.iconHeight * 0.95
        }
    };
    this.params['height'] += (2 * this.params.yInnerSpacer); // essentially add the ySpacer to the bottom


    /* 
     * Objects inside the status bar (aka buttons and icons)
     */
    this.objects = {};
    
    // Use LEFT edge as reference //

    this.objects['levelIcon'] = { 
        x: (this.params.x + this.params.xInnerSpacer), // left-most edge
        y: (this.params.y + this.params.yObjSpacer + this.params.yInnerSpacer) 
    };
    
    this.objects['levelText'] = {  
        x: (this.objects.levelIcon.x + this.params.iconWidth + this.params.xObjSpacer), // level icon + spacer for this text
        y:  (this.objects.levelIcon.y
            + ((this.params.iconHeight / 2)
            - (this.params.textObjs.level.height / 2))), // add offset for text height
        width: this.params.textObjs.level.width,
        height: this.params.textObjs.level.height
    };
    
    this.objects['scoreIcon'] = {
        x: (this.objects.levelText.x + this.objects.levelText.width + this.params.xObjSpacer), // level text + spacer
        y: (this.params.y + this.params.yObjSpacer + this.params.yInnerSpacer) 
    };
    
    this.objects['scoreText'] = {
        x: (this.objects.scoreIcon.x + this.params.iconWidth + this.params.xObjSpacer), // score icon + spacer
        y: ((this.objects.scoreIcon.y)
            + ((this.params.iconHeight / 2)
            - (this.params.textObjs.score.height / 2))), // add offset for text height
        width: this.params.textObjs.score.width,
        height: this.params.textObjs.score.height
    };

    this.objects['coinsIcon'] = {
        x: (this.objects.scoreText.x + this.objects.scoreText.width + this.params.xObjSpacer), // score text + spacer
        y: (this.params.y + this.params.yObjSpacer + this.params.yInnerSpacer)
    };
    
    this.objects['coinsText'] = {
        x: (this.objects.coinsIcon.x + this.params.iconWidth + this.params.xObjSpacer),// coins icon + spacer
        y: ((this.objects.coinsIcon.y)
            + ((this.params.iconHeight / 2)
            - (this.params.textObjs.coins.height / 2))), // add offset for text height
        width: this.params.textObjs.coins.width,
        height: this.params.textObjs.coins.height
    };

    // Use mid line as reference //
    this.objects['requestsIcon'] = {
        x: ((this.params.x + (this.params.width / 2)) // mid point of bar
            - ((this.params.iconWidth + this.params.textObjs.requests.width) / 2)), // half req icon & text (bundled)
        y: (this.params.y + this.params.yObjSpacer + this.params.yInnerSpacer)
    };

    this.objects['requestsText'] = {
        x: (this.objects.requestsIcon.x
            + (this.params.iconWidth) // half req icon & text (bundled)
            + (this.params.xObjSpacer)), // spacer for this text
        y: ((this.objects.requestsIcon.y)
            + ((this.params.iconHeight / 2)
            - (this.params.textObjs.requests.height / 2))), // add offset for text height
        width: this.params.textObjs.requests.width,
        height: this.params.textObjs.requests.height
    };

    // Use RIGHT edge as reference //

    this.objects['restartIcon'] = {
        x: ((this.params.x + this.params.width) // furthest right edge
            - (this.params.xInnerSpacer) // offset
            - this.params.controlIcons.width), // this icon 
        y: (this.params.y + this.params.controlIcons.ySpacer + this.params.yInnerSpacer)
    };

    this.objects['fastForwardIcon'] = {
        x: (this.objects.restartIcon.x - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // fastForward icon + spacer
        y: (this.params.y + this.params.controlIcons.ySpacer + this.params.yInnerSpacer)
    };

    this.objects['pauseIcon'] = {
        x: (this.objects.fastForwardIcon.x - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // restart icon + spacer
        y: (this.params.y + this.params.controlIcons.ySpacer + this.params.yInnerSpacer)
    };

    this.objects['playIcon'] = {
        x: (this.objects.pauseIcon.x - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // pause icon + spacer
        y: (this.params.y + this.params.controlIcons.ySpacer + this.params.yInnerSpacer)
    };
    
    this.objects['timeText'] = { 
        x: (this.objects.playIcon.x - (this.params.textObjs.time.width + (this.params.controlIcons.xSpacer * 3))), // play icon + spacer
        y: ((this.objects.playIcon.y)
            + ((this.params.iconHeight / 2)
            - (this.params.textObjs.time.height / 2))), // add offset for text height
        width: this.params.textObjs.time.width,
        height: this.params.textObjs.time.height
    };

    this.objects['timeIcon'] = {
        x: (this.objects.timeText.x - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // time icon + spacer 
        y: (this.params.y + this.params.yObjSpacer + this.params.yInnerSpacer) 
    };

    this.dimensions = (() => {
        const dim = {
            x: this.params.x,
            y: this.params.y,
            width: this.params.width,
            height: this.params.height
        };
        return dim;
    })();
};



/* ********************************************************************** *
*                  Add containers & objects to view                      *
* ********************************************************************** */
StatusBar.prototype.buildObject = function() {

    // Status bar container
    k.add([
        k.rect(this.params.width, this.params.height),
        k.pos(this.params.x, this.params.y),
        this.params.backgroundColor,
        this.params.backgroundOpacity
    ]);

    // Level icon
    k.add([
        k.sprite('level', { width: this.params.iconWidth, 
                            height: this.params.iconHeight }),
        k.pos(this.objects.levelIcon.x, this.objects.levelIcon.y),
    ]);

    // Level text
    this.levelText = k.add([
        k.text(State.level, { size: this.objects.levelText.height, 
                        width: this.objects.levelText.width }),
        k.pos(this.objects.levelText.x, this.objects.levelText.y),
    ]);

    // Score icon
    k.add([
        k.sprite('score', { width: this.params.iconWidth, 
                            height: this.params.iconHeight }),
        k.pos(this.objects.scoreIcon.x, this.objects.scoreIcon.y),
    ]);

    // Score text
    this.scoreText = k.add([
        k.text(State.score, { size: this.objects.scoreText.height, 
                            width: this.objects.scoreText.width }),
        k.pos(this.objects.scoreText.x, this.objects.scoreText.y),
    ]);

    // Coins icon
    k.add([
        k.sprite('coins', { width: this.params.iconWidth, 
                            height: this.params.iconHeight }),
        k.pos(this.objects.coinsIcon.x, this.objects.coinsIcon.y),
    ]);

    // Coins text
    this.coinsText = k.add([
        k.text(State.coins, { size: this.objects.coinsText.height, 
                            width: this.objects.coinsText.width }),
        k.pos(this.objects.coinsText.x, this.objects.coinsText.y),
    ]);

    // Requests icon
    k.add([
        k.sprite('requests', { width: this.params.iconWidth, 
                                height: this.params.iconHeight }),
        k.pos(this.objects.requestsIcon.x, this.objects.requestsIcon.y),
    ]);

    // Requests text
    let reqText = State.numCompletedReqs + '/' + State.goal;
    this.requestsText = k.add([
        k.text(reqText, { size: this.objects.requestsText.height, 
                            width: this.objects.requestsText.width }),
        k.pos(this.objects.requestsText.x, this.objects.requestsText.y),
    ]);

    // Timer icon
    k.add([
        k.sprite('timer', { width: this.params.iconWidth, 
                            height: this.params.iconHeight }),
        k.pos(this.objects.timeIcon.x, this.objects.timeIcon.y),
    ]);

    // Time text
    this.timeText = k.add([
        k.text(prettifyTime(TimerControls.remaining()), { size: this.objects.timeText.height, 
                            width: this.objects.timeText.width }),
        k.pos(this.objects.timeText.x, this.objects.timeText.y),
    ]);

    // Play icon
    this.playBtn = k.add([
        k.sprite('play', { width: this.params.controlIcons.width, 
                            height: this.params.controlIcons.height }),
        k.pos(this.objects.playIcon.x, this.objects.playIcon.y),
        k.area(),
        "play",
    ]);
    this.playBtn.clicks(TimerControls.play);

    // Pause icon
    this.pauseBtn = k.add([
        k.sprite('pause', { width: this.params.controlIcons.width, 
                            height: this.params.controlIcons.height }),
        k.pos(this.objects.pauseIcon.x, this.objects.pauseIcon.y),
        k.area(),
    ]);
    this.pauseBtn.clicks(TimerControls.pause);

    // Restart icon
    this.restartBtn = k.add([
        k.sprite('restart', { width: this.params.controlIcons.width, 
                                height: this.params.controlIcons.height }),
        k.pos(this.objects.restartIcon.x, this.objects.restartIcon.y),
        k.area(),
    ]);
    this.restartBtn.clicks(TimerControls.restart);

    // Fast forward icon
    this.fastForwardBtn = k.add([
        k.sprite('fastForward', { width: this.params.controlIcons.width, 
                                height: this.params.controlIcons.height }),
        k.pos(this.objects.fastForwardIcon.x, this.objects.fastForwardIcon.y),
        k.area(),
    ]);
    this.fastForwardBtn.clicks(TimerControls.fastforward);
};


StatusBar.prototype.updateState = function(timestamp, speedup) {
    // Update everything? otherwise have to store values which could cause issues
    // Should this be combined with `handleClock()`. i.e. do we want to update
    // every status at EVERY time interval
    this.coinsText.text = State.coins;
    this.scoreText.text = State.score;
    this.requestsText.text = State.numCompletedReqs + '/' + State.goal;

    console.log(`STATUS BAR timestep: ${timestamp} @ ${speedup}x`);
    this.timeText.text = prettifyTime(timestamp);
};

// StatusBar.prototype.handleClock = function(timestamp, speedup) {
//     let remainingSecs = timestamp % 60;
//     let time = Math.floor(timestamp / 60) 
//         + ":" + (remainingSecs < 10 ? ('0' + remainingSecs) : remainingSecs);

//     console.log(`STATUS BAR timestep: ${timestamp} @ ${speedup}x`);
//     this.timeText.text = time;
// };

// helper function for displaying remaining time
const prettifyTime = (secs) => {
    let remainingSecs = secs % 60;
    return Math.floor(secs / 60) 
        + ":" + (remainingSecs < 10 ? ('0' + remainingSecs) : remainingSecs);
};


export default StatusBar;