/**
 * RequireJS Configuration
 */
requirejs.config({
    baseUrl:'/_static/js/rv',
    paths:{
        'conditioner':'../vendor/rikschennink/conditioner',
        'conditioner/tests':'../vendor/rikschennink/tests'
    }
});

/**
 * Setup base environment options if none defined
 */
if (!window._env){
    var _env = {
        'version':'2014-12-24'
    };
}

/**
 * Setup Additional Configuration options (separate because would disrupt build process otherwise)
 */
(function(){

    'use strict';

    requirejs.config({
        urlArgs:'cache=' + _env.version
    });

}());

/**
 * Start Aniday website
 */
(function(){

    'use strict';

    // kickoff
    define(['rv'],function(rv) {
        rv.init();
    });

}());