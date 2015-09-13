/**
 * Persistance types for the apiNode.
 * @module bus.service.Value
 * @submodule bus.service.Value.Persistance
 */
/**
 *
 * @namespace ozpIwc.Lifespan
 */
ozpIwc.Lifespan = ozpIwc.Lifespan || {};

/**
 * A object formatter for the node's lifespan. If passed as just a string, format it to the object notation.
 * @method getLifespan
 * @static
 * @param {Object} lifespanObj
 * @param {String} lifespanObj.type
 * @returns {Object|undefined}
 */
ozpIwc.Lifespan.getLifespan = function(lifespanObj){
    if(!lifespanObj){
        return;
    }
    if(typeof lifespanObj === "string"){
        var type = lifespanObj;
        lifespanObj = {
            'type': type
        };
    }
    if(!lifespanObj.type){
        return;
    }

    lifespanObj.type = lifespanObj.type.charAt(0).toUpperCase() + lifespanObj.type.slice(1);

    return lifespanObj;
};


/**
 * Returns the lifespan functionality given the lifespan object given.
 * @method getLifespanFunctionality
 * @static
 * @param {Object} lifespanObj
 * @param {String} lifespanObj.type
 * @returns {{shouldPersist: Function, shouldDelete: Function}|*}
 */
ozpIwc.Lifespan.getLifespanFunctionality = function(lifespanObj){

    switch(lifespanObj.type){
        case "Ephemeral":
            return ozpIwc.Lifespan.ephemeralFunctionality;
        case "Persistent":
            return ozpIwc.Lifespan.persistentFunctionality;
        case "Bound":
            return ozpIwc.Lifespan.boundFunctionality;
        default:
            ozpIwc.Error("Received a malformed Lifespan, resource will be dropped: ", lifespanObj);
            break;
    }
};

/**
 * Functionality for ephemeral lifespans.
 * @method ephemeralFunctionality
 * @static
 * @type {{shouldPersist: Function, shouldDelete: Function}}
 */
ozpIwc.Lifespan.ephemeralFunctionality = {
    shouldPersist: function(){ return false; },
    shouldDelete: function(){ return false; }
};

/**
 * Functionality for persistant lifespans.
 * @method ephemeralFunctionality
 * @static
 * @type {{shouldPersist: Function, shouldDelete: Function}}
 */
ozpIwc.Lifespan.persistentFunctionality = {
    shouldPersist: function(){ return true; },
    shouldDelete: function(){ return false; }
};


/**
 * Functionality for bound lifespans.
 * @method ephemeralFunctionality
 * @static
 * @type {{shouldPersist: Function, shouldDelete: Function}}
 */
ozpIwc.Lifespan.boundFunctionality = {
    shouldPersist: function(){ return false; },
    shouldDelete: function(lifespan,address){
        var len=address.length;
        for(var i in lifespan.addresses) {
            if(lifespan.addresses[i].substr(-len) === address) {
                return true;
            }
        }
        return false;
    }
};

/**
 * Creates a persistent lifespan object
 * @Class Persistent
 * @namespace ozpIwc.Lifespan
 * @constructor
 */
ozpIwc.Lifespan.Persistent = function(){
    this.type = "Persistent";
};

/**
 * Creates an ephemeral lifespan object
 * @Class Ephemeral
 * @namespace ozpIwc.Lifespan
 * @constructor
 */
ozpIwc.Lifespan.Ephemeral = function(){
    this.type = "Ephemeral";
};

/**
 * Creates a bound lifespan object
 * @Class Bound
 * @namespace ozpIwc.Lifespan
 * @property {Object} config
 * @property {String[]} config.addresses
 * @constructor
 *
 */
ozpIwc.Lifespan.Bound = function(config){
    config = config || {};
    this.type = "Bound";
    this.addresses = config.addresses || [];
};
