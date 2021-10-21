/*
 * VERY basic custom Kaboom.js component. Can be attached onto a Kaboom "object"
 * and add features to that object such as giving it a unique ID.
 * 
 * Still unsure if connections need an ID. Instead they could simply be
 * referenced using a source and destination COMPONENT id. The current
 * implementation does not utilize the connection id
 */


import k from '../kaboom.js';
import { generateID } from './viewComponent.js';

/**
 * Custom Kaboom component
 */
export default function ViewConnection() {
    var id = generateID();
    var src = null; // stores reference to Kaboom component
    var dest = null;
    // any other data...

    return {
        init(srcObj, destObj) {
            src = srcObj;
            dest = destObj;
        },
        id() {
            return id;
        },
        src() {
            return src;
        },
        dest() {
            return dest;
        },
        equals(other) { 
            if (Array.isArray(other)) {
                return other[0] === src && other[1] === dest;
            } else if (other instanceof ViewConnection) {
                return other.src() === src && other.dest() === dest; 
            } else {
                return false; // may be a troublesome default. could erase and return undefined
            }
        },
        print() {
            console.log(`Connection - Source: ${src}, Destination: ${dest}`);
        },
        // any other functions...
    };
};