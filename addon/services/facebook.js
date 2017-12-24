import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

    fastboot: Ember.inject.service(),
    hasSetup: false,

    //

    setup() {

        if ( this.shouldinit() === false ) return;

        this.set('hasSetup', true);

        window.fbq('init', config.FACEBOOK.pixel_id);
        this.debugger('init', config.FACEBOOK.pixel_id);

    },

    //

    shouldinit() {
        if ( this.get('fastboot.isFastBoot') !== true && window.fbq ) {
            return true;
        } else {
            return false;
        }
    },

    debugger(action, data) {
        if ( config.FACEBOOK.debug === true ) {
            console.log('facebook:', action, data);
        }
    },

    // PUBLIC API -----------------------------------------------------------------

    pageview(data) {
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'PageView', data);
            this.debugger('PageView', data);
        }
    },

    event(category, data) {
        if ( !data ) { data = {}; }
        if ( this.get('hasSetup') === true ) {
            window.fbq('trackCustom', category, data);
            this.debugger(category, data);
        }
    },

    viewContent(data) {
        if ( !data ) { data = {}; }
        data.content_type = 'product';
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'ViewContent', data);
            this.debugger('ViewContent', data);
        }
    },

    lead() {
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'lead');
            this.debugger('lead');
        }
    },

    // ECOMMERCE

    addToCart(data) {
        if ( !data ) { data = {}; }
        data.content_type = 'product';
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'AddToCart', data);
            this.debugger('AddToCart', data);
        }
    },

    purchase(data) {
        if ( !data ) { data = {}; }
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'Purchase', data);
            this.debugger('Purchase', data);
        }
    },

    //

    initiateCheckout(data) {
        if ( !data ) { data = {}; }
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'InitiateCheckout', data);
            this.debugger('InitiateCheckout', data);
        }
    },

    addPaymentInfo(data) {
        if ( !data ) { data = {}; }
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'AddPaymentInfo', data);
            this.debugger('AddPaymentInfo', data);
        }
    },

    completeRegistration() {
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'CompleteRegistration');
            this.debugger('CompleteRegistration');
        }
    },

    lead(data) {
        if ( !data ) { data = {}; }
        if ( this.get('hasSetup') === true ) {
            window.fbq('track', 'Lead', data);
            this.debugger('Lead', data);
        }
    },

});
