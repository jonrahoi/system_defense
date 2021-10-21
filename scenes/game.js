import k from '../kaboom.js'
import showHomePage from '../scenes/home.js'
import showSettingsPage from '../scenes/settings.js'

const width = window.innerWidth;
const height = window.innerHeight;

k.loadSprite("play", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/play.png?token=ALRAJWEDM4XXY7LY6ZG7ZNTBPMGCO")
k.loadSprite("pause", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/pause.png?token=ALRAJWGMPRDQSMVJP5W4ZFDBPMGC4")
k.loadSprite("restart", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/restart.png?token=ALRAJWG77WC3BGY2HNRUXDTBPMGCW")
k.loadSprite("setting", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/settings.png?token=ALRAJWBE4VHLEGERZCVR5DDBPMGCG")

k.loadSprite("gateway", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/gateway.png?token=ALRAJWEOGIVVVFYUAPK4QLDBPMGMU")
k.loadSprite("server", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/server.png?token=ALRAJWCSY6RQPP4F6AXEGE3BPMGX6")
k.loadSprite("router", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/router.png?token=ALRAJWAUZFDQR547SVAEOLLBPMGNC")
k.loadSprite("cache", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/cache.png?token=ALRAJWGIMJCRWGJLRKEES4LBPMGL6")
k.loadSprite("database", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/database.png?token=ALRAJWGEWJWAUWHU2OAEKVTBPMGMG")
k.loadSprite("desktop", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/desktop.png?token=ALRAJWA2F4W7S53SZLSWUNTBPMGMO")
k.loadSprite("hub", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/hub.png?token=ALRAJWDBJ5GQEPCA5XSS2VLBPMGM2")

// k.loadFont("unscii", "https://raw.githubusercontent.com/replit/kaboom/master/assets/fonts/unscii_8x8.png", 8, 8);
// const fonts = [
// 	"apl386o",
// 	"apl386",
// 	"sinko",
// 	"sink",
// 	"unscii"
// ];

function addPlayerInfo(name) {
  var currLevel = 0;
  var currScore = 0;
  
  k.add([
    k.text("Level:", {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.08, height * 0.05),
    origin("center"),
  ]);
  
  const level = k.add([
    k.text(currLevel, {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.14, height * 0.05),
    origin("center"),
  ]);
  
  k.keyPress("up", () => {
    level.text = ++currLevel;
  }); 
  
  k.keyPress("down", () => {
    level.text = --currLevel;
  }); 
  
  k.add([
    k.text(name, {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.3, height * 0.05),
    origin("center"),
  ]);

  k.add([
    k.text("[SCORE:     ]", {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.49, height * 0.05),
    origin("center"),
  ]);
  
  k.add([
    k.text(currScore, {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.53, height * 0.05),
    origin("center"),
  ]);

  // rank to be loaded when the game ends
  // k.add([
  //   k.text("Rank:", {
  //     size: 12,
  //   }),
  //   k.pos(120, 25),
  //   origin("center"),
  // ]);
}

function addButton(txt, p, f) {
  const btn = k.add([
    k.sprite(txt),
    k.pos(p),
    k.area({ cursor: "pointer", }),
    k.scale(width * height * 0.00000011),
    origin("center"),
    k.color(255, 255, 255),
  ])

	btn.clicks(f);

	btn.hovers(() => {
		// const t = k.time() * 10;
		// btn.color = k.rgb(
		// 	k.wave(0, 255, t),
		// 	k.wave(0, 255, t + 2),
		// 	k.wave(0, 255, t + 4),
		// );
		btn.scale = k.vec2(width * height * 0.00000012);
	}, () => {
		btn.scale = k.vec2(width * height * 0.00000011);
		// btn.color = k.rgb();
	});
}

function addSettings() {
  addButton("play", k.vec2(window.innerWidth * 0.83, window.innerHeight * 0.05), () => k.debug.log("Game started"));
  addButton("pause", k.vec2(window.innerWidth * 0.87, window.innerHeight * 0.05), () => k.debug.log("Game paused"));
  addButton("restart", k.vec2(window.innerWidth * 0.91, window.innerHeight * 0.05), () => k.debug.log("Game restarted"));
  addButton("setting", k.vec2(window.innerWidth * 0.95, window.innerHeight * 0.05), () => {
    k.go("settingsPage")
  }); 
  
}

let curDraggin = null;

function drag() {
	let offset = k.vec2(0);

	return {
		id: "drag",
		require: [ "pos", "area", ],
		add() {
			this.clicks(() => {
				if (curDraggin) {
					return;
				}
        
				curDraggin = this;
				offset = k.mousePos().sub(this.pos);
				k.readd(this);
			});
		},
    update() {
			if (curDraggin === this) {
				k.cursor("move");
				this.pos = k.mousePos().sub(offset);
			}
		},
	};
}

function addStatic(t, p, r, g, b) {
  k.add([
    k.text(t, {
      size: width * height * 0.000028,
    }),
    k.pos(p),
    origin("center"),
  ]);
  
  
  // k.add([
  //   k.sprite("station"),
  //   k.pos(p),
  //   k.area(),
  //   k.scale(width * height * 0.00000027),
  //   origin("center"),
  //   k.color(r, g, b),
  // ])
}

function addDragable(p, s) {
  k.add([
    k.sprite(s),
    k.pos(p),
    k.area(),
    k.scale(width * height * 0.00000016),
    origin("center"),
    drag(),
    k.color(255, 255, 255)
  ]);
}

function addComponents() {
  k.add([
    k.sprite("gateway"),
    k.pos(width * 0.06, height * 0.46),
    k.area(),
    k.scale(width * height * 0.0000002),
    origin("center"),
    k.color(255, 255, 255)
  ]);
  
  k.add([
    k.text("Gateway", {
      size: width * height * 0.000028,
    }),
    k.pos(width * 0.06, height * 0.55),
    origin("center"),
  ]);
  
  // drag();
  
  // drop
  k.mouseRelease(() => {
    curDraggin = null;
  });

  //adding non-dragable objects (to have an item bar basically)
  //these are gonna be the different components
  //but they only need to be pictures - they don't need game logic
  addStatic("Server", k.vec2(width * 0.27, height * 0.96), 0, 255, 255);
  addStatic("Router", k.vec2(width * 0.39, height * 0.96), 255, 0, 0);
  addStatic("Cache", k.vec2(width * 0.51, height * 0.96), 0, 255, 0);
  addStatic("Database", k.vec2(width * 0.63, height * 0.96), 0, 0, 255);
  addStatic("Desktop", k.vec2(width * 0.75, height * 0.96), 255, 0, 255);
  addStatic("Hub", k.vec2(width * 0.87, height * 0.96), 255, 255, 0);
  
  // adding dragable objects
  // let's do this on click (see moveablecomponents.js)
  // a duplicate picture comes up and be able to drag and drop
  addDragable(k.vec2(width * 0.27, height * 0.87), "server");
  addDragable(k.vec2(width * 0.39, height * 0.87), "router");
  addDragable(k.vec2(width * 0.51, height * 0.87), "cache");
  addDragable(k.vec2(width * 0.63, height * 0.87), "database");
  addDragable(k.vec2(width * 0.75, height * 0.87), "desktop");
  addDragable(k.vec2(width * 0.87, height * 0.87), "hub");

  k.action(() => k.cursor("default"));
}

export default function showGamePage(name) {
  // k.add([
  //   k.text(name)
  // ])
  addPlayerInfo(name);
  addSettings();
  addComponents();
  
  k.scene("mainPage", showHomePage);
  k.scene("settingsPage", showSettingsPage);
  
  k.keyPress("backspace", () => k.go("mainPage"))
}
