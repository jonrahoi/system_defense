/*
 * The banner displayed over the play field during game play. Currently being
 * composed using Kaboom which becomes complicated for positioning and sizing
 * multiple images. However, it does grant the most freedom for manipulation 
 * which could be helpful on different screen sizes. With a single image, the
 * aspect ratio can not be changed easily (if at all)
 */

import k from "../kaboom/index.js";

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
    this.init(screenX, screenY, screenWidth, screenHeight);
}

/**
 * Initialize all parameters (sizing, position, spacing...) for the banner
 * 
 * BANNER --> displayed as top horizontal bar throughout game
 */
Banner.prototype.init = function(screenX, screenY, screenWidth, screenHeight) {

    this.params = { 
        x: screenX, // starting x-pos for the banner
        y: screenY, // starting y-pos for the banner
        width: screenWidth, // width of the banner (expand to fill screen width)
        height: screenHeight, // height of the banner (expand to fill screen height)

        backgroundColor: k.color(29, 64, 105), // solid color to fill banner
        backgroundOpacity: k.opacity(1), // opacity of the background color

        xInnerOffsetRatio: 0.01, // distance from left/right-most objects to banner left/right boundary
        yInnerOffsetRatio: 0.02, // distance from top/bottom of objects to banner top/bottom

        controlIconScale: 0.45, // used to resize the control icons (home, volume, settings...)

        displayIconXSpacerRatio: 0.25, // spacing ratio based on scaled icon width
        constrolIconXSpacerRatio: 0.35, // spacing ratio based on scaled icon height

        titleWidthRatio: 5.8, // ratio of the title's width to a display-only icon's width
        titleHeightRatio: 0.66, // ratio of the title's height to a display-only icon's height

        displayIconOpacity: k.opacity(0.7), // opacity of display-only icons
        controlIconOpacity: k.opacity(0.9), // opacity of control-enabled icons
        textOpacity: 0.6 // universal opacity of text
    };

    // Scaling factor for each icon (except the usfCSIcon)
    this.params['iconRatio'] = Math.min((this.params.width / iconWidth), 
                                        (this.params.height / iconHeight));

    // Calculated spacing for the banner's inner boundaries
    this.params['xInnerSpacer'] = this.params.xInnerOffsetRatio * this.params.width;
    this.params['yInnerSpacer'] = this.params.yInnerOffsetRatio * this.params.height;


    // Scaled icon sizes and spacing for the display-only icons
    this.params['displayIcons'] = { // icons that are simply for display (ie. no actions associated)
        width: iconWidth * this.params.iconRatio, // scaled width based on above ratio
        height: iconHeight * this.params.iconRatio // scaled height based on above ratio
    };
    this.params['displayIcons'].xSpacer = this.params.displayIcons.width * this.params.displayIconXSpacerRatio;
    this.params['displayIcons'].ySpacer = (this.params.height / 2) - (this.params.displayIcons.height / 2);

    // Scaled icon sizes and spacing for the control-enabled icons
    this.params['controlIcons'] = { // icons with actions (home, volume, settings)
        width: iconWidth * this.params.iconRatio * this.params.controlIconScale, // scaled width based on above ratio
        height: iconHeight * this.params.iconRatio * this.params.controlIconScale // scaled height based on above ratio
    };
    this.params['controlIcons'].xSpacer = this.params.controlIcons.width * this.params.constrolIconXSpacerRatio;
    this.params['controlIcons'].ySpacer = (this.params.height / 2) - (this.params.controlIcons.height / 2);

    // Sets the size of the title text box
    this.params['titleText'] = {
        width: this.params.displayIcons.width * this.params.titleWidthRatio,
        height: this.params.displayIcons.height * this.params.titleHeightRatio
    }

    // Add offset to bottom of banner to provide spacing
    this.params['height'] += this.params.yInnerSpacer;


    /* 
     * Objects inside the banner (aka icons)
     */
    this.objects = {
        
        usf: { 
            x: (this.params.x + this.params.xInnerSpacer), // left-most edge
            y: (this.params.y + this.params.displayIcons.ySpacer + this.params.yInnerSpacer) 
        },
        
        usfCS: { // SPECIAL CASE
            width: this.params.displayIcons.width * usfCSIcon.widthScale,
            height: this.params.displayIcons.height * usfCSIcon.heightScale,
            x: ((this.params.x + this.params.xInnerSpacer) // left-most edge
                        + this.params.displayIcons.width // usf icon
                        + this.params.displayIcons.xSpacer), // this icon spacer
            y: (this.params.y + this.params.yInnerSpacer 
                        + ((this.params.height / 2) - ((this.params.displayIcons.height * usfCSIcon.heightScale) / 2))) 
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
                        + (this.params.titleText.width / 2) + this.params.displayIcons.xSpacer), // width of title + captain "block"
            y: (this.params.y + this.params.displayIcons.ySpacer + this.params.yInnerSpacer) 
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

    // Function to share dimensions of this banner
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


/**
 * Adds all of the graphic objects to the screen using the initialized parameters
 */
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
        k.sprite('usf', { width: this.params.displayIcons.width, 
                            height: this.params.displayIcons.height }),
        k.pos(this.objects.usf.x, this.objects.usf.y),
        this.params.displayIconOpacity,
    ]);

    // USFCS icon
    k.add([ // SPECIAL CASE
        k.sprite('usfCS', { width: this.objects.usfCS.width, 
                            height: this.objects.usfCS.height }),
        k.pos(this.objects.usfCS.x, this.objects.usfCS.y),
        this.params.displayIconOpacity,
    ]);

    // Captain icon
    k.add([
        k.sprite('transparent_captain', { width: this.params.displayIcons.width, 
                                height: this.params.displayIcons.height }),
        k.pos(this.objects.captain.x, this.objects.captain.y),
        this.params.displayIconOpacity,
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

    // Mute icon
    const muteBtn = k.add([
        k.sprite('mute', { width: this.params.controlIcons.width, 
                            height: this.params.controlIcons.height }),
        k.pos(this.objects.mute.x, this.objects.mute.y),
        this.params.controlIconOpacity,
        k.area(),
    ]);

    // Settings icon
    const settingsBtn = k.add([
        k.sprite('settings', { width: this.params.controlIcons.width, 
                                height: this.params.controlIcons.height }),
        k.pos(this.objects.settings.x, this.objects.settings.y),
        this.params.controlIconOpacity,
        k.area(),
    ]);

    // Connect buttons to control functions
    homeBtn.clicks(this.actions.goHome);
    muteBtn.clicks(() => console.log("MUTE CLICKED"));
    settingsBtn.clicks(this.actions.settings);
};

export default Banner;