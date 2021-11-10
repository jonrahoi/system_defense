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
import State from '../../shared/state.js';
import { assetEntries } from '../shared/lookup.js'
import TimerControls from '../utilities/timer.js';
import LevelView from './scenes/levelView.js';
import GameOver from './scenes/gameOver.js';
import Leaderboard from './scenes/leaderboard.js';
import Settings from './scenes/settings.js';
import Home from './scenes/home.js';

const TESTING = true;
const REL_PATH_TO_ROOT = '../';


export default function Interface() { this.sceneTracker = {}; };

const sceneTracker = {};

// Load all necessary Kaboom components and other setup
Interface.prototype.init = function() {
    k.load(new Promise((resolve, reject) => {
        
        // Load all ui icons, background images, etc.
        for (const [name, loc] of Object.entries(assetEntries(2, REL_PATH_TO_ROOT))) {
            k.loadSprite(name, loc);
        }

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

    // Build game logic object
    this.gameLogic = new GameLogic();

    // Load all game scenes
    this.loadScenes();
    SceneControls.goHome();
};

Interface.prototype.loadScenes = function() {

    let home = new Home(() => { this.goLevel(1); });
    sceneTracker['home'] = home;
    home.scene();
    k.scene('home', home.scene);

    let leaderboard = new Leaderboard();
    sceneTracker['leaderboard'] = leaderboard;
    leaderboard.scene();
    k.scene('leaderboard', leaderboard.scene.bind(this));

    let settings = new Settings();
    sceneTracker['settings'] = settings;
    settings.scene();
    k.scene('settings', settings.scene);

    let level = new LevelView();
    sceneTracker['level'] = level;
    level.scene();
    k.scene('level', level.scene);

    // Connect the level scene to the timer
    TimerControls.register(level.update, level); // default interval type

    // Connect this levels' callback function to the timer (Game Logic's callback)
    // Want it to be registered with SPEEDUP intervals
    TimerControls.register(this.gameLogic.processInterval, this.gameLogic, 
        TimerControls.RegistrationTypes.SPEEDUP_INTERVAL);

    if (TESTING) {
        let totalLevels = 5; // HARD CODED (just for testing)
        const lvlUp = () => { if (State.levelNumber < totalLevels) { this.goLevel(State.levelNumber+1); } };
        const lvlDown = () => { if (State.levelNumber > 1) { this.goLevel(State.levelNumber-1); } };
        level.test(lvlUp, lvlDown);
        k.scene('level', level.scene);
        console.log('Initiated level testing...');
    }

    let gameover = new GameOver();
    sceneTracker['gameover'] = gameover;
    gameover.scene();
    k.scene('gameover', gameover.scene.bind(this));

    // Connect gameover to timer
    TimerControls.register(SceneControls.goGameover, SceneControls, TimerControls.RegistrationTypes.TIMEOUT);
};

Interface.prototype.goLevel = function(levelNum) {

    levelNum = levelNum || State.levelNumber + 1;
    this.currentLvlLogic = this.gameLogic.getLevel(levelNum);

    // Remove previous levelObj's binding to Timer
    let prevLvlLogic = sceneTracker.level.currentLvlLogic;
    if (prevLvlLogic) {
        TimerControls.unregister(prevLvlLogic.processInterval, prevLvlLogic);
    }

    sceneTracker.level.load(this.currentLvlLogic);

    // setup timer for this level
    let timeLimit = this.currentLvlLogic.specs.timeLimit;
    TimerControls.init(timeLimit);

    console.log(`CHANGED SCENE: level ${levelNum}`);
    k.go('level');
};

export const SceneControls = {
    goHome: () => { TimerControls.reset(); k.go('home'); },
    goLeaderboard: () => k.go('leaderboard'),
    goSettings: () => k.go('settings'),
    goGameover: (win) => { 
        win = win || Timer.remaining() !== 0;
        sceneTracker.gameover.init(win);
        k.go('gameover');
    }
};
