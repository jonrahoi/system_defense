/**
 * Holds a controller for manipulating components on the PlayField.
 * 
 * In charge of adding/removing INTERFACE components & connections
 * 
 * MAIN COMMUNICATION BETWEEN interface AND game logic.
 * Each function "directs" information to verify and create components/connections
 * within Interface and Game Logic
 */


import k from '../kaboom/index.js';

import { drag } from '../kaboom/components/drag.js';
import { select } from '../kaboom/components/select.js';
import { ConnectionDisplayParams } from '../kaboom/components/interfaceConnection.js';
import InterfaceComponent from '../kaboom/components/interfaceComponent.js';
import InterfaceConnection from '../kaboom/components/interfaceConnection.js';
import { scaleComponentImage } from '../kaboom/graphicUtils.js';




// Factory function to generate UUIDs
const generateID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


const FieldControls = {
    // This stores the current level logic object (found in `shared/level.js`)
    // It's the key communication object between Interface --> Game Logic
    logicControls: null,

    loadLogic: (levelLogic) => FieldControls.logicControls = levelLogic,

    placeComponent: function(componentName, pos, isClient=false, initial=false) { 

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldControls.logicControls === null) {
            console.debug('Attempted to add component but no game logic controller present.');
            return;
        }

        let clientTag = isClient ? "client" : "processor";
        let newID = generateID();
        let logicResponse = FieldControls.logicControls.addComponent(componentName, newID, initial);

        // Don't really need this check if it's an initial value. Should always be valid
        if (!logicResponse.valid) {
            console.log(logicResponse.info);
            return;
        }

        var name = () => componentName;
        let size = scaleComponentImage();
        let baseParams = [
            k.sprite(componentName.toLowerCase(), 
                        { width: size.width, height: size.height }),
            k.pos(pos),
            k.area(),
            k.origin('center')
        ];

        let tags = [clientTag, componentName, 'selectable'];
        let properties = [name(), select(), InterfaceComponent(componentName, newID, clientTag)];

        if (!initial) {
            tags.push('deletable');
        }
        if (!isClient) {
            tags.push('draggable');
            properties.push(drag());
        }
        
        let spriteDef = baseParams.concat(tags, properties);
        return k.add(spriteDef);
    },

    connect: function(srcComponent, destComponent) {

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldControls.logicControls === null) {
            console.debug('Attempted to connect components but no game logic controller present.');
            return;
        }
        if (!srcComponent || !destComponent) {
            console.debug('Attempted to connect components but either src or dest was missing');
            return;
        }

        let srcID = srcComponent.uuid();
        let destID = destComponent.uuid();
        let logicResponse = FieldControls.logicControls.addConnection(srcID, destID);
        
        if (!logicResponse.valid) {
            console.log(logicResponse.info);
            return;
        }

        let ang = srcComponent.pos.angle(destComponent.pos);
        let height = srcComponent.pos.dist(destComponent.pos);

        // FIXME: area() & rotate() don't work together, so can't click a connection 
        let baseParams = [
            k.rect(ConnectionDisplayParams.width, height),
            k.pos(srcComponent.pos),
            k.color(...ConnectionDisplayParams.backgroundColor),
            k.opacity(ConnectionDisplayParams.opacity),
            k.origin('top'),
            k.rotate(ang),
            // k.area()
        ];

        let tags = [srcID, destID, 'connection'];
        let properties = [InterfaceConnection(srcComponent, destComponent)];

        let rectDef = baseParams.concat(tags, properties);
        let r = k.add(rectDef);
        
        k.readd(srcComponent);
        k.readd(destComponent);
        return r;
    },

    removeComponent: function(component) {

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldControls.logicControls === null) {
            console.debug('Attempted to remove component but no game logic controller present.');
            return;
        }
        if (!component) {
            console.debug('Attempted to remove component but it was missing');
            return;
        }

        let componentName = component.name();
        let componentID = component.uuid();
        let logicResponse = FieldControls.logicControls.removeComponent(componentID);

        if (!logicResponse.valid) {
            console.log(logicResponse.info);
            return false;
        }
        
        let connections = k.get(componentID);
        for (const conn of connections) {
            k.destroy(conn);
        }
        k.destroy(component);
        return true;
    },

    disconnect: function(srcComponent, destComponent) {

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldControls.logicControls === null) {
            console.debug('Attempted to disconnect components but no game logic controller present.');
            return;
        }
        if (!srcComponent || !destComponent) {
            console.debug('Attempted to disconnect components but either src or dest was missing');
            return;
        }

        let srcID = srcComponent.uuid();
        let destID = destComponent.uuid();
        let logicResponse = FieldControls.logicControls.removeConnection(srcID, destID);

        if (!logicResponse.valid) {
            console.log(logicResponse.info);
            return false;
        }

        let connections = k.get(srcID);
        for (const conn of connections) {
            if (conn.dest() === destComponent) {
                k.destroy(conn);
            }
        }
        return true;
    }
};

export default FieldControls;
