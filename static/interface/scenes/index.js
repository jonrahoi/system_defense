/*
 * Meant to be the "controller" for scenes. Especially for the level objects
 * which will potentially have more than one scene.
 * 
 * Don't want to overcrown the `interface/index.js` file which is more responsible
 * for top-level control/management
 * 
 * Currently is not object-oriented but can easily be modified
 */


import TimerControls from '../utilities/timer.js';
import PlayField from './playField.js';
import GameOver from './gameOver.js';
import Home from './home.js';


export const LoadHomeScene = (actions) => {
    var home = new Home(actions);
    return home;
}


export const LoadLevelScene = (levelObj, bannerActions) => {
    // currently only 1 level scene but can be selected by levelObj.level (the level number)
    var field = new PlayField(bannerActions);
    field.load(levelObj);

    // setup timer for this level
    let timeLimit = levelObj.specs.timeLimit;
    TimerControls.init(timeLimit);

    // Connect this level scene (field) to the timer
    TimerControls.register(field.update, field); // default interval type

    // Connect this level's callback function to the timer (Game Logic's callback)
    // Want it to be registered with SPEEDUP intervals
    TimerControls.register(levelObj.processInterval, levelObj, 
        TimerControls.RegistrationTypes.SPEEDUP_INTERVAL);

    return field;
};

// TODO: make scene object and load with this function
export const LoadLeaderboardScene = (args) => {
    console.log('LOADING LEADERBOARD...');
    console.log("-- in construction --");
};

// TODO: make scene object and load with this function
export const LoadSettingsScene = (args) => {
    console.log('LOADING SETTINGS...');
    console.log("-- in construction --");
};

// Might want to break up into win/lose. Unsure
// Or not even have it here at all?
export const LoadGameOver = (win) => {
    var gameover = new GameOver(win);
    return gameover;
};