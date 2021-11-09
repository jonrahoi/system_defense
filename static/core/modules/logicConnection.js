

export default class LogicConnection{
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
        this.load = {}
    }


    processRequests(){}
    blocked(){}
    addRequest(){}
    removeRequest(){}


    equals(other){
        if (!(other instanceof LogicConnection)) {
            return false;
        }
        return other.src.id === this.src.id
                && other.des.id === this.des.id;
    }

    equals(srcId, desId) {
        return this.src.id === srcId && this.des.id === desId;
    }
}
