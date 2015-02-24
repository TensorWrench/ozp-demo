/**
 * @submodule common
 */

/**
 * @class util
 * @namespace ozpIwc
 * @static
 */
ozpIwc.util=ozpIwc.util || {};

/**
 * Used to get the current epoch time.  Tests overrides this
 * to allow a fast-forward on time-based actions.
 *
 * @method now
 * @returns {Number}
 */
ozpIwc.util.now=function() {
    return new Date().getTime();
};

/**
 * Create a class with the given parent in it's prototype chain.
 *
 * @method extend
 * @param {Function} baseClass The class being derived from.
 * @param {Function} newConstructor The new base class.
 *
 * @returns {Function} New Constructor with an augmented prototype.
 */
ozpIwc.util.extend=function(baseClass,newConstructor) {
    if(!baseClass || !baseClass.prototype) {
        ozpIwc.log.error("Cannot create a new class for ",newConstructor," due to invalid baseclass:",baseClass);
        throw new Error("Cannot create a new class due to invalid baseClass.  Dependency not loaded first?");
    }
    newConstructor.prototype = Object.create(baseClass.prototype);
    newConstructor.prototype.constructor = newConstructor;
    return newConstructor;
};

/**
 * Invoke postMessage on a given window in a safe manner. Test whether the browser
 * supports structured clones, and stringifies the message if not. Catches
 * errors (especially attempts to send non-cloneable objects), and tries to
 * send a stringified copy of the message asa fallback.
 *
 * @param window a window on which to invoke postMessage
 * @param msg the message to be sent
 * @param origin the target origin. The message will be sent only if it matches the origin of window.
 */
ozpIwc.util.safePostMessage = function(window,msg,origin) {
    try {
        var data = msg;
        if (!ozpIwc.util.structuredCloneSupport() && typeof data !== 'string') {
           data=JSON.stringify(msg);
        }
        window.postMessage(data, origin);
    } catch (e) {
        try {
            window.postMessage(JSON.stringify(msg), origin);
        } catch (e) {
            ozpIwc.util.log("Invalid call to window.postMessage: " + e.message);
        }
    }
};

/**
 * Detect browser support for structured clones. Returns quickly since it
 * caches the result. This method only determines browser support for structured
 * clones. Clients are responsible, when accessing capabilities that rely on structured
 * cloning, to ensure that objects to be cloned meet the criteria of the structured clone
 * algorithm. (See ozpIwc.util.safePostMessage for a method which handles attempts to
 * clone an invalid object.). NB: a bug in FF will cause file objects to be treated as
 * non-cloneable, even in FF versions that support structured clones.
 * (see https://bugzilla.mozilla.org/show_bug.cgi?id=722126).
 *
 * @private
 *
 * @method structuredCloneSupport
 *
 * @returns {Boolean} True if structured clones are supported, false otherwise.
 */
ozpIwc.util.structuredCloneSupport=function() {
    ozpIwc.util = ozpIwc.util || {};
    if (ozpIwc.util.structuredCloneSupportCache !== undefined) {
        return ozpIwc.util.structuredCloneSupportCache;
    }
    var cloneSupport = 'postMessage' in window;
    //If the browser doesn't support structured clones, it will call toString() on the object passed to postMessage.
    try {
        window.postMessage({
            toString: function () {
                cloneSupport = false;
            }
        }, "*");
    } catch (e) {
        //exception expected: objects with methods can't be cloned
        //e.DATA_CLONE_ERR will exist only for browsers with structured clone support, which can be used as an additional check if needed
    }
    ozpIwc.util.structuredCloneSupportCache=cloneSupport;
    return ozpIwc.util.structuredCloneSupportCache;
};

ozpIwc.util.structuredCloneSupport.cache=undefined;

/**
 * Does a deep clone of a serializable object.  Note that this will not
 * clone unserializable objects like DOM elements, Date, RegExp, etc.
 *
 * @method clone
 * @param {Array|Object} value The value to be cloned.
 * @returns {Array|Object}  a deep copy of the object
 */
ozpIwc.util.clone=function(value) {
	if(Array.isArray(value) || typeof(value) === 'object') {
        try {
            return JSON.parse(JSON.stringify(value));
        } catch (e) {
            ozpIwc.log.log(e);
        }
	} else {
		return value;
	}
};


/**
 * A regex method to parse query parameters.
 *
 * @method parseQueryParams
 * @param {String} query
 *
 */
ozpIwc.util.parseQueryParams=function(query) {
    query = query || window.location.search;
    var params={};
	var regex=/\??([^&=]+)=?([^&]*)/g;
	var match;
	while((match=regex.exec(query)) !== null) {
		params[match[1]]=decodeURIComponent(match[2]);
	}
    return params;
};

/**
 * Determines the origin of a given url
 * @method determineOrigin
 * @param url
 * @returns {String}
 */
ozpIwc.util.determineOrigin=function(url) {
    var a=document.createElement("a");
    a.href = url;
    var origin=a.protocol + "//" + a.hostname;
    if(a.port) {
        origin+= ":" + a.port;
    }
    return origin;
};

/**
 * Escapes regular expression characters in a string.
 * @method escapeRegex
 * @param {String} str
 * @returns {String}
 */
ozpIwc.util.escapeRegex=function(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * 
 * @method parseOzpUrl
 * @param {type} url
 * @returns {ozpIwc.TransportPacket}
 */
ozpIwc.util.parseOzpUrl=function(url) {
    var m = /^(?:(?:web\+ozp|ozp):\/\/)?([0-9a-zA-Z](?:[-.\w])*)(\/[^?#]*)(\?[^#]*)?(#.*)?$/.exec(decodeURIComponent(url));
    if (m) {
        // an action of "get" is implied
        var packet = {
            'dst': m[1],
            'resource': m[2],
            'action': "get"
        };
        // TODO: parse the query params into fields

        return packet;
    }
    return null;
};

/**
 * Returns true if the specified packet meets the criteria of an IWC Packet.
 * @method isIwcPacket
 * @static
 * @param {ozpIwc.TransportPacket} packet
 * @returns {Boolean}
 */
ozpIwc.util.isIWCPacket=function(packet) {
    if(typeof packet.src !== "string" ||typeof packet.dst !== "string" ||
        typeof packet.ver !== "number" || typeof packet.msgId !== "string") {
        return false;
    } else {
        return true;
    }
};