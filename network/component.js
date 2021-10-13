import { Component } from "./Connection"

/**
 * Component
 */
class Component{
  constructor(x=0, y=0, id=0){
    this.x = x;
    this.y = y;


    this.iconWidth = 0;
    this.iconHeight = 0;

    this.id = id || this.generateID();

    this.inputs = 0;
    this.outputs = 0;

    this.numProcessing = 0;
    this.numProcessed = 0;

    this.connections = []
  }


  setX(pos){
    this.x = Math.max(pos,0)
  }
  setY(pos){
    this.y = Math.max(pos,0)
  }
  getX(){
    return this.x
  }
  getY(){
    return this.y
  }
  containsPoint(){}
  intersects(){}


  generateID(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }
  getID(){
    return this.id
  }


  getPrevNeighbors(){
    let nodes = [];
    this.connections.forEach(function(connection) {
        if (connection.src.id !== this.id) {
            nodes.push(connection.src);
        }
    }.bind(this));
    return nodes;
  }


  getNextNeighbors(){
    let nodes = [];
    this.connections.forEach(function(connection) {
        if (connection.des.id !== this.id) {
            nodes.push(connection.des);
        }
    }.bind(this));
    return nodes;
  }

  getInputConnection(){
    var connects = [];
    this.connections.forEach(function(connection) {
        if (connection.target.id !== this.id) {
            connects.push(connection);
        }
    }.bind(this));
    return connects;
  }

  /**
   *
   * @param {Component} target 
   * @returns 
   */
  getOutputConnection(target){
    return this.connections.find(c => {
      return c.target.equals(target);
    });
  }


  equals(other){
    if (!(other instanceof Component)) {
      return false;
    }
    return other.id === this.id;
  }

  // connection
  addConnection(connection){
    if (!(connection instanceof Connection)){
      console.debug("addConnection's input is not Connection")
      return false
    }
    this.connections.push(connection);
    return true
  }

  hasConnection(connection){
    if (!(connection instanceof Connection)){
      console.debug("addConnection's input is not Connection")
      return false
    }
    return this.connections.some(e => e.equals(connection));
  }

}


class ComponentExample extends Component{
  constructor(type, self1 ,self2, x=0, y=0, id=0){

    this.name = "ComponentExample"
    this.maxInputs = 999;
    this.maxOutputs = 999;

    super(x=0, y=0, id=0)
    // Component type
    this.type = type

    this.self1 = self1
    this.self2 = self2
  }

  addInput(num){
    this.inputs += num
    if (!this.hasAvailableInput()){
      this.inputs = this.maxInputs
    }
  }
  addOutput(num){
    this.outputs += num
    if (!this.hasAvailableOutput()){
      this.outputs = this.maxOutputs
    }
  }
  removeInput(num){
    this.inputs -= num
    if (this.inputs < 0){
      this.inputs = 0
    }
  }
  removeOutput(num){
    this.outputs -= num
    if (this.outputs < 0){
      this.outputs = 0
    }
  }

  hasAvailableInput(){
    return this.inputs <= this.maxInputs
  } 
  hasAvailableOutput(){
    return this.outputs <= this.maxOutputs
  }
  someFunction(){}
}

class WebServer extends Component{
  constructor(type, self1 ,self2, x=0, y=0, id=0){

    this.name = "WebServer"
    this.maxInputs = 999;
    this.maxOutputs = 999;

    super(x=0, y=0, id=0)

    this.type = type

    this.self1 = self1
    this.self2 = self2
  }

  addInput(num){
    this.inputs += num
    if (!this.hasAvailableInput()){
      this.inputs = this.maxInputs
    }
  }
  addOutput(num){
    this.outputs += num
    if (!this.hasAvailableOutput()){
      this.outputs = this.maxOutputs
    }
  }
  removeInput(num){
    this.inputs -= num
    if (this.inputs < 0){
      this.inputs = 0
    }
  }
  removeOutput(num){
    this.outputs -= num
    if (this.outputs < 0){
      this.outputs = 0
    }
  }  

  hasAvailableInput(){
    return this.inputs < this.maxInputs
  } 
  hasAvailableOutput(){
    return this.outputs < this.maxOutputs
  }
  someFunction(){}
}

class Database extends Component{
  constructor(type, self1 ,self2, x=0, y=0, id=0){

    this.name = "DataBase"
    this.maxInputs = 999;
    this.maxOutputs = 999;

    super(x=0, y=0, id=0)

    this.type = type

    this.self1 = self1
    this.self2 = self2
  }

  addInput(num){
    this.inputs += num
    if (!this.hasAvailableInput()){
      this.inputs = this.maxInputs
    }
  }
  addOutput(num){
    this.outputs += num
    if (!this.hasAvailableOutput()){
      this.outputs = this.maxOutputs
    }
  }
  removeInput(num){
    this.inputs -= num
    if (this.inputs < 0){
      this.inputs = 0
    }
  }
  removeOutput(num){
    this.outputs -= num
    if (this.outputs < 0){
      this.outputs = 0
    }
  }  

  hasAvailableInput(){
    return this.inputs < this.maxInputs
  } 
  hasAvailableOutput(){
    return this.outputs < this.maxOutputs
  }
  someFunction(){}
}

export { Component, ComponentExample, WebServer, Database }