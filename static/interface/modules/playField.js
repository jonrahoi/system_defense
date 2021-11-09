/**
 * A somewhat basic graphic object that simply displays the sections where the
 * game play occurs and is responsible for determining the dimensions of the
 * client and processor "space"
 */

import k from '../kaboom/index.js';

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

        clientToProcRatio: 0.1, // ratio of width between client space and processor space
        
        outlineWidth: 2,
        outlineColor: k.color(255, 255, 255),

        edgeBoundary: {
            y: screenY,
            width: 20,
            height: screenHeight,
            color: k.color(255, 255, 255)
        },

        clientSpace: {
            x: screenX,
            y: screenY,
            height: screenHeight,
            backgroundColor: k.color(135, 173, 199),
            backgroundOpacity: k.opacity(0.5),

            xInnerOffsetRatio: 0,
            yInnerOffsetRatio: 0
        },

        processorSpace: {
            y: screenY,
            height: screenHeight,
            backgroundColor: k.color(100, 160, 200),
            backgroundOpacity: k.opacity(0.5),

            xInnerOffsetRatio: 0,
            yInnerOffsetRatio: 0
        }
    };

    let clientSpaceParams = this.params.clientSpace;
    clientSpaceParams['width'] = this.params.width * this.params.clientToProcRatio;
    clientSpaceParams['xInnerSpacer'] = clientSpaceParams.width * clientSpaceParams.xInnerOffsetRatio;
    clientSpaceParams['yInnerSpacer'] = clientSpaceParams.height * clientSpaceParams.yInnerOffsetRatio;
    
    let edgeBoundaryParams = this.params.edgeBoundary;
    edgeBoundaryParams['x'] = clientSpaceParams.x + clientSpaceParams.width;
    edgeBoundaryParams['p1'] = k.vec2(edgeBoundaryParams.x, edgeBoundaryParams.y);
    edgeBoundaryParams['p2'] = k.vec2(edgeBoundaryParams.x, edgeBoundaryParams.y + edgeBoundaryParams.height);

    let processorSpaceParams = this.params.processorSpace;
    processorSpaceParams['x'] = edgeBoundaryParams.x + edgeBoundaryParams.width; 
    processorSpaceParams['width'] = (this.params.width * (1 - this.params.clientToProcRatio)) - this.params.edgeBoundary.width;
    processorSpaceParams['xInnerSpacer'] = processorSpaceParams.width * processorSpaceParams.xInnerOffsetRatio;
    processorSpaceParams['yInnerSpacer'] = processorSpaceParams.height * processorSpaceParams.yInnerOffsetRatio;


    this.clientSpace = {
        x: screenX,
        y: screenY,
        width: clientSpaceParams.width,
        height: clientSpaceParams.height,
        p1: k.vec2(clientSpaceParams.x, clientSpaceParams.y),
        p2: k.vec2(clientSpaceParams.x + clientSpaceParams.width, 
            clientSpaceParams.y + clientSpaceParams.height)
    };
    this.clientSpace['rect'] = new BoundaryRect(this.clientSpace.x, this.clientSpace.y, 
        this.clientSpace.width, this.clientSpace.height);

    this.processorSpace = {
        x: screenX + clientSpaceParams.width + this.params.edgeBoundary.width,
        y: screenY,
        width: processorSpaceParams.width,
        height: processorSpaceParams.height,
        p1: k.vec2(processorSpaceParams.x, processorSpaceParams.y),
        p2: k.vec2(processorSpaceParams.x + processorSpaceParams.width, 
            processorSpaceParams.y + processorSpaceParams.height)
    };
    this.processorSpace['rect'] = new BoundaryRect(this.processorSpace.x, this.processorSpace.y, 
        this.processorSpace.width, this.processorSpace.height);

};



PlayField.prototype.buildObject = function() {

    // Outer rectangle container
    k.add([ 
        k.rect(this.params.width, this.params.height),
        k.pos(this.params.x, this.params.y),
        k.outline(this.params.outlineWidth, this.params.outlineColor),
    ]);

    // Client space rectangle container
    k.add([
        k.rect(this.clientSpace.width, this.clientSpace.height),
        k.pos(this.clientSpace.x, this.clientSpace.y),
        this.params.clientSpace.backgroundColor,
        this.params.clientSpace.backgroundOpacity,
    ])

    // Edge boundary
    k.drawLine({
        p1: this.params.edgeBoundary.p1,
        p2: this.params.edgeBoundary.p2,
        width: this.params.edgeBoundary.width,
        color: this.params.edgeBoundary.color,
    });

    // Processor space rectangle container
    k.add([
        k.rect(this.processorSpace.width, this.processorSpace.height),
        k.pos(this.processorSpace.x, this.processorSpace.y),
        this.params.processorSpace.backgroundColor,
        this.params.processorSpace.backgroundOpacity,
    ]);
};

PlayField.prototype.inClientSide = function(x, y, w, h, centerOrigin=true) {
    if (centerOrigin) {
        return this.clientSpace.rect.confineCentered(x, y, w, h);
    }
    return this.clientSpace.rect.confine(x, y, w, h);
};

PlayField.prototype.inProcessorSide = function(x, y, w, h, centerOrigin=true) {
    if (centerOrigin) {
        return this.processorSpace.rect.confineCentered(x, y, w, h);
    }
    return this.processorSpace.rect.confine(x, y, w, h);
};


function BoundaryRect (x, y, w, h) {
    this.width = w;
    this.height = h;
    this.leftBoundary = Math.floor(x);
    this.topBoundary = Math.floor(y);
    this.rightBoundary = Math.floor(x + w);
    this.bottomBoundary = Math.floor(y + h);

    this.contains = (x, y, w, h) => {
        return x >= this.leftBoundary && (x + w) <= this.rightBoundary && 
                y >= this.topBoundary && (y + h) <= this.bottomBoundary;
    };

    this.confine = (x, y, w, h) => {
        if (x < this.leftBoundary) {
            x = this.leftBoundary;
        } else if ((x + w) > this.rightBoundary) {
            x = this.rightBoundary - w;
        }

        if (y < this.topBoundary) {
            y = this.topBoundary;
        } else if ((y + h) > this.bottomBoundary) {
            y = this.bottomBoundary - h;
        }
        return [x, y];
    };

    this.containsCentered = (x, y, w, h) => {
        return (x - w/2) >= this.leftBoundary && (x + w/2) <= this.rightBoundary && 
                (y - h/2) >= this.topBoundary && (y + h/2) <= this.bottomBoundary;
    };

    this.confineCentered = (x, y, w, h) => {
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