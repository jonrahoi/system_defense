/*
 * VERY basic custom Kaboom.js component. Can be attached onto a Kaboom "object"
 * and add features to that object such as giving it a unique ID.
 * 
 * When created, a UUID is built which is VERY important. That ID is used to link
 * the interface objects with their logical representations. Communication
 * between the interface and the logic backend will revolve around the synchronization
 * of the component IDs. (ie. viewComponent (id=1234) == logicComponent (id=1234))
 */

import k from '../kaboom.js';

/**
 * Custom Kaboom component
 */
export default function ViewComponent(name, client) {
    var id = generateID();
    var name = name;
    var client = client;
    // any other data...

    return {
        id() {
            return id;
        },
        client() {
            return client; // TODO: why do we even need to return this? it's the same as clientTag in PlayField placeComponent()
        },
        print() {
            console.log(`Component - Name: ${name}, ID: ${id}`);
        },
        // any other functions...
    };
};



// Factory function to generate UUIDs
export const generateID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};