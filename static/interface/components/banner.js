/*
 * The banner displayed over the play field during game play. Currently being
 * composed using Kaboom which becomes complicated for positioning and sizing
 * multiple images. However, it does grant the most freedom for manipulation 
 * which could be helpful on different screen sizes. With a single image, the
 * aspect ratio can not be changed easily (if at all)
 */

import k from "../kaboom.js";

/*
    * ------------------------------ BANNER -----------------------------------
    * USFLogo USFCSLogo               TITLE  CapLogo  HOME VOLUME/MUTE SETTINGS
    * ---------------------------- STATUS BAR ---------------------------------
    * LEVEL X SCORE X COINS X              COMPLETE/GOAL TIME PLAY|PAUSE|RESTART
*/

// ALL ICONS HAVE SAME SIZE (512p x 512p)
const iconWidth = 512;
const iconHeight = 512;

const heightRatio = 0.08; // the height of the banner based on the given screenHeight

// Special case due to shape of icon
const usfCSIcon = {
    widthScale: 2.2,
    heightScale: 2.2
};

export function Banner(screenX, screenY, screenWidth, screenHeight, bannerActions) {
    this.actions = bannerActions;
    this.buildParameters(screenX, screenY, screenWidth, screenHeight);
}

Banner.prototype.buildParameters = function(screenX, screenY, screenWidth, screenHeight) {


    /* ********************************************************************** *
     *                      Graphic object definitions                        *
     * ********************************************************************** */

    /*
     * BANNER --> displayed as top horizontal bar throughout game
     */
    this.params = { 
        x: screenX, 
        y: screenY, 
        width: screenWidth, 
        backgroundColor: k.color(29, 64, 105),
        backgroundOpacity: k.opacity(1),

        xInnerOffsetRatio: 0.01, // distance from left/right-most objects to banner left/right boundary
        yInnerOffsetRatio: 0.02, // distance from top/bottom of objects to banner top/bottom

        controlIconScale: 0.45, // used to resize the control icons (home, volume, settings...)

        staticIconXSpacerRatio: 0.25, // spacing ratio based on scaled icon width
        constrolIconXSpacerRatio: 0.35, // spacing ratio based on scaled icon width

        staticIconOpacity: k.opacity(0.7),
        controlIconOpacity: k.opacity(0.9),
        textOpacity: 0.6
    };


    this.params['height'] = screenHeight * heightRatio;
    this.params['iconRatio'] = Math.min((this.params.width / iconWidth), 
                                        (this.params.height / iconHeight));

    this.params['xInnerSpacer'] = this.params.xInnerOffsetRatio * this.params.width;
    this.params['yInnerSpacer'] = this.params.yInnerOffsetRatio * this.params.height;


    this.params['staticIcons'] = { // icons that are simply for display (ie. no actions associated)
        width: iconWidth * this.params.iconRatio, // scaled width based on above ratio
        height: iconHeight * this.params.iconRatio // scaled height based on above ratio
    };
    this.params['staticIcons'].xSpacer = this.params.staticIcons.width * this.params.staticIconXSpacerRatio;
    this.params['staticIcons'].ySpacer = (this.params.height / 2) - (this.params.staticIcons.height / 2);

    this.params['controlIcons'] = { // icons with actions (home, volume, settings)
        width: iconWidth * this.params.iconRatio * this.params.controlIconScale, // scaled width based on above ratio
        height: iconHeight * this.params.iconRatio * this.params.controlIconScale // scaled height based on above ratio
    };
    this.params['controlIcons'].xSpacer = this.params.controlIcons.width * this.params.constrolIconXSpacerRatio;
    this.params['controlIcons'].ySpacer = (this.params.height / 2) - (this.params.controlIcons.height / 2);

    this.params['titleText'] = {
        width: this.params.staticIcons.width * 5.8, // 5.8
        height: this.params.staticIcons.height / 1.5 // 55
    }
    this.params['height'] += this.params.yInnerSpacer;

    this.objects = {
        
        usf: { 
            x: (this.params.x + this.params.xInnerSpacer), // left-most edge
            y: (this.params.y + this.params.staticIcons.ySpacer + this.params.yInnerSpacer) 
        },
        
        usfCS: { // SPECIAL CASE
            width: this.params.staticIcons.width * usfCSIcon.widthScale,
            height: this.params.staticIcons.height * usfCSIcon.heightScale,
            x: ((this.params.x + this.params.xInnerSpacer) // left-most edge
                        + this.params.staticIcons.width // usf icon
                        + this.params.staticIcons.xSpacer), // this icon spacer
            y: (this.params.y + this.params.yInnerSpacer 
                        + ((this.params.height / 2) - ((this.params.staticIcons.height * usfCSIcon.heightScale) / 2))) 
        },

        titleText: {
            width: this.params.titleText.width, 
            height: this.params.titleText.height, 
            x: ((this.params.width / 2) // banner midpoint
                        - (this.params.titleText.width / 2)), // width of title + captain "block"
            y: (this.params.y + this.params.yInnerSpacer)
        },

        captain: { 
            x: ((this.params.width / 2) // banner midpoint
                        + (this.params.titleText.width / 2) + this.params.staticIcons.xSpacer), // width of title + captain "block"
            y: (this.params.y + this.params.staticIcons.ySpacer + this.params.yInnerSpacer) 
        },        

        settings: { 
            x: ((this.params.width + this.params.x) // right-most edge
                        - this.params.xInnerSpacer // offset
                        - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // this icon + spacer
            y: (this.params.y + this.params.controlIcons.ySpacer + this.params.yInnerSpacer) 
        },
        
        mute: { 
            x: ((this.params.width + this.params.x) // right-most edge
                        - this.params.xInnerSpacer // offset
                        - (this.params.controlIcons.width + this.params.controlIcons.xSpacer) // settings icon + spacer
                        - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // this icon + spacer
            y: (this.params.y + this.params.controlIcons.ySpacer + this.params.yInnerSpacer) 
        },

        home: { 
            x: ((this.params.width + this.params.x) // right-most edge
                        - this.params.xInnerSpacer // offset
                        - (this.params.controlIcons.width + this.params.controlIcons.xSpacer) // settings icon + spacer
                        - (this.params.controlIcons.width + this.params.controlIcons.xSpacer) // mute icon + spacer
                        - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // this icon and spacer
            y: (this.params.y + this.params.controlIcons.ySpacer + this.params.yInnerSpacer) 
        }
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
Banner.prototype.build = function() {
    // Banner bar
    k.add([
        k.rect(this.params.width, this.params.height),
        k.pos(this.params.x, this.params.y),
        this.params.color,
        this.params.opacity,
    ]);

    // USF icon
    k.add([
        k.sprite('usf', { width: this.params.staticIcons.width, 
                            height: this.params.staticIcons.height }),
        k.pos(this.objects.usf.x, this.objects.usf.y),
        this.params.staticIconOpacity,
    ]);

    // USFCS icon
    k.add([ // SPECIAL CASE
        k.sprite('usfCS', { width: this.objects.usfCS.width, 
                            height: this.objects.usfCS.height }),
        k.pos(this.objects.usfCS.x, this.objects.usfCS.y),
        this.params.staticIconOpacity,
    ]);

    // Captain icon
    k.add([
        k.sprite('transparent_captain', { width: this.params.staticIcons.width, 
                                height: this.params.staticIcons.height }),
        k.pos(this.objects.captain.x, this.objects.captain.y),
        this.params.staticIconOpacity,
    ]);

    // Title
    k.add([
        k.text('Captain Client', { size: this.objects.titleText.height }),
        k.pos(this.objects.titleText.x, this.objects.titleText.y),
        this.params.titleOpacity,
    ]);

    // Home icon
    const homeBtn = k.add([
        k.sprite('home', { width: this.params.controlIcons.width, 
                            height: this.params.controlIcons.height }),
        k.pos(this.objects.home.x, this.objects.home.y),
        this.params.controlIconOpacity,
        k.area(),
    ]);
    homeBtn.clicks(this.actions.goHome);

    // Mute icon
    const muteBtn = k.add([
        k.sprite('mute', { width: this.params.controlIcons.width, 
                            height: this.params.controlIcons.height }),
        k.pos(this.objects.mute.x, this.objects.mute.y),
        this.params.controlIconOpacity,
        k.area(),
    ]);
    muteBtn.clicks(() => console.log("MUTE CLICKED"));

    // Settings icon
    const settingsBtn = k.add([
        k.sprite('settings', { width: this.params.controlIcons.width, 
                                height: this.params.controlIcons.height }),
        k.pos(this.objects.settings.x, this.objects.settings.y),
        this.params.controlIconOpacity,
        k.area(),
    ]);
    settingsBtn.clicks(this.actions.settings);
};

export default Banner;