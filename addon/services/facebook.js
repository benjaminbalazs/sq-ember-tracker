import Ember from 'ember';

export default Ember.Service.extend({

    init() {

        this._super();

        var config = this.container.lookupFactory('config:environment');
        if ( config.FACEBOOK ) {
            if ( config.FACEBOOK.pixel_id ) {
                if ( this.exist() ) {
                    window.fbq('init', config.FACEBOOK.pixel_id);
                }
            }
        }

    },

    exist() {
        return ( window.fbq );
    },

    // PUBLIC API -----------------------------------------------------------------

    pageview() {
        if ( this.exist() ) {
            window.fbq('track', 'PageView');
        }
    },

    event(category, data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', category, data);
        }
    },

    viewContent(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'ViewContent', data);
        }
    },

    // ECOMMERCE

    addToCart(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'AddToCart', data);
        }
    },

    purchase(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'Purchase', data);
        }
    },

    //

    initiateCheckout(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'InitiateCheckout', data);
        }
    },

    addPaymentInfo(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'AddPaymentInfo', data);
        }
    },

    completeRegistration(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'CompleteRegistration', data);
        }
    },

    lead(data) {
        if ( !data ) { data = {}; }
        if ( this.exist() ) {
            window.fbq('track', 'Lead', data);
        }
    },

});
