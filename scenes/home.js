import k from '../kaboom.js'
import showGamePage from '../scenes/game.js'

const width = window.innerWidth;
const height = window.innerHeight;

k.loadSprite("captain", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/captain_circled.png?token=ALRAJWF6SZ6BMZ56UI2LQKLBPMF3W", {
  // width: 800,
  // height: 800,
})
k.loadSprite("start", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/start.png?token=ALRAJWCH2RWFCR7MBRAHSKDBPMF6G")

// 
export default function showHomePage() {
  k.add([
    k.sprite("captain"),
    k.pos(width / 2, height / 2.6),
    k.area(),
    k.scale(width * height * 0.0000006),
    origin("center"),
    // k.color(r, g, b),
  ])
  
  const start = k.add([
    k.sprite("start"),
    k.pos(width / 2, height / 1.4),
    k.area(),
    k.scale(width * height * 0.0000004),
    origin("center"),
    // k.color(r, g, b),
  ])

  var name = "";
	start.clicks(() => {
    name = window.prompt("Enter your name to login: ");
    alert("Your name is " + name + ". You can now press enter to start the game.");
  });
  
  k.scene("gamePage", () => {
    showGamePage(name);
  });
  k.keyPress("enter", () => k.go("gamePage"));
}
