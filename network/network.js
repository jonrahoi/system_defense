import { Component, ComponentExample } from "./Component";
import { Connection } from './Connection';

class Network{
  constructor(){
      this.components = {}; 
  
      //   componentID1: componentExample1, 
      //   componentID2: componentExample2,
      //   ...
      // }

      this.connections = [];
 
  }

  hasComponent(component){
    if (other instanceof Component) {
      return this.components.hasOwnProperty(other.id);
    } else {
      console.debug(" input is not Component ")
    }
  }

  hasConnection(connection){
    if (!(connection instanceof Connection)) {
      return false;
    }
    return this.connections.some(e => e.equals(connection));
  }

  clearConnections(){
    this.connections = []
    for (let index in this.components){
      this.components[index].connections = []
    }
  }

  clearComponents(){
    this.connections = []
    for (let index in this.components){
      delete this.components[index]
    }
  }

  /**

   * @param {Component} src 
   * @param {Component} des 
   * @param {Object} options 
   * @returns 
   */
  verifyConnectionType(src, des, options){
    if ( src.id !== des.id ){
      console.debug("INVALID CONNECTION: can't connect to self");
      return false 
    }

    let srcType = src.type
    let desType = des.type

    return someFunc(srcType, desType)
  }

  /**
   * 解连
   * @param {Number} srcId 
   * @param {Number} desId 
   */
  disconnect(srcId, desId){
    let target = -1
   
    for (let index in this.connections){
      if (this.connections[index].src.id === srcId && this.connections[index].des.id === desId){
        target = index
      }
    }
    
    if (target !== -1){
      this.connections.splice(target,1)
      let srcConnections = this.components[srcId].connections
      let desConnections = this.components[desId].connections

      for (let index in srcConnections){
        if (srcConnections[index].src.id === srcId && srcConnections[index].des.id === desId){
          target = index
        }
      }
      srcConnections.splice(target,1)
      
      for (let index in desConnections){
        if (desConnections[index].src.id === srcId && desConnections[index].des.id === desId){
          target = index
        }
      }
      desConnections.splice(target,1)      
    }
  }

  

  /**
   * Component
   * @param {Component} component 
   * @returns newly created or existing component
   */
  networkAddComponent(component){
    if (!(component instanceof Component)) {
      console.debug("INVALID COMPONENT: expected a component object to insert into network");
      return;
    }
    if (!this.hasComponent(component.id)) {
        this.components[component.id] = component;
    }
    return this.components[component.id]; 
  }

  /**

   * @param {Component} src 
   * @param {Component} des 
   * @param {Object} options 
   * @returns 新建立的Connection
   */
  networkAddConnection(src, des, options){
    if (!this.hasComponent(src)) {
      console.debug("INVALID CONNECTION: could not find or create given src");
      return;
    }
    if (!this.hasComponent(des)) {
      console.debug("INVALID CONNECTION: could not find or create given des");
      return;
    }
    if (!this.verifyConnectionType(src, des, options)) {
      return;
    }

    if (!src.hasAvailableOutputs()) {
        console.debug('INVALID CONNECTION: the src has no available outputs');
        return;
    }
    if(!des.hasAvailableInputs()) {
        console.debug('INVALID CONNECTION: the des component has no available inputs');
        return;
    }

    var connection = new Connection(src, des, options);
    if (this.hasConnection(connection)) { return; }

    src.addOutput();
    des.addInput();

    src.addConnection(connection);
    des.addConnection(connection);
    this.connections.push(connection);
    return connection;
  }

  /**
 * Attempts to remove the component representated by provided argument
 * @param {Component} component 
 * @returns 
 */
  networkRemovedComponent(component) {
    if (!this.hasComponent(component)) { 
      console.debug("INVALID REMOVE: attempted to remove component that doesn't exist");
      return false
    }

    let componentId = component.id;

    this.connections.forEach(function(connection) {
        if (!connection) { return false; }
        let srcId = connection.src.id;
        let desId = connection.des.id;
        if (srcId === componentId || desId === componentId) {
            this.disconnect(srcId, desId);
        }
    }.bind(this));

    delete this.components[componentId];
    return true;
  }

  /**
 * Attempts to remove a connection between two nodes
 * @param {Component} src 
 * @param {Component} des 
 * @returns 
 */
  networkDisconnect(src, des) {
    if (!this.hasComponent(src)) {
      console.debug("INVALID CONNECTION: could not find or create given src");
      return;
    }
    if (!this.hasComponent(des)) {
      console.debug("INVALID CONNECTION: could not find or create given des");
      return;
    }

    if (!this.hasConnection(src, des)) {
        console.debug("INVALID DISCONNCT: no existing connection between components");
        return false;
    }

    var filtered = this.connections.filter(function(connection) {
        return connection.des.id !== des.id
                    || connection.src.id !== src.id;
    });
    this.connections = filtered; 

    this.components.forEach(function(component) {
        var filtered = component.connections.filter(function(connection) {
            return connection.des.id !== des.id
                    || connection.src.id !== src.id;
        });
        component.connections = filtered;
    });
    return true;
  }
}

export { Network }