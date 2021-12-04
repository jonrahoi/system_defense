

import k from '../kaboom/kaboom.js';
import { SceneControls } from '../interface.js';

// ALL ICONS HAVE SAME SIZE (512p x 512p)
const iconWidth = 512;
const iconHeight = 512;

export function Leaderboard() {
    this.rankings = new RankingsList(); // unsure if this is correct

    this.init();

    // necessary to preserve `this` reference (check out arrow functions if unfamiliar)
    this.scene = () => { this.buildScene(); };
};

Leaderboard.prototype.init = function() {

    // TEST TEST TEST --> Meant as a template, not actual values

    this.params = {
        screenX: 0, // minimum x value relative to screenWidth
        screenY: 0, // minimum y value relative to screenHeight
        width: k.width(), // total screen width
        height: k.height(), // total screen height

        backdropColor: k.color(180, 200, 250), // backdrop color (same as home scene)
        backdropOpacity: k.opacity(1), // opacity of backdrop

        xInnerOffsetRatio: 0.01, // distance from left/right-most objects to banner left/right boundary
        yInnerOffsetRatio: 0.02, // distance from top/bottom of objects to banner top/bottom

        // Based on Home Scene dimensions
        titleWidthRatio: 0.35, // ratio compared to the screen width
        titleHeightRatio: 0.07, // ratio compared to the screen height
        yTitleOffsetRatio: 0.5, // ratio of y-spacing from screen top based on title height

        controlIconScale: 0.45, // used to resize the control icons (home, volume, settings...)
        constrolIconXSpacerRatio: 0.35, // spacing ratio based on scaled icon height
        controlIconOpacity: k.opacity(0.9), // opacity of control-enabled icons

        board: {
            // (Same as Home Scene Menu Box)
            backgroundColor: k.color(52, 149, 235), // background color of the menu box
            backgroundOpacity: k.opacity(0.5), // opacity of the menu box
        }
    };

    // Scaling factor for each icon (except the usfCSIcon)
    this.params['iconRatio'] = Math.min((this.params.width / iconWidth), 
                                        (this.params.height / iconHeight));
                
    // Calculated spacing for the banner's inner boundaries
    this.params['xInnerSpacer'] = this.params.xInnerOffsetRatio * this.params.width;
    this.params['yInnerSpacer'] = this.params.yInnerOffsetRatio * this.params.height;
    
    // Scaled icon sizes and spacing for the control-enabled icons
    this.params['controlIcons'] = { // icons with actions (home, volume, settings)
        width: iconWidth * this.params.iconRatio * this.params.controlIconScale, // scaled width based on above ratio
        height: iconHeight * this.params.iconRatio * this.params.controlIconScale // scaled height based on above ratio
    };

    this.params['controlIcons'].xSpacer = this.params.controlIcons.width * this.params.constrolIconXSpacerRatio;
    this.params['controlIcons'].ySpacer = (this.params.height / 2) - (this.params.controlIcons.height / 2);

    // Adjusted width/height for the title text
    this.params['titleWidth'] = this.params.width * this.params.titleWidthRatio;
    this.params['titleHeight'] = this.params.height * this.params.titleHeightRatio;

    // Calculated distance between top of title and top of screen
    this.params['yTitleSpacer'] = this.params.titleHeight * this.params.yTitleOffsetRatio;

    this.objects = {};
    this.objects['title'] = {
        width: this.params.width * this.params.titleWidthRatio,
        height: this.params.height * this.params.titleHeightRatio,
        x: ((this.params.width / 2) - (this.params.titleWidth / 2)),
        y: (this.params.screenY + this.params.yTitleSpacer)
    }

    this.objects['back'] = { 
        x: ((this.params.width + this.params.screenX) // right-most edge
                    - this.params.xInnerSpacer // offset
                    - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // this icon + spacer
        y: (this.params.screenY + this.params.controlIcons.ySpacer + this.params.yInnerSpacer)
    }
};


Leaderboard.prototype.buildScene = function() {
    // Backdrop color
    k.add([
        k.rect(this.params.width, this.params.height),
        k.pos(this.params.screenX, this.params.screenY),
        this.params.backdropColor,
        this.params.backdropOpacity,
    ]);

    // Title
    k.add([
        k.text('Instructions', { size: this.objects.title.height, width: this.objects.title.width }),
        k.pos(this.objects.title.x, this.objects.title.y),
    ]);


    // Back button
    const backBtn = k.add([
        k.sprite('back', { width: this.params.controlIcons.width,
                            height: this.params.controlIcons.height }),
        k.pos(this.objects.back.x, this.objects.back.y),
        this.params.controlIconOpacity,
        k.area(),
    ]);
    backBtn.clicks(SceneControls.goHome);
};


function RankingsList(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

/*
 * Unsure what the loaded format will be. Either way, an object that can be transformed 
 * into the the currently anticipated format will work
 */
RankingsList.prototype.load = function(rankings) {
    /* Expecting `rankings` as object of form:
     * { 
     *      rank: X,
     *      name: ...,
     *      score: ...,
     *      time: ...   
     * }
     */
}

export default Leaderboard;