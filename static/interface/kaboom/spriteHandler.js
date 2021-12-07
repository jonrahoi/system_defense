/**
 * Aggregation of Kaboom's "graphic object"-specific functions. Used to simplify
 * repeated graphical manipulation and house default values.
 * 
 * While it may have simplified things in my mind some of the functions may actually
 * prove to be more complicated than simply working from scratch everytime. In which case
 * these functions can readily be removed and the original Kaboom code can be
 * used to accomplish the same thing
 */


import k from './index.js';

const DEFAULT_POS = [0, 0];
const DEFAULT_SIZE = { width: 75, height: 75 };
const DEFAULT_COLOR = [255, 255, 255];
const DEFAULT_OUTLINE_WIDTH = 4;
const DEFAULT_OUTLINE_COLOR = k.BLACK;

// Do we want this constant? Would be best to scale them...
const COMPONENT_IMG_WIDTH = 75;
const COMPONENT_IMG_HEIGHT = 75;

/**
 * Expected parameters:
 * options: {
 *  xScale, yScale --> integers/floats
 *  scale, --> integer/float
 *  xPos, yPos, --> integers/floats
 *  pos, --> integer/float
 *  origin, --> { 'topleft', 'left', 'botleft', 'top', 'center', 'bot', 'topright', 'right', 'botright' }
 *  color, --> array: [r, g, b]
 *  opacity, --> float [0 - 1]
 *  outline, --> array (length==2): [width, k.color(...)], array (length==4): [width, r, g, b]
 *  rotate, --> integer/float
 *  area, --> object: areaOptions (as seen on Kaboom), boolean
 *  body, --> boolean
 *  tags, --> array: string tags to assign to the object
 *  properties, --> array: components to assign to the object
 * }
 */ 

// text: "display string"
export var addText = function(text, options) {
    let params = parseOptions('text', text, options);
    return k.add(params);
}

export var addRect = function(options) {
    let params = parseOptions('rect', null, options);
    return k.add(params);
}

// name: "sprite name"
export var addSprite = function(name, options) {
    let params = parseOptions('sprite', name, options);
    return k.add(params);
}



// Scale an image according to a bounding box 
export const scaleComponentImage = (w, h) => {
    w = w || COMPONENT_IMG_WIDTH;
    h = h || COMPONENT_IMG_HEIGHT;
    w = Math.min(w, COMPONENT_IMG_WIDTH),
    h = Math.min(h, COMPONENT_IMG_HEIGHT);
    var ratio = Math.min((COMPONENT_IMG_WIDTH / w), (COMPONENT_IMG_HEIGHT / h));
    return { width: (w * ratio), height: (h * ratio) };
};


// Center object on an anchor
/**
 * Expected parameters:
 * objSize: { width, height }
 * anchorPos: { x, y }
 * anchorSize: { width, height }
 * align: { 'top', 'middle', 'mid', 'bottom', 'bot' }
 * origin: { 'topleft', 'left', 'botleft', 'top', 'center', 'bot', 'topright', 'right', 'botright' }
 */ 
export var centered = function(objSize, anchorPos, anchorSize, align='bottom', origin='topleft') {

    let xOffset, yOffset, centerX, centerY;
    
    // Calculate xOffset based on origin
    if (origin === 'topleft' || origin === 'left' || origin === 'botleft') {
        xOffset = Math.abs(objSize.width - anchorSize.width) / 2;
    } else if (origin === 'top' || origin === 'center' || origin === 'bot') {
        xOffset = (Math.abs(objSize.width - anchorSize.width) / 2) - (objSize.width / 2);
    } else if (origin === 'topright' || origin === 'right' || origin === 'botright') {
        xOffset = (Math.abs(objSize.width - anchorSize.width) / 2) - objSize.width;
    }

    // Calculate yOffset based on origin
    if (origin === 'topleft' || origin === 'top' || origin === 'topright') {
        yOffset = (Math.abs(objSize.height - anchorSize.height) / 2) - (3 * objSize.height);
    } else if (origin === 'left' || origin === 'center' || origin === 'right') {
        yOffset = (Math.abs(objSize.height - anchorSize.height) / 2) - (2.5 * objSize.height);
    } else if (origin === 'botleft' || origin === 'bot' || origin === 'botright') {
        yOffset = (Math.abs(objSize.height - anchorSize.height) / 2) - (2 * objSize.height);
    }

    // Account for vertical alignment
    if (align === 'middle' || align === 'mid') {
        yOffset += (anchorSize.height / 2) + (objSize.height / 2);
    } else if (align === 'bottom' || align === 'bot') {
        yOffset += (anchorSize.height + objSize.height);
    }

    // Combine above calculations to produce final centered position
    if (objSize.width > anchorSize.width) {
        centerX = anchorPos.x - xOffset;
    } else {
        centerX = anchorPos.x + xOffset;
    }

    if (objSize.height > anchorSize.height) {
        centerY = anchorPos.y - yOffset;
    } else {
        centerY = anchorPos.y + yOffset;
    }

    return { x: centerX, y: centerY };
};


var parseOptions = function(type, label, options={}) {
    var params = [];
    var typeFunc, sizeLabels;

    // Setup for text or sprite
    if (type === 'sprite') {
        typeFunc = k.sprite;
        sizeLabels = ['width', 'height'];
    } else if (type === 'text') {
        typeFunc = k.text;
        sizeLabels = ['width', 'size']
    } else if (type === 'rect') {
        typeFunc = (val, opts) => { return k.rect(opts.width, opts.height); };
        sizeLabels = ['width', 'height'];
    } else {
        return;
    }

    var componentFunc = (value, opts) => {
        if (opts) { return typeFunc(value, opts) };
        return typeFunc(value);
    }

    // Get scale/sizing
    let xyScale = pairedOptions('xScale', 'yScale', options);
    if (xyScale) {
        params.push(componentFunc(label, null));
        params.push(k.scale(...xyScale));
    } else {
        // check for vector position
        if (options.hasOwnProperty('scale')) {
            params.push(componentFunc(label, null));
            params.push(k.scale(options.scale));
        } else {
            // check for size parameters
            let size = pairedOptions(...sizeLabels, options);
            if (size) {
                let sizeParams = {}
                sizeParams[sizeLabels[0]] = size[0];
                sizeParams[sizeLabels[1]] = size[1];
                params.push(componentFunc(label, sizeParams));
            } else {
                params.push(componentFunc(label, DEFAULT_SIZE));
            }
        }
    }

    // Get position
    let xyPos = pairedOptions('xPos', 'yPos', options);
    if (xyPos) {
        params.push(k.pos(...xyPos));
    } else {
        // check for vector position
        if (options.hasOwnProperty('pos')) {
            params.push(k.pos(options.pos));
        } else {
            params.push(k.pos(...DEFAULT_POS));
        }
    }

    // Get origin
    if (options.hasOwnProperty('origin')) {
        params.push(k.origin(options.origin));
    }

    // Get color
    if (options.hasOwnProperty('color')) {
        let color = options.color;
        if (color.length != 3) {
            params.push(k.color(...DEFAULT_COLOR));
        } else {
            params.push(k.color(...color));
        }
    }

    // Get opacity
    if (options.hasOwnProperty('opacity')) {
        params.push(k.opacity(options.opacity));
    }

    // Get outline
    if (options.hasOwnProperty('outline')) {
        let outline = options.outline;
        if (outline.length == 2) {
            params.push(k.outline(...outline));
        } else if (outline.length == 4) {
            params.push(k.outline(outline.shift(), k.color(...outline)));
        } else {
            params.push(k.outline(DEFAULT_OUTLINE_WIDTH, DEFAULT_OUTLINE_COLOR));
        }
    }

    // Get rotate
    if (options.hasOwnProperty('rotate')) {
        params.push(k.rotate(options.rotate));
    }

    // Get area
    if (options.hasOwnProperty('area')) {
        let areaOpt = options.area;
        if (typeof areaOpt === 'object') {
            params.push(k.area(areaOpt));
        } else {
            params.push(k.area());
        }
    }

    // Get body
    if (options.hasOwnProperty('body')) {
        params.push(k.body());
    }

    // Get tags
    if (options.hasOwnProperty('tags')) {
        for (let tag of options.tags) {
            params.push(tag);
        }
    }

    // Get custom components
    if (options.hasOwnProperty('properties')) {
        for (let prop of options.properties) {
            params.push(prop);
        }
    }

    return params;
};


// Collect options that are required to come in a pair (ie. x & y)
var pairedOptions = function(label1, label2, options) {
    var param1, param2;
    if (options.hasOwnProperty(label1)) { 
        param1 = options[label1];
         param2 = options[label1];
        if (options.hasOwnProperty(label2)) { param2 = options[label2]; }
        return [param1, param2];
    } else if (options.hasOwnProperty(label2)) { 
        param2 = options[label2];
        param1 = options[label2];
        if (options.hasOwnProperty(label1)) { param2 = options[label1]; }
        pos = k2.vec2(x, y);
        return [param1, param2];
    }
};