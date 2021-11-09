/**
 * Holds a controller for manipulating components on the PlayField.
 * 
 * In charge of adding/removing INTERFACE components & connections
 */


import k from '../kaboom/index.js';

import { addSprite, addRect } from '../kaboom/spriteHandler.js';
import { dragControls, drag } from '../kaboom/components/drag.js';
import { selectControls, select } from '../kaboom/components/select.js';
import { ConnectionDisplayParams } from '../kaboom/components/interfaceConnection.js';
import InterfaceComponent from '../kaboom/components/interfaceComponent.js';
import InterfaceConnection from '../kaboom/components/interfaceConnection.js';
import { scaleComponentImage } from '../kaboom/spriteHandler.js';

// Factory function to generate UUIDs
const generateID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const FieldController = {
    logicControls: null,

    loadLogic: (levelLogic) => FieldController.logicControls = levelLogic,

    placeComponent: function(componentName, pos, isClient=false, initial=false) { 
        let clientTag = isClient ? "client" : "processor";
        let newID = generateID();

        let logicResponse = FieldController.logicControls.addComponent(componentName, newID);

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
        addSprite(componentName.toLowerCase(), { 
            pos: pos,
            width: size.width, height: size.height,
            area: true,
            origin: 'center',
            tags: tags,
            properties: properties
        });
    },

    connect: function(srcComponent, destComponent) {
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
        addRect({
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
    },

    removeComponent: function(component) {
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
