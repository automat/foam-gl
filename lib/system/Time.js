/**
 * Represents application time.
 * @type {{}}
 */

var Time = {};

Time.__time           = -1;
Time.__timeElapsed    = -1;
Time.__timeStart      = -1;
Time.__timeNext       = -1;
Time.__timeDelta      = -1;
Time.__secondsElapsed = -1;

/**
 * Returns the current time in milliseconds.
 * @returns {number}
 */

Time.getTime = function(){
    return this.__time;
};

/**
 * Returns the time elapsed since application start in milliseconds.
 * @returns {number}
 */

Time.getTimeElapsed = function(){
    return this.__timeElapsed;
};

/**
 * Returns the seconds elapsed since program start.
 * @returns {number}
 */

Time.getSecondsElapsed = function(){
    return this.__secondsElapsed;
};

/**
 * Returns the applications start time in milliseconds.
 * @returns {number}
 */

Time.getTimeStart = function(){
    return this.__timeStart;
};

/**
 * Returns the delta time in milliseconds.
 * @returns {number}
 */

Time.getTimeDelta = function(){
    return this.__timeDelta;
};

module.exports = Time;