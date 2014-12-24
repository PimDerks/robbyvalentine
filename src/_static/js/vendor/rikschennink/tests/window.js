/**
 * Tests if the window dimensions match certain expectations
 * @module tests/window
 */
define(function() {

    'use strict';

    var _width = 0;

    return {

        /**
         * Listen to resize event to measure new window width
         * @param {Function} measure
         */
        setup:function(measure) {
            measure();
            window.addEventListener('resize',measure,false);
        },

        /**
         * Custom measure function to store window width before calling change
         * @returns {Boolean}
         */
        measure:function() {

            _width = window.innerWidth || document.documentElement.clientWidth;

            return true;
        },

        /**
         * test if matches expected value
         * @param {String} expected
         * @returns {Boolean}
         */
        assert:function(expected) {

            var parts = expected.split(':'),
                key = parts[0],
                value = parseInt(parts[1],10);

            if (key === 'min-width') {
                return _width >= value;
            }
            else if (key === 'max-width') {
                return _width <= value;
            }

            return false;

        }
    };

});