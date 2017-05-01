import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

    fastboot: Ember.inject.service(),

    init() {

        this._super();

        if ( this.shouldinit() ) {

            if ( config.TWITTER ) {

                if ( config.TWITTER.debug === true ) {
                    this.set('debug', true);
                }

                if ( config.TWITTER.tracking_id ) {

                    if ( this.exist() ) {
                        window.twq('init', config.TWITTER.tracking_id);
                    }

                }

            }

        }

    },

    //

    shouldinit() {
        return ( this.get('fastboot.isFastBoot') !== true );
    },

    //

    exist() {
        return ( window.twq );
    },

    debugger(action, data) {
        if ( this.get('debug') ) {
            console.log('twitter:', action, data);
        }
    },

    // PUBLIC API -----------------------------------------------------------------

    pageview() {
        if ( this.exist() ) {
            window.twq('track','PageView');
            this.debugger('PageView');
        }
    },

});
