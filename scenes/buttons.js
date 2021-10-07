import k from '../src/kaboom'

add([ 
  rect(160, 20), 
  pos(240, 180), 
  "button" 
]); 
add([ 
  text("Play game"), 
  pos(240, 180), 
  color(0, 0, 0) 
]); 
 
add([ 
  rect(160, 20), 
  pos(240, 210), 
  "button" 
]); 
add([ 
  text("Learn Kaboom.js"), 
  pos(240, 210), 
  color(0, 0, 0) 
]); 
 
action("button", b => { 
  if (b.isHovered()) 
    b.use(color(0.7, 0.7, 0.7)); 
  else 
    b.use(color(1, 1, 1)); 
});
