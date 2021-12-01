/**
 * Custom Kaboom component to enable dragging of a graphical object
 */

import k from '../index.js';

var dragging = false;
var currDragging = null;
var dragStart = null;

export const dragControls = {
    release: () => { currDragging = null; dragging = false; k.cursor('default'); },
    dragging: () =>  dragging,
    current: () => currDragging,
    acquire: (context, pos) => { dragStart = pos.sub(context.pos); currDragging = context; }
}

export function drag() {
    return {
        require: [ "pos", "area", ],
        updatePos(pos) {
            dragging = true; 
            this.pos = pos.sub(dragStart);
        },
    };
};
