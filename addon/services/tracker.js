import Ember from 'ember';

export default Ember.Service.extend({

    analytics: Ember.inject.service(),
    facebook: Ember.inject.service(),

    // ROUTER LISTENER ---------------------------------------------------------

    init() {

        var config = this.container.lookupFactory('config:environment');
        this.set('environment', config.environment);

        if ( config.TRACKER ) {
            if ( config.TRACKER.baseURL ) {
                this.set('baseURL', config.TRACKER.baseURL);
            }
        }

        //

        this.router.on('didTransition', this, function() {
            this.pageview();
        });

    },

    // STEPS -------------------------------------------------------------------

    signup() {

        this.get('analytics').event('Sign Up', 'Basic Information');
        this.get('facebook').completeRegistration();

    },

    // PURCHASE ----------------------------------------------------------------

    purchase(plan, period, transaction) {

        this.get('analytics').purchase({
            id: plan.get('id'),
            name: plan.get('identifier'),
            category: plan.get('category'),
            variant: period,
            revenue: transaction.get('value')/100,
        });

        this.get('facebook').purchase({
            content_type: plan.get('category'),
            content_name: plan.get('identifier'),
            period: period,
            value: transaction.get('value')/100,
            order_id: transaction.get('id'),
            currency: 'USD'
        });

    },

    added(plan, period) {

        this.get('analytics').addProduct({
            id: plan.get('id'),
            name: plan.get('identifier'),
            category: plan.get('category'),
            variant: period,
        });

        this.get('facebook').addToCart({
            content_type: plan.get('category'),
            content_name: plan.get('identifier'),
            period: period,
        });

    },

    view(plan) {

        this.get('analytics').addImpression({
            id: plan.get('id'),
            name: plan.get('identifier'),
            category: plan.get('category'),
        });

        this.get('facebook').viewContent({
            content_type: plan.get('category'),
            content_name: plan.get('identifier'),
        });

    },


    // GENERAL -----------------------------------------------------------------

    pageview() {

        var page = this.router.currentRouteName.split('.').join('/');
        if ( this.get('baseURL') ) {
            page = this.get('baseURL') + page;
        } else {
            page =  '/' + page;
        }

        //
        this.get('analytics').pageview(page);

        //
        this.get('facebook').pageview({ location: page });

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
