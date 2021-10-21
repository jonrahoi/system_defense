import k from '../kaboom.js'
import showHomePage from '../scenes/home.js'
import showGamePage from '../scenes/game.js'

const width = window.innerWidth;
const height = window.innerHeight;

k.loadSprite("back", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/play.png?token=ALRAJWEDM4XXY7LY6ZG7ZNTBPMGCO")
k.loadSprite("home", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/buttons/home.png?token=ALRAJWCJBXVZNPWWBNWXDP3BPML5A")
k.loadSprite("fast", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/buttons/fast.png?token=ALRAJWGBNVFMGAL4Y32X4EDBPMOHC")
k.loadSprite("slow", "https://raw.githubusercontent.com/jonrahoi/system_defense/main/assets/buttons/slow.png?token=ALRAJWASQD7PQX7XHARXZ2LBPMOHK")

function addBackground() {
  k.add([
		k.rect(width, height),
		// k.outline(4),
		k.pos(0, height),
		k.origin("botleft"),
		k.area(),
		// k.solid(),
		k.color(202, 181, 190),
	]);
  
  k.add([
		k.rect(width / 2, height / 2),
		k.outline(4),
		k.pos(width / 2, height / 2),
		k.origin("center"),
		k.area(),
		// k.solid(),
		k.color(255, 213, 231),
	]);
}

function addSettings() {
  k.add([
    k.text("Settings", {
      size: width * height * 0.00005,
    }),
    k.pos(width * 0.5, height * 0.3),
    origin("center"),
  ]);
  
  const backBtn = k.add([
    k.sprite("back"),
    k.pos(width * 0.35, height * 0.52),
    k.area({ cursor: "pointer", }),
    k.scale(width * height * 0.0000002),
    origin("center"),
    k.color(255, 255, 255),
  ])
  
	backBtn.hovers(() => {
		backBtn.scale = k.vec2(width * height * 0.00000021);
	}, () => {
		backBtn.scale = k.vec2(width * height * 0.0000002);
	});
  
  k.scene("gamePage", showGamePage);
  backBtn.clicks(() => {
    k.go("gamePage")
  });
  
  k.add([
    k.text("Back", {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.35, height * 0.63),
    origin("center"),
  ]);
  
  const homeBtn = k.add([
    k.sprite("home"),
    k.pos(width * 0.45, height * 0.52),
    k.area({ cursor: "pointer", }),
    k.scale(width * height * 0.0000002),
    origin("center"),
    k.color(255, 255, 255),
  ])
  
  homeBtn.hovers(() => {
		homeBtn.scale = k.vec2(width * height * 0.00000021);
	}, () => {
		homeBtn.scale = k.vec2(width * height * 0.0000002);
	});
  
  k.scene("homePage", showHomePage);
  homeBtn.clicks(() => {
    k.go("homePage")
  });
  
  k.add([
    k.text("Home", {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.45, height * 0.63),
    origin("center"),
  ]);
  
  const fastBtn = k.add([
    k.sprite("fast"),
    k.pos(width * 0.55, height * 0.52),
    k.area({ cursor: "pointer", }),
    k.scale(width * height * 0.0000002),
    origin("center"),
    k.color(255, 255, 255),
  ])
  
  fastBtn.hovers(() => {
		fastBtn.scale = k.vec2(width * height * 0.00000021);
	}, () => {
		fastBtn.scale = k.vec2(width * height * 0.0000002);
	});
  
  fastBtn.clicks(() => {
    k.debug.log("Fast mode")
  })
  
  k.add([
    k.text("Faster", {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.55, height * 0.63),
    origin("center"),
  ]);
  
  const slowBtn = k.add([
    k.sprite("slow"),
    k.pos(width * 0.65, height * 0.52),
    k.area({ cursor: "pointer", }),
    k.scale(width * height * 0.0000002),
    origin("center"),
    k.color(255, 255, 255),
  ])
  
  slowBtn.hovers(() => {
		slowBtn.scale = k.vec2(width * height * 0.00000021);
	}, () => {
		slowBtn.scale = k.vec2(width * height * 0.0000002);
	});
  
  slowBtn.clicks(() => {
    k.debug.log("Slow mode")
  })
  
  k.add([
    k.text("Slower", {
      size: width * height * 0.000035,
    }),
    k.pos(width * 0.65, height * 0.63),
    origin("center"),
  ]);
  
}

export default function showSettingsPage() {
  addBackground();
  addSettings();

}




/*
  addButton("home", k.vec2(window.innerWidth * 0.95, window.innerHeight * 0.05), () => {
    k.go("mainPage")
  });
*/
