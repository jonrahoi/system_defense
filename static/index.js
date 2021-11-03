/*
* Interface index.js
*
* Main entry point into this module. Responsible for loading all of the sprites
* used throughout the game
* Still trying to figure out what belongs here. Biggest shift was offloading
* scene construction to `/scenes/index.js`
* The intent is for this to be a "governor"/"driver" of sorts that is responsible
* for directing information at the top-most level
* 
* Don't like having TimerControls live here...
*/

import k from './interface/kaboom.js';
import GameLogic from './core/index.js';

import { assetEntries, componentEntries } from './shared/lookup.js';

// Ideally don't want this here. Only reason right now is for registering `GameOver()`
import TimerControls from './interface/utilities/timer.js';

import { LoadHomeScene, LoadGameOver, LoadLeaderboardScene, 
            LoadLevelScene, LoadSettingsScene } from './interface/scenes/index.js';

const TESTING = false;
const REL_PATH_TO_ROOT = '../';


export default function Interface() { // might need some parameters for display
    // whatever Interface needs...
    this.sceneControls = {
        goHome: () => { TimerControls.reset(); this.loadHomeScreen() },
        play: this.startGame.bind(this),
        leaderboard: this.viewLeaderboard.bind(this),
        settings: this.viewSettings.bind(this)   
    }
};


// Could combine into constructor
Interface.prototype.init = function() {
    this.loadAllSprites();
    
    // DON"T LIKE HAVING THIS HERE
    TimerControls.register(this.gameOver, this, TimerControls.RegistrationTypes.TIMEOUT)
    
    this.loadHomeScreen();
};

// Seems inefficient to load all sprites at once...
// Although this is clean. Makes it so `AssetLookup` is the only location to 
// keep track of paths
Interface.prototype.loadAllSprites = function() {
    // Load all ui icons, background images, etc.
    for (const [name, loc] of Object.entries(assetEntries(2, REL_PATH_TO_ROOT))) {
        k.loadSprite(name, loc);
    }
    
    // Load all client images
    for (const [name, info] of Object.entries(componentEntries(1, REL_PATH_TO_ROOT))) {
        
        let loc = info.image;
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
        currentLvlScene.test();
        console.log('Initiated level testing...');
    }
    
    let sceneName = `level_${levelNum}`;
    k.scene(sceneName, currentLvlScene.scene);
    k.go(sceneName);
    
    console.log('CHANGED SCENE: ', sceneName);
};


Interface.prototype.gameOver = function() {
    let alert = null;
    if (TimerControls.remaining() != 0) {
        alert = LoadGameOver(false);
    } else {
        alert = LoadGameOver(true);
    }
    
    k.scene('gameover', alert.build);
    k.go('gameover');
    console.log('GAME OVER!');
};
