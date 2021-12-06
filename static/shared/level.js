
/**
 * Shared between both Game Logic and Interface
 * Game Logic builds the object --> Interface reads the data
 */

// STATE IS NOW A "GLOBAL" OBJECT. NOT INCLUDED IN THIS LEVEL OBJECT
export const Level = (levelNumber, levelSpecs, contextFuncs) => {
    var level = {
        number: levelNumber,
        specs: levelSpecs, // only set when object is created

        /**
         * Remain constant. Set by line 19, Object.assign(). Provided by `core/index.js` --> GameLogic
         * THESE FUNCTIONS EXIST. This comment is purely for reference because they
         * are not defined in this file
         * 
         * isClient(componentName)
         * 
         * addComponent(componentName, componentID): core.addComponent
         * 
         * removeComponent(componentID): core.removeComponent
         * 
         * connect(srcID, destID): core.addConnection
         * 
         * disconnect(srcID, destID): core.removeConnection
         * 
         * processInterval(timestamp, speedup): core.processInterval 
         */
    };
    Object.assign(level, contextFuncs);
    return Object.freeze(level); // prevent unauthorized changes
};

export default Level;