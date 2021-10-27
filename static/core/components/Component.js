import { Connection } from "./Connection.js"

/**
 * Component类 与 对应的继承类
 */
class Component{
  constructor(name, x=0, y=0, id=0){
    this.name = name
    this.x = x;
    this.y = y;

    // 这里不知道后续怎么处理，放在这儿
    this.iconWidth = 0;
    this.iconHeight = 0;

    this.id = id || this.generateID();

    this.inputs = 0;
    this.outputs = 0;

    this.numProcessing = 0;
    this.numProcessed = 0;

    this.connections = []
    this.requestQueue = [];
  }

  // 坐标
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

  // 生成获取自己的ID
  generateID(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }
  getID(){
    return this.id
  }

  // 原来Node里的函数

  // 获取所有以这个节点为终点有连接的节点
  getPrevNeighbors(){
    let nodes = [];
    this.connections.forEach(function(connection) {
        if (connection.src.id !== this.id) {
            nodes.push(connection.src);
        }
    }.bind(this));
    return nodes;
  }

  // 获取所有以这个节点为起点有连接的节点
  getNextNeighbors(){
    let nodes = [];
    this.connections.forEach(function(connection) {
        if (connection.des.id !== this.id) {
            nodes.push(connection.des);
        }
    }.bind(this));
    return nodes;
  }

  // 获取所有流入这个节点的连接
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
   * 获取流出这个节点流向指定节点的连接
   * @param {Component} target 
   * @returns 
   */
  getOutputConnection(target){
    return this.connections.find(c => {
      return c.target.equals(target);
    });
  }

  // 检查自己是不是和另外一个节点是同一个节点
  equals(other){
    if (!(other instanceof Component)) {
      return false;
    }
    return other.id === this.id;
  }

  // 加入与查找connection
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

  // 整合queue相关
  enqueue(request) {
    this.requestQueue.push(request);
    if (this.requestQueue.length < this.requestCapacity) {
        this.numProcessing++;
        return true;
      }
    return false;
  }

  dequeue() {
    if (this.numProcessing > 0) {
        this.numProcessing--;
        this.numProcessed++;
      }
    return this.requestQueue.shift();
  }

  getAvailability() {
    return this.requestCapacity - this.containedRequests;
  }

  isAvailable() {
    return this.numProcessing < this.requestCapacity;
  }

  softReset() {
    this.numProcessed = 0;
    this.numProcessing = 0;
    this.requestQueue = [];
  }

  hardReset(){
    this.softReset();
    this.inputs = 0;
    this.outputs = 0;
};

}

// 每一个出现在UI bar里的item都是一个继承类，每一个继承类都应该被导出
class ComponentExample extends Component{
  constructor(type, self1 ,self2, x=0, y=0, id=0){
    // 每个具体的类的maxInputs与maxOutputs单独初始化
    // this.name = "ComponentExample"
    this.maxInputs = 999;
    this.maxOutputs = 999;
    // 继承component类
    super(x=0, y=0, id=0)
    // 这个Component的type
    this.type = type
    // 自己类里可能会有的一些独有变量
    this.self1 = self1
    this.self2 = self2
  }
  // 数据控制
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
  // 数据校验
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
    // 每个具体的类的maxInputs与maxOutputs单独初始化
    // this.name = "WebServer"
    this.maxInputs = 999;
    this.maxOutputs = 999;
    // 继承component类
    super(x=0, y=0, id=0)
    // 这个Component的type
    this.type = type
    // 自己类里可能会有的一些独有变量
    this.self1 = self1
    this.self2 = self2
  }
  // 数据控制
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
  // 数据校验
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
    // 每个具体的类的maxInputs与maxOutputs单独初始化
    this.name = "DataBase"
    this.maxInputs = 999;
    this.maxOutputs = 999;
    // 继承component类
    super(x=0, y=0, id=0)
    // 这个Component的type
    this.type = type
    // 自己类里可能会有的一些独有变量
    this.self1 = self1
    this.self2 = self2
  }
  // 数据控制
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
  // 数据校验
  hasAvailableInput(){
    return this.inputs < this.maxInputs
  } 
  hasAvailableOutput(){
    return this.outputs < this.maxOutputs
  }
  someFunction(){}
}

export { Component, ComponentExample, WebServer, Database }