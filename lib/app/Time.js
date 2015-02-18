/**
 * Represents application time.
 * @type {{}}
 */

var Time = {};

Time.__now     = -1;
Time.__elapsed = -1;
Time.__start   = -1;
Time.__delta   = -1;
Time.__fixedStep      = -1;
Time.__secondsElapsed = -1;

/**
 * Returns the current time in milliseconds.
 * @returns {number}
 */

Time.getNow = function(){
    return this.__now;
};

/**
 * Returns the time elapsed since application start in milliseconds.
 * @returns {number}
 */

Time.getElapsed = function(){
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

Time.getStart = function(){
    return this.__timeStart;
};

/**
 * Returns the delta time in milliseconds.
 * @returns {number}
 */

Time.getDelta = function(){
    return this.__timeDelta;
};

/**
 * Returns the fixed time step.
 * @returns {number}
 */

Time.getFixedStep = function(){
    return this.__fixedStep;
}


module.exports = Time;