'use strict';

module.exports = {

    name: 'sq-ember-tracker',

    included: function(app) {

        this._super.included(app);

        app.import('vendor/analytics.js');
        app.import('vendor/facebook.js');

    },

    isDevelopingAddon: function() {
        return true;
    },

};
