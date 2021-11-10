// /*
//  * Meant to be the "controller" for scenes. Especially for the level objects
//  * which will potentially have more than one scene.
//  * 
//  * Don't want to overcrown the `interface/index.js` file which is more responsible
//  * for top-level control/management
//  * 
//  * Currently is not object-oriented but can easily be modified
//  */

// import k from '../kaboom/index.js';

// import TimerControls from '../../utilities/timer.js';
// import LevelView from './levelView.js';
// import GameOver from './gameOver.js';
// import Leaderboard from './leaderboard.js';
// import Settings from './settings.js';
// import Home from './home.js';

// /**
//  * 2 options for scene management:
//  * 
//  * 1. Build/Instantiate ALL scene objects right away and access their references
//  *      as needed
//  * 
//  * 2. Build/Instantiate scenes AS NEEDED and store so they're only created once
//  */

// const sceneTracker = {};

// var currLevel = 1;
// const TESTING = true;

// export const SceneManager = {

//     loadScenes: (lvlChangeFunc) => {
//         let home = new Home(() => { lvlChangeFunc(1); });
//         sceneTracker['home'] = home;
//         k.scene('home', home.scene);
    
//         let leaderboard = new Leaderboard();
//         sceneTracker['leaderboard'] = leaderboard;
//         k.scene('leaderboard', leaderboard.scene);
    
//         let settings = new Settings();
//         sceneTracker['settings'] = settings;
//         k.scene('settings', settings.scene);
    
//         let level = new LevelView();
//         sceneTracker['level'] = level;
//         k.scene('level', level.scene);
    
//         // Connect the level scene to the timer
//         TimerControls.register(level.update, level); // default interval type
    
//         if (TESTING) {
//             let totalLevels = 5; // HARD CODED (just for testing)
//             const lvlUp = () => { if (currLevel < totalLevels) { currLevel += 1; lvlChangeFunc(currLevel); } };
//             const lvlDown = () => { if (currLevel > 1) { currLevel -= 1; lvlChangeFunc(currLevel); } };
//             level.test(lvlUp, lvlDown);
//             console.log('Initiated level testing...');
//         }
    
//         let gameover = new GameOver();
//         sceneTracker['gameover'] = gameover;
//         k.scene('gameover', gameover.scene);
    
//         // Connect gameover to timer
//         TimerControls.register(SceneManager.goGameover, this, TimerControls.RegistrationTypes.TIMEOUT);
//     },

//     goHome: () => { TimerControls.reset(0); k.go('home'); },

//     goLeaderboard: () => k.go('leaderboard'),

//     goSettings: () => k.go('settings'),

//     goLevel: (levelObj) => {

//         // Remove previous levelObj's binding to Timer
//         // let prevLvlLogic = sceneTracker.level.currentLvlLogic;
//         // if (prevLvlLogic) {
//         //     TimerControls.unregister(prevLvlLogic.processInterval, prevLvlLogic);
//         // }
    
//         sceneTracker.level.load(levelObj);
    
//         // setup timer for this level
//         let timeLimit = levelObj.specs.timeLimit;
//         TimerControls.init(timeLimit);
    
//         // Connect this level's callback function to the timer (Game Logic's callback)
//         // Want it to be registered with SPEEDUP intervals
//         TimerControls.register(levelObj.processInterval, levelObj, 
//             TimerControls.RegistrationTypes.SPEEDUP_INTERVAL);
    
//         k.go('level');
//     },

//     goGameover: (win) => { 
//         win = win || Timer.remaining() !== 0;
//         sceneTracker.gameover.buildParameters(win);
//         k.go('gameover');
//     }
// }

// export default SceneManager;

// // export const LoadLevelScene = (levelObj, bannerActions) => {
// //     // currently only 1 level scene but can be selected by levelObj.level (the level number)
// //     var levelView = new LevelView(bannerActions);
// //     levelView.load(levelObj);

// //     // setup timer for this level
// //     let timeLimit = levelObj.specs.timeLimit;
// //     TimerControls.init(timeLimit);

// //     // Connect this level scene (field) to the timer
// //     TimerControls.register(levelView.update, levelView); // default interval type

// //     // Connect this level's callback function to the timer (Game Logic's callback)
// //     // Want it to be registered with SPEEDUP intervals
// //     TimerControls.register(levelObj.processInterval, levelObj, 
// //         TimerControls.RegistrationTypes.SPEEDUP_INTERVAL);

// //     return levelView;
// // };
