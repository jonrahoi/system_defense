/*
 * Selection "bar" similar to the 'statusBar' object which is displayed at 
 * bottom of the screen. It displays the components available to the user for
 * a specific level. It is responsible for displaying the components and updating
 * their availability as the user drags them onto the screen (currently can't 
 * drag off of the bar. Have to click to add to screen)
 */

import k from '../kaboom/index.js';

import { addSprite, addText, centered, scaleComponentImage } from '../kaboom/spriteHandler.js';
import { dragControls, drag } from '../kaboom/components/drag.js';
import { selectControls, select } from '../kaboom/components/select.js';
import InterfaceComponent from '../kaboom/components/interfaceComponent.js';
import FieldController from './fieldControls.js';


const UNAVAILABLE_OPACITY = 0.5;
const COMPONENT_SPAWN_POS = [k.width() / 2, k.height() / 2];

export default function SelectionBar(screenX, screenY, screenWidth, screenHeight) {
    this.init(screenX, screenY, screenWidth, screenHeight);

    // Expose function anonymously to ensure correct context
    this.build = () => { this.buildObject(); };
};



/**
 * Initialize all parameters (sizing, position, spacing...) for the selection bar
 * 
 * Selection Bar --> displayed under play field and updates with each level
 */
SelectionBar.prototype.init = function(screenX, screenY, screenWidth, screenHeight) {

    this.params = {
        x: screenX, // starting x-pos for the selection bar
        y: screenY, // starting y-pos for the selection bar
        width: screenWidth, // width of the selection bar (expand to fill screen width)
        height: screenHeight, // height of the selection bar (expand to fill screen height)
        
        backgroundColor: [135, 145, 160], // solid color to fill selection bar
        backgroundOpacity: 1, // opacity of the background color

        // ratio of spacing from the left-most boundary of the componentIconBox to the left-most edge 
        // of the SelectionBar relative to SelectionBar's width
        xOffsetRatio: 0.0, 
        // ratio of spacing from the top of the componentIconBox to the top of the SelectionBar 
        // relative to SelectionBar's height
        yOffsetRatio: 0.1, 
        
        // ratio of spacing from the left/right-most boundary of the componentIconBox to the 
        // left/right-most edge of the SelectionBar relative to SelectionBar's width
        xInnerOffsetRatio: 0.05,
        // ratio of spacing from the top/bottom of the componentIconBox to the top/bottom 
        // of the SelectionBar relative to SelectionBar's height
        yInnerOffsetRatio: 0.05,

        componentIconBox: {
            iconOpacity: 0.9, // universal opacity of the menu icons

            xInnerOffsetRatio: 0, // ratio of distance from left/right-most objects to menu left/right boundary
            yInnerOffsetRatio: 0, // ratio of distance from top/bottom of objects to menu top/bottom

            xIconSpacerRatio: 0.1, // ratio of x-spacing ratio based on button width
            yIconSpacerRatio: 0.1, // ratio of y-spacing ratio based on button height

            iconOutlineWidth: 0,
            iconOutlineColor: [255, 255, 255],

            textColor: [0, 0, 0], // universal color of the components' text
            textOpacity: 0.9, // universal opacity of the components' text

            textWidthRatio: 2, // ratio of text width based on button width
            textHeightRatio: 0.2 // ratio of text height based on button height
        }
    };

    this.params['xOffsetSpacer'] = this.params.width * this.params.xOffsetRatio;
    this.params['yOffsetSpacer'] = screenHeight * this.params.yOffsetRatio;

    this.params['xInnerSpacer'] = this.params.width * this.params.xInnerOffsetRatio;
    this.params['yInnerSpacer'] = screenHeight * this.params.yInnerOffsetRatio;
    
    let iconBoxParams = this.params.componentIconBox;

    iconBoxParams['width'] = this.params.width - (2 * this.params.xInnerSpacer);
    iconBoxParams['height'] = this.params.height - (2 * this.params.yInnerSpacer);

    iconBoxParams['x'] = this.params.x + ((this.params.width - iconBoxParams.width) / 2 + this.params.xOffsetSpacer);
    iconBoxParams['y'] = this.params.y + ((screenHeight - iconBoxParams.height + this.params.yOffsetSpacer) / 2);

    // Spacer between the boundary of the menu box and it's internal components
    iconBoxParams['xInnerSpacer'] = iconBoxParams.width * iconBoxParams.xInnerOffsetRatio;
    iconBoxParams['yInnerSpacer'] = iconBoxParams.height * iconBoxParams.yInnerOffsetRatio; 

    // Function to share dimensions of this status bar
    this.dimensions = (() => {
        const dim = {
            x: this.params.x,
            y: this.params.y,
            width: this.params.width,
            height: this.params.height
        };
        return dim;
    })();

};

/*
 * Expected to receive object directly from config file.
 * Both parameters will be objects of the form:
 * [
 *   {
 *     name: ...
 *     quanitity: ...
 *   },
 *   {
 *      name: ...
 *      quantity: ...
 *    }
 * ]
 */
SelectionBar.prototype.setComponents = function(availableProcessors) {

    let numProcessors = availableProcessors.length;
    let iconBoxParams = this.params.componentIconBox;

    iconBoxParams['xIconSpacer'] = iconBoxParams.width * iconBoxParams.xIconSpacerRatio;
    iconBoxParams['yIconSpacer'] = iconBoxParams.height * iconBoxParams.yIconSpacerRatio;

    iconBoxParams['iconWidth'] = ((iconBoxParams.width
        - (2 * iconBoxParams.xInnerSpacer)
        - ((numProcessors - 1) * iconBoxParams.xIconSpacer))
        / numProcessors);
    
    iconBoxParams['iconHeight'] = iconBoxParams.height - (2 * iconBoxParams.yInnerSpacer);

    let scaledIconDims = scaleComponentImage(iconBoxParams.iconWidth, iconBoxParams.iconHeight);

    iconBoxParams['scaledIconWidth'] = scaledIconDims.width;
    iconBoxParams['scaledIconHeight'] = scaledIconDims.height;

    iconBoxParams['textWidth'] = iconBoxParams.scaledIconWidth * iconBoxParams.textWidthRatio;
    iconBoxParams['textHeight'] = iconBoxParams.scaledIconHeight * iconBoxParams.textHeightRatio;

    
    // Clear old values
    this.objects = {};

    let currX = iconBoxParams.x;
    let currY = iconBoxParams.y;

    for (let i = 0; i < numProcessors; i++) {
        let processor = availableProcessors[i];
        
        // ComponentDirectory[processor.name] = {};
        
        currX += iconBoxParams.xIconSpacer;
        let textCenter = centered(
            { width: iconBoxParams.textWidth, height: iconBoxParams.textHeight }, 
            { x: currX, y: currY }, 
            { width: iconBoxParams.scaledIconWidth, height: iconBoxParams.scaledIconHeight},
            'bottom', 'center');

        this.objects[processor.name] = {
            quantity: processor.quantity,
            x: currX,
            y: currY,
            width: iconBoxParams.scaledIconWidth,
            height: iconBoxParams.scaledIconHeight,
            opacity: iconBoxParams.iconOpacity,
            outlineWidth: iconBoxParams.iconOutlineWidth,
            outlineColor: iconBoxParams.iconOutlineColor,
            text: {
                x: textCenter.x,
                y: textCenter.y,
                width: iconBoxParams.textWidth,
                height: iconBoxParams.textHeight,
                origin: 'center',
                color: iconBoxParams.textColor,
                opacity: iconBoxParams.textOpacity
            }
        };
    }
};


SelectionBar.prototype.buildObject = function() {

    // Selection Bar container
    k.add([
        k.rect(this.params.width, this.params.height),
        k.pos(this.params.x, this.params.y),
        k.color(...this.params.backgroundColor),
        k.opacity(this.params.backgroundOpacity),
    ]);

    // Place processors - unknown amount so must loop
    for (const [name, attributes] of Object.entries(this.objects)) {
        // First place icon
        let processorBtn = addSprite(name.toLowerCase(), {
            width: attributes.width,
            height: attributes.height,
            xPos: attributes.x,
            yPos: attributes.y,
            opacity: attributes.opacity,
            area: true
        });
        
        processorBtn.clicks(() => this.update(name));

        attributes['iconGraphic'] = processorBtn;

        // Then place text underneath
        let labelText = attributes.text;
        const label = addText(formatLabel(name, attributes.quantity), {
            size: labelText.height, width: labelText.width,
            xPos: labelText.x, yPos: labelText.y, origin: labelText.origin,
            color: labelText.color, opacity: labelText.opacity
        })
        attributes['textGraphic'] = label;
    };
};


SelectionBar.prototype.update = function(componentName, amount = -1) { 

    if (this.objects.hasOwnProperty(componentName)) {

        let target = this.objects[componentName];
        let newQuantity = target.quantity + amount;

        // Already out of this component. Can only accept +amounts
        if (target.quantity < 1) {
            // Have 0 remaining
            if (amount < 0) {
                // Try decreasing amount
                console.debug(`Can't place a ${componentName}. None available`);
                return false;
            } else if (amount > 0) {
                // Try increasing amount
                console.debug(componentName, 'is now available.');

                k.destroy(target.iconGraphic);
                delete target.iconGraphic;

                let targetBtn = addSprite(componentName.toLowerCase(), {
                    width: target.width,
                    height: target.height,
                    xPos: target.x,
                    yPos: target.y,
                    opacity: target.opacity,
                    area: true
                });
                targetBtn.clicks(() => this.update(componentName));

                target.iconGraphic = targetBtn;

                target.textGraphic.text = formatLabel(componentName, newQuantity);
                target.textGraphic.opacity = target.text.opacity;
            }
        } else {
            // Have at least 1 remaining of this component
            if (amount < 0) {
                if (!FieldController.placeComponent(componentName.toLowerCase(), k.vec2(...COMPONENT_SPAWN_POS), false)) {
                    return false;
                }
            }
            if (newQuantity <= 0) { 
                // Trying to decrease to an invalid state (<= 0)
                console.debug(`No more ${componentName}s available`);

                k.destroy(target.iconGraphic);

                let targetBtn = addSprite(componentName.toLowerCase(), {
                    width: target.width,
                    height: target.height,
                    xPos: target.x,
                    yPos: target.y,
                    opacity: UNAVAILABLE_OPACITY,
                    area: true
                });

                target.iconGraphic = targetBtn;

                target.textGraphic.text = formatLabel(componentName, 0);
                target.textGraphic.opacity = UNAVAILABLE_OPACITY;

            } else {
                target.textGraphic.text = formatLabel(componentName, newQuantity);
            }
        }
        target.quantity = newQuantity;
        return true;
    }
    return false;
};

const formatLabel = (name, quantity) => { return `${name.replaceAll('_', ' ')} x${quantity}`};