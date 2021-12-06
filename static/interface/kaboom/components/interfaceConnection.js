/*
 * Custom Kaboom.js component. Can be attached onto a Kaboom "object"
 * and add features to that object such as giving it a unique ID.
 * 
 * Still unsure if connections need an ID. Instead they could simply be
 * referenced using a source and destination COMPONENT id. The current
 * implementation does not utilize the connection id
 */


import k from '../index.js';

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


export function InterfaceConnection(srcObj, destObj) {
    // stores reference to Kaboom component
    var src = srcObj; 
    var dest = destObj;
    

    return {
        src() {
            return src;
        },
        dest() {
            return dest;
        },
        equals(other) { 
            if (Array.isArray(other)) {
                return other[0] === src && other[1] === dest;
            } else if (other instanceof InterfaceConnection) {
                return other.src() === src && other.dest() === dest; 
            } else {
                return false; // may be a troublesome default 
            }
        },
        print() {
            console.log(`Connection - Source: ${src}, Destination: ${dest}`);
        },
        update() {
            let ang = src.pos.angle(dest.pos) + 90;
            this.height = src.pos.dist(dest.pos);
            this.pos = src.pos;
            this.use(k.rotate(ang));
        }
    };
};

export default InterfaceConnection;