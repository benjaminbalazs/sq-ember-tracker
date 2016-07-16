import Ember from 'ember';

export default Ember.Service.extend({

    analytics: Ember.inject.service(),
    facebook: Ember.inject.service(),
    intercom: Ember.inject.service(),

    // ROUTER LISTENER ---------------------------------------------------------

    init() {

        var config = Ember.getOwner(this)._lookupFactory('config:environment');
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

        //

        this.get('intercom').event('checkout_purchase',{
            plan_id: plan.get('id'),
            plan_name: plan.get('identifier'),
            plan_category: plan.get('category'),
            period: period,
            transaction_value: transaction.get('value')/100,
            transaction_id: transaction.get('id'),
            transaction_payment_type : transaction.get('payment_type')
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

        //

        this.get('intercom').event('checkout_added',{
            plan_id: plan.get('id'),
            plan_name: plan.get('identifier'),
            plan_category: plan.get('category'),
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

        //

        this.get('intercom').event('checkout_view',{
            plan_id: plan.get('id'),
            plan_name: plan.get('identifier'),
            plan_category: plan.get('category'),
        });

    },

    //

    trackFacebookPageView(object) {
        this.get('facebook').pageview(object);
    },

    // GENERAL -----------------------------------------------------------------

    pageview() {

        var page = this.getRouteName();
        page = this.getPageUrl(page);

        if ( page !== null ) {
            this.get('analytics').pageview(page,this.getTrackerName(page), this.getPageFields());
            this.trackFacebookPageView({ location: page });
        }

    },

    getRouteName() {
        return this.router.currentRouteName.split('.').join('/');
    },

    getTrackerName(page) {
        return null;
    },

    getPageUrl(page) {

        if ( this.get('baseURL') ) {
            return this.get('baseURL') + page;
        } else {
            return '/' + page;
        }

    },

    getPageFields() {
        return null;
    },

    event(category, action, label, value) {

        //
        this.get('analytics').event(category, action, label, value);

        //
        var data = {};
        if ( action ) { data.action = action; }
        if ( label ) { data.label = label; }
        if ( value ) { data.value = value; }
        this.get('facebook').event(category, data);

        //
        this.get('intercom').event(category.toLowerCase() + '_' + action.toLowerCase(), data);

    },


});
