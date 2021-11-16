/**
 * A somewhat basic graphic object that simply displays the sections where the
 * game play occurs and is responsible for determining the dimensions of the
 * client and processor "space"
 */

import k from '../kaboom/kaboom.js';

export default function PlayField(screenX, screenY, screenWidth, screenHeight) {
    this.init(screenX, screenY, screenWidth, screenHeight);

    // Expose function anonymously to ensure correct context
    this.build = () => { this.buildObject(); };
};

PlayField.prototype.init = function(screenX, screenY, screenWidth, screenHeight) {

    this.params = {
        x: screenX,
        y: screenY,
        width: screenWidth, // width of the total field (expand to fill screen width)
        height: screenHeight, // height of the total field (expand to fill screen height)

        outlineWidth: 2,
        outlineColor: [255, 255, 255],

        items: [
            { name: 'client', type: 'space', placement: 'adjacent', widthRatio: 0.1, color: [135, 173, 199], opacity: 0.5 },
            { name: 'edge', type: 'boundary', placement: 'adjacent', widthRatio: 0.01, color: [255, 255, 255], opacity: 0.5 },
            { name: 'component', type: 'space', placement: 'adjacent', widthRatio: 0.79, color: [100, 160, 200], opacity: 0.5 },
            { name: 'endpoint', type: 'space', placement: 'overlap', widthRatio: 0.1, color: [100, 160, 200], opacity: 0 }
        ]
    };

    let prevX = this.params.x;
    let prevY = this.params.y;
    let prevItem = { width: 0 };
    for (let item of this.params.items) {
        if (item.placement === 'overlap') {
            // prevX -= this.params.width * item.widthRatio
            prevItem.width += this.params.width * item.widthRatio
            prevItem.rect.resize(this.params.width * item.widthRatio, 0);
        }
        let itemName = item.name + (item.type.charAt(0).toUpperCase() + item.type.slice(1));
        let itemParams = {
            x: prevX,
            y: prevY,
            width: this.params.width * item.widthRatio,
            height: this.params.height,
            p1: [prevX, prevY],
        }   
        itemParams['p2'] = [prevX + itemParams.width, prevY + itemParams.height];
        itemParams['rect'] = new BoundingRect(prevX, prevY, itemParams.width, itemParams.height);
        Object.assign(itemParams, item);
        this[itemName] = itemParams;
        prevX += itemParams.width;
        prevItem = this[itemName];
    }
};


PlayField.prototype.buildObject = function() {

    // Outer rectangle container
    k.add([ 
        k.rect(this.params.width, this.params.height),
        k.pos(this.params.x, this.params.y),
        k.outline(this.params.outlineWidth, this.params.outlineColor),
    ]);

    for (let item of this.params.items) {
        let itemName = item.name + (item.type.charAt(0).toUpperCase() + item.type.slice(1));
        let itemParams = this[itemName];
        if (item.type === 'boundary') {
            k.drawLine({
                p1: k.vec2(...itemParams.p1),
                p2: k.vec2(...itemParams.p2),
                width: itemParams.width,
                color: k.color(...itemParams.color)
            });
        } else if (item.type === 'space') {
            k.add([
                k.rect(itemParams.width, itemParams.height),
                k.pos(itemParams.x, itemParams.y),
                k.color(...itemParams.color),
                k.opacity(itemParams.opacity)
            ]);
        }
    }
};

PlayField.prototype.inClientSpace = function(x, y, w, h) {
    return this.clientSpace.rect.contains(x, y, w, h);
};
PlayField.prototype.inComponentSpace = function(x, y, w, h) {
    return this.componentSpace.rect.contains(x, y, w, h);
};

PlayField.prototype.confineClientSpace = function(x, y, w, h) {
    return this.clientSpace.rect.confine(x, y, w, h);
};
PlayField.prototype.confineComponentSpace = function(x, y, w, h) {
    return this.componentSpace.rect.confine(x, y, w, h) 
};


/*
 * Simple object used to store a rectangle's coordinates
 * 
 * Used solely to give a "body" to each part of the play field in order to test
 * if a point is in one of the two spaces (client or processor)
 */

function BoundingRect (x, y, w, h) {
    this.width = w;
    this.height = h;
    this.leftBoundary = Math.floor(x);
    this.topBoundary = Math.floor(y);
    this.rightBoundary = Math.floor(x + w);
    this.bottomBoundary = Math.floor(y + h);

    this.move = (newX, newY) => {
        this.leftBoundary = Math.floor(newX);
        this.topBoundary = Math.floor(newY);
        this.rightBoundary = Math.floor(newX + this.w);
        this.bottomBoundary = Math.floor(newY + this.h);
    };

    this.resize = (adjustW, adjustH) => {
        this.width += Math.floor(adjustW);
        this.height += Math.floor(adjustH);
        this.rightBoundary += Math.floor(adjustW);
        this.bottomBoundary += Math.floor(adjustH);
    }

    this.contains = (x, y, w, h) => {
        return (x - w/2) >= this.leftBoundary && (x + w/2) <= this.rightBoundary && 
                (y - h/2) >= this.topBoundary && (y + h/2) <= this.bottomBoundary;
    };

    this.confine = (x, y, w, h) => {
        if ((x - w/2) < this.leftBoundary) {
            x = this.leftBoundary + w/2;
        } else if ((x + w/2) > this.rightBoundary) {
            x = this.rightBoundary - w/2;
        }

        if ((y - h/2) < this.topBoundary) {
            y = this.topBoundary + h/2;
        } else if ((y + h/2) > this.bottomBoundary) {
            y = this.bottomBoundary - h/2;
        }
        return [x, y];
    };
}