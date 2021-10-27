/*
 * 
 */


import k from '../kaboom.js';

// Constant image size
const backgroundImgWidth = 1200;
const backgroundImgHeight = 800;

export function Home(menuActions) {    
    this.actions = menuActions;
    this.buildParameters();

    // necessary to preserve `this` reference (check out arrow functions if unfamiliar)
    this.scene = () => { this.buildScene(); };
};

Home.prototype.buildParameters = function() {
    
    this.params = {
        screenX: 0,
        screenY: 0,
        screenWidth: k.width(),
        screenHeight: k.height(),

        backdropColor: k.color(180, 200, 250),
        backdropOpacity: k.opacity(1),

        titleWidthRatio: 0.35, // ratio compared to the screen width
        titleHeightRatio: 0.08, // ratio compared to the screen height
        yTitleOffsetRatio: 0.5, // y-spacing from screen top based on title height

        menu: {
            backgroundColor: k.color(52, 149, 235),
            backgroundOpacity: k.opacity(0.5),
            
            numXButtons: 1,
            numYButtons: 3,
            buttonColor: k.color(0, 0, 0),
            buttonOpacity: k.opacity(0.9),

            textColor: k.color(255, 255, 255),
            textOpacity: k.opacity(0.9),

            yOffsetRatio: 0.7, // spacing from top of screen (offets menu lower from center)

            xInnerOffsetRatio: 0.03, // distance from left/right-most objects to menu left/right boundary
            yInnerOffsetRatio: 0.04, // distance from top/bottom of objects to menu top/bottom

            xOuterOffsetRatio: 0.42, // distance from screen left/right to boundary of menu
            yOuterOffsetRatio: 0.2, // distance from screen top/button to boundary of menu


            xButtonSpacerRatio: 0.1, // spacing ratio based on button width
            yButtonSpacerRatio: 0.1, // spacing ratio based on button height

            textWidthRatio: 0.65,
            textHeightRatio: 0.5,
        }
    };

    this.params['backgroundRatio'] = Math.min(this.params.screenWidth / backgroundImgWidth, 
                                                this.params.screenHeight / backgroundImgHeight);
    this.params['backgroundWidth'] = this.params.backgroundRatio * backgroundImgWidth;
    this.params['backgroundHeight'] = this.params.backgroundRatio * backgroundImgHeight;
    
    this.params['titleWidth'] = this.params.screenWidth * this.params.titleWidthRatio;
    this.params['titleHeight'] = this.params.screenHeight * this.params.titleHeightRatio;
    this.params['yTitleSpacer'] = this.params.titleHeight * this.params.yTitleOffsetRatio;

    let menuParams = this.params.menu;

    this.params['yOffsetSpacer'] = this.params.screenHeight * menuParams.yOffsetRatio;

    menuParams['xOuterSpacer'] = this.params.screenWidth * menuParams.xOuterOffsetRatio;
    menuParams['yOuterSpacer'] = (this.params.screenHeight - this.params.yOffsetSpacer) * menuParams.yOuterOffsetRatio;

    menuParams['width'] = (this.params.screenWidth - (menuParams.xOuterSpacer * 2));
    menuParams['height'] = ((this.params.screenHeight  - this.params.yOffsetSpacer) - (menuParams.yOuterSpacer * 2));

    menuParams['x'] = (this.params.screenX + ((this.params.screenWidth - menuParams.width) / 2)); // init x + half screen width - half panel width
    menuParams['y'] = (this.params.screenY + ((this.params.screenHeight - menuParams.height + this.params.yOffsetSpacer) / 2)); // init y + half screen height - half panel height + offsetSpacer

    menuParams['xInnerSpacer'] = menuParams.width * menuParams.xInnerOffsetRatio;
    menuParams['yInnerSpacer'] = menuParams.height * menuParams.yInnerOffsetRatio; 

    menuParams['xBtnSpacer'] = menuParams.width * menuParams.xButtonSpacerRatio;
    menuParams['yBtnSpacer'] = menuParams.height * menuParams.yButtonSpacerRatio;

    menuParams['btnWidth'] = ((menuParams.width // full box width
        - (2 * menuParams.xInnerSpacer) // left + right boundary spacer
        - ((menuParams.numXButtons - 1) * menuParams.xBtnSpacer)) // x-spacer between every button
        / menuParams.numXButtons); // get per-button width
    menuParams['btnHeight'] = ((menuParams.height // adjusted height
        - (2 * menuParams.yInnerSpacer) // top + bottom boundary spacer
        - ((menuParams.numYButtons - 1) * menuParams.yBtnSpacer)) // y-spacer between every button
        / menuParams.numYButtons); // get per-button height
    
    menuParams['textWidth'] = menuParams.btnWidth * menuParams.textWidthRatio;
    menuParams['textHeight'] = menuParams.btnHeight * menuParams.textHeightRatio;
    
    /* 
     * Objects inside the menu (aka buttons)
     */
    this.objects = {};
    
    this.objects['title'] = {
        width: this.params.titleWidth,
        height: this.params.titleHeight,
        x: ((this.params.screenWidth / 2) - (this.params.titleWidth / 2)),
        y: (this.params.screenY + this.params.yTitleSpacer)
    }

    this.objects['play'] = {
        x: (menuParams.x + menuParams.xInnerSpacer),
        y: (menuParams.y + menuParams.yInnerSpacer)
    };
    this.objects['leaderboard'] = {
        x: (this.objects.play.x),
        y: (this.objects.play.y + (menuParams.btnHeight + menuParams.yBtnSpacer))
    };
    this.objects['settings'] = {
        x: (this.objects.leaderboard.x),
        y: (this.objects.leaderboard.y + (menuParams.btnHeight + menuParams.yBtnSpacer))
    };

    this.objects['textObjs'] = {};
    Object.entries(this.objects).forEach(([key, val]) => {
        this.objects.textObjs[key] = {
            x: val.x + (Math.abs(menuParams.btnWidth / 2) 
                        - (menuParams.textWidth / 2)),
            y: val.y + (Math.abs(menuParams.btnHeight / 2) 
                        - (menuParams.textHeight / 2))
        }
    });
};




Home.prototype.buildScene = function() {
    // Background
    k.add([
        k.rect(this.params.screenWidth, this.params.screenHeight),
        k.pos(this.params.screenX, this.params.screenY),
        this.params.backdropColor,
        this.params.backdropOpacity,
    ]);
    
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
    ]);

    // Menu rect
    k.add([
        k.rect(this.params.menu.width, this.params.menu.height),
        k.pos(this.params.menu.x, this.params.menu.y),
        this.params.menu.backgroundColor,
        this.params.menu.backgroundOpacity,
    ]);
        

    // Play Button
    const playBtn = k.add([
        k.rect(this.params.menu.btnWidth, this.params.menu.btnHeight),
        k.pos(this.objects.play.x, this.objects.play.y),
        this.params.menu.buttonColor,
        this.params.menu.buttonOpacity,
        k.area(),
    ]);
    playBtn.clicks(this.actions.play);

    k.add([
        k.text('Play', { size: this.params.menu.textHeight, width: this.params.menu.textWidth }),
        k.pos(this.objects.textObjs.play.x, this.objects.textObjs.play.y),
        this.params.menu.textColor,
        this.params.menu.textOpacity,
    ]);
            

    // Leaderboard
    const leaderboardBtn = k.add([
        k.rect(this.params.menu.btnWidth, this.params.menu.btnHeight),
        k.pos(this.objects.leaderboard.x, this.objects.leaderboard.y),
        this.params.menu.buttonColor,
        this.params.menu.buttonOpacity,
        k.area(),
    ]);
    leaderboardBtn.clicks(this.actions.leaderboard);

    k.add([
        k.text("Leaderboard", { size: this.params.menu.textHeight, width: this.params.menu.textWidth }),
        k.pos(this.objects.textObjs.leaderboard.x, this.objects.textObjs.leaderboard.y),
        this.params.menu.textColor,
        this.params.menu.textOpacity,
    ]);

    // Settings
    const settings_btn = k.add([
        k.rect(this.params.menu.btnWidth, this.params.menu.btnHeight),
        k.pos(this.objects.settings.x, this.objects.settings.y),
        this.params.menu.buttonColor,
        this.params.menu.buttonOpacity,
        area(),
    ]);
    settings_btn.clicks(this.actions.settings);

    k.add([
        k.text("Settings", { size: this.params.menu.textHeight, width: this.params.menu.textWidth }),
        k.pos(this.objects.textObjs.settings.x, this.objects.textObjs.settings.y),
        this.params.menu.textColor,
        this.params.menu.textOpacity,
    ]);
};


export default Home;













// Home.prototype.buildScene = function() {
//     // Background
//     k.add([
//         k.rect(this.params.screenWidth, this.params.screenHeight),
//         this.params.backdropColor,
//         this.params.backdropOpacity,
//     ]);
    
//     k.add([
//         k.sprite('home_background', { width: this.params.backgroundWidth, 
//                                 height: this.params.backgroundHeight}),
//         k.pos(k.width() / 2, k.height() / 2),
//         k.origin('center'),
//     ]);
    
//     // Title
//     let title_height = 75;
//     let title_width = 640;
//     let title_x = (k.width() / 2) - (title_width / 2);
//     let title_y = 25;
//     k.add([
//         k.text('Captain Client', { size: title_height, width: title_width }),
//         k.pos(title_x, title_y),
//         k.scale(1),
//     ]);

//     // Menu //
//     let menu_btn_width = 300;
//     let menu_btn_height = 50;
//     let menu_btn_x = (k.width() / 2) - (menu_btn_width / 2);
//     let menu_text_height = 44;

//     let init_btn_y = 750;
//     let menu_backdrop_spacer = 20;
//     let num_buttons = 3;

//     let menu_rect = k.rect(menu_btn_width + menu_backdrop_spacer, 
//                         (num_buttons * menu_btn_height) + menu_btn_height + menu_backdrop_spacer);
//     k.add([
//         menu_rect,
//         k.pos(menu_btn_x - (menu_backdrop_spacer / 2), init_btn_y - (menu_backdrop_spacer / 2)),
//         k.color(52, 149, 235),
//         k.opacity(0.5)
//     ]);
        
//     // Play Button
//     const playBtn = k.add([
//         k.rect(menu_btn_width, menu_btn_height),
//         k.pos(menu_btn_x, init_btn_y),
//         k.area(),
//         'button',
//     ]);
//     playBtn.clicks(() => {
//         this.actions.play();
//     });

//     k.add([
//         k.text('Play', { size: menu_text_height, width: menu_btn_width }),
//         k.pos(menu_btn_x, init_btn_y),
//         k.color(0, 0, 0),
//     ]);
            
//     // Leaderboard
//     let leaderboard_btn_y = init_btn_y + (1.5 * menu_btn_height);
//     const leaderboardBtn = k.add([
//         k.rect(menu_btn_width, menu_btn_height),
//         k.pos(menu_btn_x, leaderboard_btn_y),
//         k.area(),
//         'button',
//     ]);
//     leaderboardBtn.clicks(() => {
//         this.actions.leaderboard();
//     });

//     k.add([
//         k.text("Leaderboard", { size: menu_text_height, width: menu_btn_width }),
//         k.pos(menu_btn_x, leaderboard_btn_y),
//         k.color(0, 0, 0),
//     ]);

//     // Settings
//     let settings_btn_y = leaderboard_btn_y + (1.5 * menu_btn_height);
//     const settings_btn = k.add([
//         k.rect(menu_btn_width, menu_btn_height),
//         k.pos(menu_btn_x, settings_btn_y),
//         area(),
//         'button',
//     ]);
//     settings_btn.clicks(() => {
//         this.actions.settings();
//     });
//     k.add([
//         k.text("Settings", { size: menu_text_height, width: menu_btn_width }),
//         k.pos(menu_btn_x, settings_btn_y),
//         k.color(0, 0, 0),
//     ]);
// };
        