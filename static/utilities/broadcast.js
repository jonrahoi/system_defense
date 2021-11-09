
export function Broadcast() {
    this._bindings = [];
    this._prevParams = null;

    // enforce dispatch to aways work on same context
    var self = this;
    this.dispatch = function(){
        Broadcast.prototype.dispatch.apply(self, arguments);
    };
}

Broadcast.prototype = {

    _addBinding : function (binding) {
        //simplified insertion sort
        var n = this._bindings.length;
        do { --n; } while (this._bindings[n]);
        this._bindings.splice(n + 1, 0, binding);
    },

    _indexOfListener : function (listener, context) {
        var n = this._bindings.length,
            cur;
        while (n--) {
            cur = this._bindings[n];
            if (cur._listener === listener && cur.context === context) {
                return n;
            }
        }
        return -1;
    },

    register : function (listener, listenerContext) {

        var prevIndex = this._indexOfListener(listener, listenerContext),
            binding;

        if (prevIndex !== -1) {
            binding = this._bindings[prevIndex];
        } else {
            binding = new BroadcastBinding(this, listener, listenerContext);
            this._addBinding(binding);
        }

        return binding;
    },

    has : function (listener, context) {
        return this._indexOfListener(listener, context) !== -1;
    },

    remove : function (listener, context) {
        var i = this._indexOfListener(listener, context);
        if (i !== -1) {
            this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
            this._bindings.splice(i, 1);
        }
        return listener;
    },

    removeAll : function () {
        var n = this._bindings.length;
        while (n--) {
            this._bindings[n]._destroy();
        }
        this._bindings.length = 0;
    },

    dispatch : function (params) {
        var paramsArr = Array.prototype.slice.call(arguments),
            n = this._bindings.length,
            bindings;

        if (! n) {
            //should come after memorize
            return;
        }

        bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch

        //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
        //reverse loop since listeners with higher priority will be added at the end of the list
        do { n--; } while (bindings[n] && bindings[n].execute(paramsArr) !== false);
    },

};



export function BroadcastBinding(signal, listener, listenerContext) {
    this._listener = listener;
    this._signal = signal;
    this.context = listenerContext;
}

BroadcastBinding.prototype = {

    params : null,

    execute : function (paramsArr) {
        var params = this.params ? this.params.concat(paramsArr) : paramsArr;
        var handlerReturn = this._listener.apply(this.context, params);
        return handlerReturn;
    },

    getListener : function () {
        return this._listener;
    },

    getSignal : function () {
        return this._signal;
    },

    /**
     * Delete instance properties
     * @private
     */
    _destroy : function () {
        delete this._signal;
        delete this._listener;
        delete this.context;
    }
};

export default Broadcast;