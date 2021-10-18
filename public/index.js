
import { Interface } from '../src/interface/index.js';

// An anonymous function intended to set the namespace for this module
// Have had issues with it so currently it is used as a way to initiate
// the entire module without worrying about standards
(function() {
    // var root = this;
    // var previousCaptainClient = root.CaptainClient;
    
    // var CaptainClient = function() {
    var view = new Interface();
    view.init();
    // };

    // CaptainClient.noConflict = function() {
    //     root.CaptainClient = previousCaptainClient;
    //     return CaptainClient;
    // };
    
    // if( typeof exports !== 'undefined' ) {
    //     if( typeof module !== 'undefined' && module.exports ) {
    //         exports = module.exports = CaptainClient;
    //     }
    //     exports.CaptainClient = CaptainClient;
    // } else {
    //     root.CaptainClient = CaptainClient;
    // }
    
}).call(this);
