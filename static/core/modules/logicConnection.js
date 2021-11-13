

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
        this.latency = options.latency
        this.load = []
    }

    processTimestep(){
        let req;
        let i = this.load.length;
        let reqArray = [];
        while (i--) {
            req = this.load[i];
            if (++req[0] >= this.options.latency) {
                this.load.splice(i, 1);
                this.des.enqueue(req[1]);
                reqArray.push(req[1]);
            }
        }
        return reqArray;
    }
    addRequest(req){
        this.load.push([0, req]);
    }
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

    reset() {
        this.load = [];
    }
}
