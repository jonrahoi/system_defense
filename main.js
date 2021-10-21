import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
import k from "./kaboom.js";
// import name from "./scenes/start.js";

import showGamePage from "./scenes/game.js"
import showHomePage from "./scenes/home.js"

// import addPlayerInfo from "./scenes/playerInfo.js";
// import addSettings from "./scenes/settings.js";
// import addStaticStations from "./scenes/staticstations.js";
// import showMainPage from "./scenes/start.js";

// there should be a way for us to not need this here - only in kaboom.js
// I can't figure out why but it stops working if you take this out
// with import k (line 2) - the stations are ok, but settings and playerInfo stop showing
// if we have this here you can see it makes a second kaboom instance right below
// (made it blue for clarity)
// const k = kaboom({
//   width: window.innerWidth,
//   height: window.innerHeight,
//   scale: 1,
//   // blue
//   background: [0, 213, 231]
// });

// k.scene("mainPage", showMainPage);


k.scene("homePage", showHomePage);
// k.scene("gamePage", () => {
//   showGamePage();
//   // k.keyPress("backspace", () => k.go("mainPage"))
//   // k.add([
//   //   k.text(name)
//   // ])
// });

// k.scene("info", addPlayerInfo);
// k.scene("setting", addSettings);
// k.scene("station", addStaticStations);
// k.scene("mainPage", showMainPage);

//trying to come up with a way to consolidate everything in a "main" but
//it doesn't want to work :/
// k.scene("main", () => {
//   k.scene("info", addPlayerInfo);
//   k.scene("setting", addSettings);
//   k.scene("station", addStaticStations);
// });

// k.scene('main', () => {
//   k.go('gamePage')
// })
// k.start('main')

k.go("homePage")

// k.go('info');
// k.go('setting');
// k.go('station');
