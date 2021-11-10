/*
 * Graphic object for testing various features. Can be injected into the 'PlayField'
 * scene and used as a way to generate signals/events in a more simplified way
 * than what finished development will look like (ie. click a button rather than
 * drag and drop an object)
 */


import k from '../kaboom/index.js';

import InterfaceComponent from '../kaboom/components/interfaceComponent.js';
import State from '../../shared/state.js';
import { centered } from '../kaboom/graphicUtils.js';


export function TestLevelChange(x, y, width, height, lvlUpFunc, lvlDownFunc) {
    const textWidthRatio = 1;
    const textHeightRatio = 0.7;

    this.params = {
        x: x, 
        y: y, 
        width: width, 
        height: height,
        xSpacer: width * 1.25,
        textWidth: width * textWidthRatio,
        textHeight: height * textHeightRatio,
        lvlUpFunc: lvlUpFunc,
        lvlDownFunc: lvlDownFunc
    }

    this.build = () => { this.buildObject(); };
}

TestLevelChange.prototype.buildObject = function() {

    // Level Down
    let lvlDownBtn = k.add([
        k.rect(this.params.width, this.params.height),
        k.pos(this.params.x, this.params.y),
        k.area(),
        k.color(86, 199, 95),
        k.opacity(0.8),
        k.outline(2, k.color(0, 0, 0)),
    ]);
    lvlDownBtn.clicks(this.params.lvlDownFunc);

    let textCenter = centered(
        { width: this.params.textWidth, height: this.params.textHeight },
        { x: this.params.x + this.params.textWidth, y: this.params.y + this.params.textHeight * 2 }, 
        { width: this.params.width, height: this.params.height },
        'middle', 'center');

    k.add([
        k.text("Level Down", { size: this.params.textHeight, 
                                width: this.params.textWidth }),
        k.pos(textCenter.x, textCenter.y),
        k.color(0, 0, 0),
        k.opacity(0.8),
        k.origin('center')
    ]);

    // Level Up
    let x = this.params.x + this.params.xSpacer;
    let lvlUpBtn = k.add([
        k.rect(this.params.width, this.params.height),
        k.pos(x, this.params.y),
        k.area(),
        k.color(86, 199, 95),
        k.opacity(0.8),
        k.outline(2, k.color(0, 0, 0)),
    ]);
    lvlUpBtn.clicks(this.params.lvlUpFunc);

    textCenter = centered(
        { width: this.params.textWidth, height: this.params.textHeight },
        { x: x + this.params.textWidth, y: this.params.y + this.params.textHeight * 2 }, 
        { width: this.params.width, height: this.params.height }, 
        'middle', 'center');

    k.add([
        k.text("Level Up", { size: this.params.textHeight, 
                                width: this.params.textWidth }),
        k.pos(textCenter.x, textCenter.y),
        k.color(0, 0, 0),
        k.opacity(0.8),
        k.origin('center')
    ]);
}

export default TestLevelChange;