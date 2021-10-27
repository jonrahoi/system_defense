import LogicComponent from "./logicComponent.js";
import { Connection } from './Connection.js';

class Network{
  constructor(){
      
      this.components = {}; 
      // （component，use for searching componentID）
      // componentsExample = {
      //   componentID1: componentExample1, 
      //   componentID2: componentExample2,
      //   ...
      // }

      this.connections = [];

  }


  hasComponent(other){
    if (other instanceof LogicComponent) {
      return this.components.hasOwnProperty(other.id);
    } else {
      console.debug(" input is not Component ")
    }
  }

  hasConnection(src, des){
    let connection = new Connection(src,des,[])
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
   * 
   * @param {LogicComponent} src 
   * @param {LogicComponent} des 
   * @param {Object} options 
   * @returns 一个布尔值，代表是不是有效  
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

  // /**
  //  *
  //  * @param {Number} srcId 
  //  * @param {Number} desId 
  //  */
  // disconnect(srcId, desId){
  //   let target = -1
  //   // find Connection
  //   for (let index in this.connections){
  //     if (this.connections[index].src.id === srcId && this.connections[index].des.id === desId){
  //       target = index
  //     }
  //   }
  //   if (target !== -1){
  //     this.connections.splice(target,1)

  //     let srcConnections = this.components[srcId].connections
  //     let desConnections = this.components[desId].connections

  //     for (let index in srcConnections){
  //       if (srcConnections[index].src.id === srcId && srcConnections[index].des.id === desId){
  //         target = index
  //       }
  //     }
  //     srcConnections.splice(target,1)
      
  //     for (let index in desConnections){
  //       if (desConnections[index].src.id === srcId && desConnections[index].des.id === desId){
  //         target = index
  //       }
  //     }
  //     desConnections.splice(target,1)      
  //   }
  // }



  /**
   * add Component on field 
   * @param {LogicComponent} component 
   * @returns newly created or existing component
   */
  networkAddComponent(component){
    if (!(component instanceof LogicComponent)) {
      console.debug("INVALID COMPONENT: expected a component object to insert into network");
      return;
    }
    if (!this.hasComponent(component.id)) {
        this.components[component.id] = component;
        // do somthing here for setting xy? position ?
    }
    
    return this.components[component.id]; 
  }

  /**
   * 
   * @param {LogicComponent} src 
   * @param {LogicComponent} des 
   * @param {Object} options 
   * @returns build a new connection 
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

    // if (!this.verifyConnectionType(src, des, options)) {
    //   return;
    // }

    if (!src.hasAvailableOutput()) {
        console.debug('INVALID CONNECTION: the src has no available outputs');
        return;
    }
    if(!des.hasAvailableInput()) {
        console.debug('INVALID CONNECTION: the des component has no available inputs');
        return;
    }

    // checking duplicate or not 
    let connection = new Connection(src, des, options)
    if (this.hasConnection(src, des)) { return; }
    
    // success then give ouput 
    src.addOutput();
    des.addInput();
    
    // for src，des add connection
    src.addConnection(connection);
    des.addConnection(connection);
    this.connections.push(connection);
    return connection;
  }

  /**
 * Attempts to remove the component representated by provided argument
 * @param {LogicComponent} component 
 * @returns remove success or not 
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
            this.networkDisconnect(this.components[srcId], this.components[desId])
        }
    }.bind(this));
    
    // delete connection first then node
    delete this.components[componentId];
    return true;
  }

  /**
 * Attempts to remove a connection between two nodes
 * @param {LogicComponent} src 
 * @param {LogicComponent} des 
 * @returns disconnected or not
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

    // clean connection
    var filtered = this.connections.filter(function(connection) {
        return connection.des.id !== des.id
                    || connection.src.id !== src.id;
    });
    this.connections = filtered; 


    src.connections = src.connections.filter(function(connection) {
            return connection.des.id !== des.id
                    || connection.src.id !== src.id;
    });

    des.connections = des.connections.filter(function(connection) {
          return connection.des.id !== des.id
                  || connection.src.id !== src.id;
    });

    return true;
  }
}

export { Network }