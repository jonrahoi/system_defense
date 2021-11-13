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
import State from '../../shared/state.js';




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

    initStage: (addedClients, addedProcessors, addedEndpoints, playField) => {
        // Minimal safety checks... assumed to be OK because no user intervention here

        let newComponents = {};
        let size = scaleComponentImage();

        let baseParams = [
            k.area(),
            k.origin('center'),
            '_component', // used as a group identifier
            'selectable',
            select()
        ];

        let numAddedClients = Object.values(addedClients).reduce((acc,curr) => acc = acc + curr["quantity"], 0);
        let numAddedProcessors = Object.values(addedProcessors).reduce((acc,curr) => acc = acc + curr["quantity"], 0);
        let numAddedEndPoints = Object.values(addedEndpoints).reduce((acc,curr) => acc = acc + curr["quantity"], 0);

        let totalNumClients = numAddedClients + State.placedClientIDs.length;
        let totalNumProcessors = numAddedProcessors + State.placedProcessorIDs.length;
        let totalNumEndpoints = numAddedEndPoints + State.placedEndpointIDs.length;

        if (numAddedClients) {
            let clientSpace = playField.clientSpace.rect;
            let initClientX = clientSpace.leftBoundary + (clientSpace.width / 2);
            let initClientYSpacer = clientSpace.height / (totalNumClients + 1);
    
            let currClientY = clientSpace.topBoundary + initClientYSpacer;
    
            // First adjust all existing client's positions
            for (const clientID of State.placedClientIDs) {
                let interfaceClient = k.get(clientID);
                // Safety check
                if (interfaceClient.length === 1) {
                    let c = interfaceClient[0];
                    c.pos = k.vec2(initClientX, currClientY);
                    currClientY += initClientYSpacer;
                }
            }
            // Then add the new stage's clients
            for (const client of addedClients) {
                // NOTE: can't delete initial components
                for (let i = 0; i < client.quantity; i++) {
                    let newID = generateID();
                    let tags = FieldControls.logicControls.componentSpecs(client.name).tags;
                    tags.push(newID, client.name);
                    let kaboomParams = [k.sprite(client.name, size), k.pos(k.vec2(initClientX, currClientY)), 
                        InterfaceComponent(client.name, newID, tags)];
    
                    k.add(baseParams.concat(kaboomParams, tags));
                    newComponents[newID] = client.name;
                    currClientY += initClientYSpacer;
                }
            }
        }

        baseParams.push('draggable');
        baseParams.push(drag());

        if (numAddedProcessors) {
            // Spread processors out in a line on the field
            let processorSpace = playField.processorSpace.rect;
            let initProcessorY = processorSpace.topBoundary + (processorSpace.height / 2);
            let initProcessorXSpacer = processorSpace.width / (numAddedProcessors + 1);
    
            let currProcessorX = processorSpace.leftBoundary + initProcessorXSpacer;
            for (const processor of addedProcessors) {
                // NOTE: can't delete initial components
                for (let i = 0; i < processor.quantity; i++) {
                    let newID = generateID();
                    let tags = FieldControls.logicControls.componentSpecs(processor.name).tags;
                    tags.push(newID, processor.name);
                    let kaboomParams = [k.sprite(processor.name, size), k.pos(k.vec2(currProcessorX, initProcessorY)), 
                        InterfaceComponent(processor.name, newID, tags)];

                    k.add(baseParams.concat(kaboomParams, tags));
                    newComponents[newID] = processor.name;
                    currProcessorX += initProcessorXSpacer;
                }
            }
        }

        if (numAddedEndPoints) {
            // Spread endpoints out in a line on the field
            let endpointSpace = playField.endpointSpace.rect;
            let initEndpointX = endpointSpace.leftBoundary + (endpointSpace.width / 2);
            let initEndpointYSpacer = endpointSpace.height / (numAddedEndPoints + 1);
    
            let currEndpointY = endpointSpace.topBoundary + initEndpointYSpacer;
    
            // First adjust all existing endpoint's positions
            for (const endpointID of State.placedEndpointIDs) {
                let interfaceEndpoint = k.get(endpointID);
                // Safety check
                if (interfaceEndpoint.length === 1) {
                    let c = interfaceEndpoint[0];
                    c.pos = k.vec2(initEndpointX, currEndpointY);
                    currEndpointY += initEndpointYSpacer;
                }
            }
    
            // Then add the new stage's endpoints
            for (const endpoint of addedEndpoints) {
                // NOTE: can't delete endpoints
                for (let i = 0; i < endpoint.quantity; i++) {
                    let newID = generateID();
                    let tags = FieldControls.logicControls.componentSpecs(endpoint.name).tags;
                    tags.push(newID, endpoint.name);
                    let kaboomParams = [k.sprite(endpoint.name, size), k.pos(k.vec2(initEndpointX, currEndpointY)), 
                        InterfaceComponent(endpoint.name, newID, tags)];

                    k.add(baseParams.concat(kaboomParams, tags));
                    newComponents[newID] = endpoint.name;
                    currEndpointY += initEndpointYSpacer;
                }
            }
        }

        // Store new data in Game Logic
        FieldControls.logicControls.initStage(newComponents);
    },

    placeComponent: function(componentName, pos) { 

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldControls.logicControls === null) {
            console.debug('Attempted to add component but no game logic controller present.');
            return;
        }

        let newID = generateID();
        let logicResponse = FieldControls.logicControls.addComponent(componentName, newID);

        if (!logicResponse.valid) {
            console.log(logicResponse.info);
            return;
        }

        let size = scaleComponentImage();
        let tags = FieldControls.logicControls.componentSpecs(componentName).tags;
        let params = [
            k.sprite(componentName, { width: size.width, height: size.height }),
            k.pos(pos),
            k.area(),
            k.origin('center'),
            componentName, 
            newID,
            '_component', // used as a group identifier
            'selectable', 
            'deletable',
            'draggable',
            drag(),
            select(),
            InterfaceComponent(componentName, newID, tags)
        ];
        
        return k.add(params);
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
