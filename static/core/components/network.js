/*
 * Template for a graph data structure
 */

export default function Network() {}
/*
 * TODO: Complete me!!
 */
Network.prototype.addComponent = function(component) {
    console.debug(`Storing component ${component.name} in network!`);
    return true;
};

Network.prototype.removeComponent = function(componentID) {
    console.debug(`Removing component ${componentID} from network!`);
    return true;
};

Network.prototype.addConnection = function(src_component, dst_component) {
    console.debug(`Adding connection from ${src_component.name} to ${dst_component.name}in network!`);
    return true;
};

Network.prototype.removeConnection = function(src_componentID, dst_componentID) {
    console.debug(`Removing connection from ${src_componentID} to ${dst_componentID} in network!`);
    return true;
};