class Connection{
  /**
   * Connection
   * @param {Component} src 
   * @param {Component} des 
   * @param {Object} options 
   */
  constructor(src, des, options){
    this.src = src
    this.des = des
    this.options = options || {}
    this.load = 0
  }


  processRequests(){}
  blocked(){}
  addRequest(){}
  removeRequest(){}


  equals(other){
    if (!(other instanceof Connection)) {
        return false;
    }
    return other.src.id === this.src.id
            && other.des.id === this.des.id;
  }
}

export { Connection }