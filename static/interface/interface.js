/*
* Interface index.js
*
* Main entry point into this module. Responsible for loading all of the sprites
* used throughout the game
* Still trying to figure out what belongs here. Biggest shift was offloading
* scene construction to `/scenes/index.js`
* The intent is for this to be a "governor"/"driver" of sorts that is responsible
* for directing information at the top-most level
*/

import k from './kaboom/index.js';
import GameLogic from '../core/core.js';

import { assetEntries } from '../shared/lookup.js';

import TimerControls from '../utilities/timer.js';

import { LoadHomeScene, LoadGameOver, LoadLeaderboardScene, 
            LoadLevelScene, LoadSettingsScene } from './scenes/sceneManager.js';

const TESTING = true;
const REL_PATH_TO_ROOT = '../';


export default function Interface() { 
    this.sceneControls = {
        goHome: () => { TimerControls.reset(); this.loadHomeScreen() },
        play: this.startGame.bind(this),
        leaderboard: this.viewLeaderboard.bind(this),
        settings: this.viewSettings.bind(this)   
    }
};

// Load all necessary Kaboom components and other setup
Interface.prototype.init = function() {
    k.load(new Promise((resolve, reject) => {
        this.loadAllSprites();

        // Load custom shaders
        k.loadShader("green_tint",
            `vec4 vert(vec3 pos, vec2 uv, vec4 color) {
                return def_vert();
            }`,
            `vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
                return def_frag() * vec4(0, 1, 0, 1);
            }`, false);
        
        k.loadShader("red_tint",
            `vec4 vert(vec3 pos, vec2 uv, vec4 color) {
                return def_vert();
            }`,
            `vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
                return def_frag() * vec4(0.75, 0, 0.4, 0.9);
            }`, false);

        resolve('ok');
    }));
    
    this.loadHomeScreen();
};

// Load all sprites that will be used throughout the game
Interface.prototype.loadAllSprites = function() {
    // Load all ui icons, background images, etc.
    for (const [name, loc] of Object.entries(assetEntries(2, REL_PATH_TO_ROOT))) {
        k.loadSprite(name, loc);
    }
};

Interface.prototype.loadHomeScreen = function() {
    const home = LoadHomeScene(this.sceneControls);
    k.scene('home', home.scene);
    k.go('home');
};


Interface.prototype.startGame = function() {
    console.log('LOADING GAME...');
    
    TimerControls.register(this.gameOver, this, TimerControls.RegistrationTypes.TIMEOUT);
    // Build game logic object and get first level (object)
    this.gameLogic = new GameLogic();
    this.levelChange(1);
};

Interface.prototype.viewLeaderboard = function() {
    let leaderboard = LoadLeaderboardScene();
    return;
};

Interface.prototype.viewSettings = function() {
    let settings = LoadSettingsScene();
    return;
}

Interface.prototype.levelChange = function(levelNum) {
    this.currentLvlLogic = this.gameLogic.getLevel(levelNum);
    const currentLvlScene = LoadLevelScene(this.currentLvlLogic, this.sceneControls);
    
    if (TESTING) {
        let totalLevels = 5; // HARD CODED (just for testing)
        const lvlUp = () => { if (this.currentLvlLogic.number < totalLevels) { this.levelChange(this.currentLvlLogic.number+1); } };
        const lvlDown = () => { if (this.currentLvlLogic.number > 1) { this.levelChange(this.currentLvlLogic.number-1); } };
        currentLvlScene.test(lvlUp, lvlDown);
        console.log('Initiated level testing...');
    }
    
    let sceneName = `level_${levelNum}`;
    k.scene(sceneName, currentLvlScene.scene);
    k.go(sceneName);
    
    console.log('CHANGED SCENE: ', sceneName);
};


Interface.prototype.gameOver = function() {
    let alert = LoadGameOver();
    k.scene('gameover', alert.build);
    k.go('gameover');
    console.log('GAME OVER!');
};
