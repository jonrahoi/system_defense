/*
 * Custom Kaboom.js component. Can be attached onto a Kaboom "object"
 * and add features to that object such as giving it a unique ID.
 * 
 * Still unsure if connections need an ID. Instead they could simply be
 * referenced using a source and destination COMPONENT id. The current
 * implementation does not utilize the connection id
 */


import k from '../kaboom.js';

import { BoundingRect, BoundRectTypes, BoundRectOrigins } from './boundingRect.js';
import { BoundingConnection } from './boundingConnection.js';
/**
 * Custom Kaboom component
 */
 export const ConnectionDisplayParams = {
    width: 10,
    backgroundColor: [242, 119, 238],
    outlineWidth: 2,
    outlineColor: [200, 200, 200],
    opacity: 0.8
};

var count = 0;

export function InterfaceConnection(componentObjA, componentObjB, height) {
    // stores reference to Kaboom component
    var componentA = componentObjA; 
    var componentB = componentObjB;
    
    var name = `Connection ${count}`;

    // console.log(componentA.pos, componentB.pos);

    // let center = componentA.pos.sub(componentB.pos);
    // let centerX = Math.abs(center.x);
    // let centerY = Math.abs(center.y);
    // let initAngle = componentA.pos.angle(componentB.pos);
    // console.log(centerX, centerY);
    // var myBoundingBox = new BoundingRect(centerX, centerY, ConnectionDisplayParams.width, height, BoundRectTypes.CENTERED, BoundRectOrigins.CENTER);
    var myBoundingConnect = new BoundingConnection(componentObjA, componentObjB);
    // myBoundingBox.rotate(initAngle);


    return {
        componentA() {
            return componentA;
        },
        componentB() {
            return componentB;
        },
        equals(other) { 
            if (Array.isArray(other)) {
                return other[0] === componentA && other[1] === componentB;
            } else if (other instanceof InterfaceConnection) {
                return other.componentA() === componentA && other.componentB() === componentB; 
            } else {
                return false; // may be a troublesome default 
            }
        },
        // update() {
        //     let ang = src.pos.angle(dest.pos);
        //     this.pos = src.pos;
        //     myBoundingBox.rotate(ang);
        //     this.use(k.rotate(ang + 90));
        // },
        moved(pos, component) {
            if (component.hasOwnProperty('uuid')) {
            // if (component.hasOwnProperty('uuid') && component.uuid() === componentA.uuid()) {

                myBoundingConnect.move(component);
                
                // console.log(`Getting angle between ${other.name()} & ${component.name()}`);

                // let ang = other.getBoundingBox().getAngle(pos) * 180 / Math.PI;
                // let height = pos.dist(component.pos);


                this.pos = myBoundingConnect.center;
                this.height = myBoundingConnect.height;
                this.use(k.rotate(myBoundingConnect.angle + 90));
                // this.pos = componentA.pos;
                // this.height = height;
            }
            

            // myBoundingBox.rotate(ang);
            // this.use(k.rotate(ang + 90));

            // console.log(ang, name, component.uuid());
        },
        clicked(pos) {
            myBoundingConnect.clicked(pos);
        },


        print() {
            console.log(`Connection - Source: ${componentA}, Destination: ${componentB}`);
        }
    };
};

export default InterfaceConnection;