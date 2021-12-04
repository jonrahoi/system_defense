/**
 * Holds a controller for manipulating components on the PlayField.
 * 
 * In charge of adding/removing INTERFACE components & connections
 * 
 * MAIN COMMUNICATION BETWEEN interface AND game logic.
 * Each function "directs" information to verify and create components/connections
 * within Interface and Game Logic
 */

import k from '../kaboom/kaboom.js';


import InterfaceComponent from '../kaboom/components/interfaceComponent.js';
import InterfaceConnection from '../kaboom/components/interfaceConnection.js';
import State from '../../shared/state.js';
import generateUUID from '../../utilities/uuid.js';

import { drag } from '../kaboom/components/drag.js';
import { select } from '../kaboom/components/select.js';
import { ConnectionDisplayParams } from '../kaboom/components/interfaceConnection.js';
import { ScaledComponentImage } from '../kaboom/graphicUtils.js';


const FieldControls = {
    // This stores the current level logic object (found in `shared/level.js`)
    // It's the key communication object between Interface --> Game Logic
    logicControls: null,

    loadLogic: (levelLogic) => FieldControls.logicControls = levelLogic,

    initStage: (addedClients, addedProcessors, addedEndpoints, playField) => {
        // Minimal safety checks... assumed to be OK because no user intervention here

        let addedComponents = {};
        let size = ScaledComponentImage();

        let baseParams = [
            k.area(),
            k.origin('center'),
            '_component', // used as a group identifier
            'selectable',
            select()
        ];

        const appendComponents = (currPos, spacers, existingIDs, newComponents, boundaryBox) => { 
            // First adjust all existing endpoint's positions
            let existingComponent, interfaceComponents;
            for (const componentID of existingIDs) {
                interfaceComponents = k.get(componentID);
                // Safety check
                if (interfaceComponents.length === 1) {
                    existingComponent = interfaceComponents[0];
                    existingComponent.pos = currPos;
                    currPos.add(spacers);
                }
            }
    
            // Then add the new stage's endpoints
            let newID, tags, kaboomParams, interfaceComponent;
            for (const component of newComponents) {
                tags = FieldControls.logicControls.componentSpecs(component.name).tags;
                if (!tags.includes('CLIENT')) {
                    tags.push('draggable');
                    tags.push(drag());
                }
                for (let i = 0; i < component.quantity; i++) {
                    newID = generateUUID();
                    tags.push(newID, component.name);
                    interfaceComponent = InterfaceComponent(component.name, newID, tags, currPos, size.width, size.height);
                    interfaceComponent.setBoundaryBox(boundaryBox);
                    kaboomParams = [k.sprite(component.name, size), k.pos(currPos), 
                        interfaceComponent
                        // InterfaceComponent(component.name, newID, tags)
                        ];

                    k.add(baseParams.concat(kaboomParams, tags));
                    addedComponents[newID] = component.name;
                    currPos.add(spacers);
                }
            }
        };

        let reducer = (acc,curr) => acc = acc + curr["quantity"];
        let numAddedClients = Object.values(addedClients).reduce(reducer, 0);
        let numAddedProcessors = Object.values(addedProcessors).reduce(reducer, 0);
        let numAddedEndPoints = Object.values(addedEndpoints).reduce(reducer, 0);

        let totalNumClients = numAddedClients + State.placedClientIDs.length;
        let totalNumProcessors = numAddedProcessors + State.placedProcessorIDs.length;
        let totalNumEndpoints = numAddedEndPoints + State.placedEndpointIDs.length;

        if (numAddedClients) {
            let clientSpace = playField.clientSpace.rect;
            let clientSpacer = k.vec2(0, clientSpace.height / (totalNumClients + 1));
            let initClientPos = clientSpace.E;
            appendComponents(initClientPos, clientSpacer,
                            State.placedClientIDs, addedClients, clientSpace);
        }

        if (numAddedProcessors) {
            // Spread processors out in a line on the field
            let componentSpace = playField.componentSpace.rect;
            let processorXSpacer = componentSpace.width / (numAddedProcessors + 1);
            let processorYSpacer = 0;

            let processorSpacer = componentSpace.A.add(k.vec2(processorXSpacer, (componentSpace.height / 2)));
            let initProcessorPos = componentSpace.E;
    
            appendComponents(initProcessorPos, processorSpacer,
                            [], addedProcessors, componentSpace);
        }

        if (numAddedEndPoints) {
            // Spread endpoints out in a line on the field
            let endpointSpace = playField.endpointSpace.rect;
            let endpointXSpacer = 0;
            let endpointYSpacer = endpointSpace.height / (numAddedEndPoints + 1);

            let endpointSpacer = endpointSpace.A.add((endpointSpace.width / 2), endpointYSpacer);
            let initEndpointPos = endpointSpace.E;
            appendComponents(initEndpointPos, endpointSpacer,
                            State.placedEndpointIDs, addedEndpoints, endpointSpace);
        }

        // Store new data in Game Logic
        FieldControls.logicControls.initStage(addedComponents);
    },

    placeComponent: function(componentName, pos) { 

        // Safety check. Need logicControls to communicate with Game Logic
        if (FieldControls.logicControls === null) {
            console.debug('Attempted to add component but no game logic controller present.');
            return;
        }

        let newID = generateUUID();
        let logicResponse = FieldControls.logicControls.addComponent(componentName, newID);

        if (!logicResponse.valid) {
            console.log(logicResponse.info);
            return;
        }
        let size = ScaledComponentImage();
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
            InterfaceComponent(componentName, newID, tags, pos, size.width, size.height)
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

        let ang = srcComponent.pos.angle(destComponent.pos) + 90;
        let height = srcComponent.pos.dist(destComponent.pos);
        let centerX = Math.min(srcComponent.pos.x, destComponent.pos.x) 
                        + (Math.abs(srcComponent.pos.x - destComponent.pos.x) / 2);
        let centerY = Math.min(srcComponent.pos.y, destComponent.pos.y) 
                        + (Math.abs(srcComponent.pos.y - destComponent.pos.y) / 2);

        // FIXME: area() & rotate() don't work together, so can't click a connection 
        let baseParams = [
            k.rect(ConnectionDisplayParams.width, height),
            k.pos(k.vec2(centerX, centerY)),
            k.color(...ConnectionDisplayParams.backgroundColor),
            k.opacity(ConnectionDisplayParams.opacity),
            k.origin('center'),
            k.rotate(ang),
            // k.area()
        ];

        let tags = [srcID, destID, '_connection'];
        let interConnection = new InterfaceConnection(srcComponent, destComponent);

        let rectDef = baseParams.concat(tags);
        rectDef.push(interConnection);
        let connection = k.add(rectDef);

        srcComponent.connect(connection);
        destComponent.connect(connection);
        
        k.readd(srcComponent);
        k.readd(destComponent);
        return connection;
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