import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

    fastboot: Ember.inject.service(),

    init() {

        this._super();

        if ( this.shouldinit() ) {

            if ( config.FACEBOOK ) {

                if ( config.FACEBOOK.debug === true ) {
                    this.set('debug', true);
                }

                if ( config.FACEBOOK.pixel_id ) {
                    if ( this.exist() ) {
                        window.fbq('init', config.FACEBOOK.pixel_id);
                        this.debugger('init', config.FACEBOOK.pixel_id);
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
        return ( window.fbq );
    },

    debugger(action, data) {
        if ( this.get('debug') ) {
            console.log('facebook:', action, data);
        }
    },

    // PUBLIC API -----------------------------------------------------------------

    pageview(data) {
        if ( this.exist() ) {
            window.fbq('track', 'PageView', data);
            this.debugger('PageView', data);
        }
    },

    event(category, data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('trackCustom', category, data);
            this.debugger(category, data);
        }
    },

    viewContent(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'ViewContent', data);
            this.debugger('ViewContent', data);
        }
    },

    // ECOMMERCE

    addToCart(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'AddToCart', data);
            this.debugger('AddToCart', data);
        }
    },

    purchase(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'Purchase', data);
            this.debugger('Purchase', data);
        }
    },

    //

    initiateCheckout(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'InitiateCheckout', data);
            this.debugger('InitiateCheckout', data);
        }
    },

    addPaymentInfo(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'AddPaymentInfo', data);
            this.debugger('AddPaymentInfo', data);
        }
    },

    completeRegistration() {
        if ( this.exist() ) {
            window.fbq('track', 'CompleteRegistration');
            this.debugger('CompleteRegistration');
        }
    },

    lead(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'Lead', data);
            this.debugger('Lead', data);
        }
    },

});
