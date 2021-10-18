
/**
 * Shared between both Game Logic and Interface
 * Game Logic builds the object --> Interface reads the data
 */

// STATE IS NOW A "GLOBAL" OBJECT. NOT INCLUDED IN THIS LEVEL OBJECT
export const Level = (levelNumber, levelSpecs, contextFuncs) => {
    var level = {
        number: levelNumber,
        specs: levelSpecs, // only set when object is created

        // Remain constant. Set by line 19, Object.assign(). Provided by `core/index.js` --> GameLogic
        // isClient: contextFuncs.isClient,
        // addComponent: contextFuncs.addComponent, 
        // removeComponent: contextFuncs.removeComponent, 
        // connect: contextFuncs.addConnection, 
        // disconnect: contextFuncs.removeConnection, 
        // processInterval: contextFuncs.processInterval 
    };
    Object.assign(level, contextFuncs);
    return Object.freeze(level); // prevent unauthorized changes
};