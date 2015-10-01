import Ember from 'ember';

export default Ember.Service.extend({

    analytics: Ember.inject.service(),
    facebook: Ember.inject.service(),

    // ROUTER LISTENER ---------------------------------------------------------

    init() {

        this.router.on('didTransition', this, function() {
            this.pageview();
        });

    },

    // STEPS -------------------------------------------------------------------

    registration(data) {

        this.get('analytics').event({ category: 'Sign up', action: 'Complete' });
        this.get('facebook').completeRegistration(data);

    },

    //

    checkout() {

        this.get('analytics').checkout(1);
        this.get('facebook').initiateCheckout();

    },

    payment() {

        this.get('analytics').checkout(2);
        this.get('facebook').addPaymentInfo();

    },

    // PURCHASE ----------------------------------------------------------------

    purchase(transaction) {

        var data = {
            'id': transaction.get('id'),
            'revenue': transaction.get('value')
        };

        this.get('analytics').purchase(data);
        this.get('facebook').purchase(data);

    },

    added(plan) {

        var data = {
            'id': plan.get('id'),
            'name': plan.get('identifier'),
            'category': plan.get('market.identifier')
        };

        this.get('analytics').addProduct(data);
        this.get('facebook').addToCart(data);

    },

    // GENERAL -----------------------------------------------------------------

    pageview() {
        this.get('analytics').pageview();
        this.get('facebook').pageview();
    },

    event(category, action, label, value) {

        this.get('analytics').event(category, action, label, value);

        var data = {};
        if ( action ) { data.action = action; }
        if ( label ) { data.label = label; }
        if ( value ) { data.value = value; }
        this.get('facebook').event(category, data);

    },


});
