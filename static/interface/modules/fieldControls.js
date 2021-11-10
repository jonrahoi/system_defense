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

import { addSprite, addRect } from '../kaboom/objectHandler.js';
import { dragControls, drag } from '../kaboom/components/drag.js';
import { selectControls, select } from '../kaboom/components/select.js';
import { ConnectionDisplayParams } from '../kaboom/components/interfaceConnection.js';
import InterfaceComponent from '../kaboom/components/interfaceComponent.js';
import InterfaceConnection from '../kaboom/components/interfaceConnection.js';
import { scaleComponentImage } from '../kaboom/objectHandler.js';

// Factory function to generate UUIDs
const generateID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const FieldController = {
    // This stores the current level logic object (found in `shared/level.js`)
    // It's the key communication object between Interface --> Game Logic
    logicControls: null,

    loadLogic: (levelLogic) => FieldController.logicControls = levelLogic,

    placeComponent: function(componentName, pos, isClient=false, initial=false) { 

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldController.logicControls === null) {
            console.debug('Attempted to add component but no game logic controller present.');
            return;
        }

        let clientTag = isClient ? "client" : "processor";
        let newID = generateID();

        let logicResponse = FieldController.logicControls.addComponent(componentName, newID, initial);

        // Don't really need this check if it's an initial value. Should always be valid
        if (!logicResponse.valid) {
            console.log(logicResponse.info);
            return;
        }
        var name = () => componentName;

        let tags = [clientTag, componentName, 'selectable'];
        let properties = [name(), select(), InterfaceComponent(componentName, newID, clientTag)];

        if (!initial) {
            tags.push('deletable');
        }
        if (!isClient) {
            tags.push('draggable');
            properties.push(drag());
        }
        
        let size = scaleComponentImage();
        return addSprite(componentName.toLowerCase(), { 
            pos: pos,
            width: size.width, height: size.height,
            area: true,
            origin: 'center',
            tags: tags,
            properties: properties
        });
    },

    connect: function(srcComponent, destComponent) {

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldController.logicControls === null) {
            console.debug('Attempted to connect components but no game logic controller present.');
            return;
        }

        if (!srcComponent || !destComponent) {
            console.debug('Attempted to connect components but either src or dest was missing');
            return;
        }


        let srcID = srcComponent.uuid();
        let destID = destComponent.uuid();
        let logicResponse = FieldController.logicControls.addConnection(srcID, destID);
        
        if (!logicResponse.valid) {
            console.log(logicResponse.info);
            return;
        }

        let ang = srcComponent.pos.angle(destComponent.pos);
        let height = srcComponent.pos.dist(destComponent.pos);

        // FIXME: area() & rotate() don't work together, so can't click a connection 
        let r = addRect({
            width: ConnectionDisplayParams.width, height: height,
            pos: srcComponent.pos,
            color: ConnectionDisplayParams.backgroundColor,
            opacity: ConnectionDisplayParams.opacity,
            rotate: ang,
            origin: 'top',
            tags: [srcID, destID, 'connection'],
            // area: true,
            properties: [InterfaceConnection(srcComponent, destComponent)]
        });
        k.readd(srcComponent);
        k.readd(destComponent);
        return r;
    },

    removeComponent: function(component) {

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldController.logicControls === null) {
            console.debug('Attempted to remove component but no game logic controller present.');
            return;
        }

        if (!component) {
            console.debug('Attempted to remove component but it was missing');
            return;
        }

        let componentName = component.name();
        let componentID = component.uuid();
        let logicResponse = FieldController.logicControls.removeComponent(componentID);

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
        if (FieldController.logicControls === null) {
            console.debug('Attempted to disconnect components but no game logic controller present.');
            return;
        }

        if (!srcComponent || !destComponent) {
            console.debug('Attempted to disconnect components but either src or dest was missing');
            return;
        }

        let srcID = srcComponent.uuid();
        let destID = destComponent.uuid();
        let logicResponse = FieldController.logicControls.removeConnection(srcID, destID);

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

export default FieldController;
