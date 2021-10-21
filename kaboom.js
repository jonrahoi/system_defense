import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";

export const k = kaboom({
	// width: 580,
	// height: 300,
	// scale: 2.5,
  
  //instead of having a set size we can do this and have everything
  //be relative to the size of the browser window
  //that way we don't need to count pixels for positions
  //can do like k.width * 0.5 or something
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 1,
  //pink
  background: [255, 213, 231],
  // background: [0, 0, 0],
});

export default k;
