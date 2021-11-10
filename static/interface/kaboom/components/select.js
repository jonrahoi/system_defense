/**
 * Custom Kaboom component to enable a graphical object to be selected
 * 
 * Holds control for basic selection as well as selections for connections
 */


import k from '../index.js';

const DFLT_SELECT_SHADER = 'green_tint';
const CONNECTING_SELECT_SHADER = 'red_tint';

var currSelected = null;

var srcSelected = null;
var destSelected = null;

var count = 0;

// Controls for when a component is selected 
export const selectControls = {
    release: () => { 
        if (currSelected) {
            currSelected.unselected();
        } 
        currSelected = null; },
    current: () => currSelected,
    acquire: (context) => {
        selectControls.release();
        context.selected(DFLT_SELECT_SHADER);
        currSelected = context; }
};

// Controls for when a component is selected with the INTENT of connecting
export const connectControls = {
    release: () => { 
        if (srcSelected) { srcSelected.unselected(); } 
        if (destSelected) { destSelected.unselected(); } 
        destSelected = null; 
        srcSelected = null; 
    },
    isValid: () => { return destSelected && srcSelected; },
    current: () => { return { src: srcSelected, dest: destSelected }; },
    acquire: (context) => {
        if (srcSelected) { srcSelected.unselected(); } 
        context.selected(CONNECTING_SELECT_SHADER);
        srcSelected = destSelected; 
        destSelected = context; }
};

export function select() { 
    return {
        require: [ 'pos', 'area' ],
        selected(type)  { 
            switch(type) {
                case CONNECTING_SELECT_SHADER:
                    this.use(k.shader(CONNECTING_SELECT_SHADER)); 
                break;
                default:
                    this.use(k.shader(DFLT_SELECT_SHADER));
                    // this.use(k.color(...DFLT_SELECT_COLOR)); 
            }
        },
        unselected() { this.unuse('shader'); },
    };
}


