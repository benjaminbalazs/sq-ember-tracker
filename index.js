/* jshint node: true */
'use strict';

module.exports = {

    name: 'sq-ember-tracker',

    included: function(app) {

      this._super.included(app);

      if ( !process.env.EMBER_CLI_FASTBOOT ) {
          app.import('vendor/analytics.js');
          app.import('vendor/facebook.js');
          app.import('vendor/twitter.js');
      }

    },

    isDevelopingAddon: function() {
        return true;
    },

};
