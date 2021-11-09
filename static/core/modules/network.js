/*
 * Template for a graph data structure
 */

export default function Network() {}
/*
 * TODO: Complete me!!
 */
Network.prototype.addComponent = function(component) {
    console.debug(`Storing component ${component.name} in network!`);
    return {
        valid: true,
        info: `Storing component ${component.name} in network!`
    };
};

Network.prototype.removeComponent = function(componentID) {
    console.debug(`Removing component ${componentID} from network!`);
    return {
        valid: true,
        info: `Removing component ${componentID} from network!`
    };
};

Network.prototype.addConnection = function(srcID, destID) {
    console.debug(`Adding connection from ${srcID} to ${destID} in network!`);
    return {
        valid: true,
        info: `Adding connection from ${srcID} to ${destID} in network!`
    };
};

Network.prototype.removeConnection = function(src_componentID, dst_componentID) {
    console.debug(`Removing connection from ${src_componentID} to ${dst_componentID} in network!`);
    return {
        valid: true,
        info: `Removing connection from ${src_componentID} to ${dst_componentID} in network!`
    };
};