import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

    analytics: Ember.inject.service(),
    facebook: Ember.inject.service(),
    intercom: Ember.inject.service(),
    twitter: Ember.inject.service(),
    fastboot: Ember.inject.service(),

    // ROUTER LISTENER ---------------------------------------------------------

    init() {

        this._super();

        if ( this.shouldinit() ) {

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

        }

    },

    shouldinit() {
        return ( this.get('fastboot.isFastBoot') !== true );
    },

    // STEPS -------------------------------------------------------------------

    lead() {

        this.get('analytics').event('Lead', 'Click');
        this.get('facebook').lead();

    },

    //

    signup(model) {

        this.get('analytics').event('Registration', 'Complete');

        this.get('facebook').completeRegistration();

    },

    //

    login() {

    },

    // PURCHASE ----------------------------------------------------------------

    initiateCheckout(domain) {

        this.get('analytics').event('Initiate', 'Checkout', domain);

        this.get('facebook').initiateCheckout({
            value: 29,
            currency: 'USD',
            content_name: domain,
        });

        this.get('intercom').event('InitiateCheckout',{
            domain: domain,
        });

    },

    purchase(plan, period, payment_type) {

        var value = plan.get('price_' + period);

        this.get('analytics').purchase({
            name: plan.get('identifier'),
            category: plan.get('category'),
            variant: period,
            revenue: value,
            currency: plan.get('currency_code'),
        });

        this.get('facebook').purchase({
            content_type: plan.get('category'),
            content_name: plan.get('identifier'),
            period: period,
            value: value,
            currency: plan.get('currency_code'),
            payment_type: payment_type
        });

        this.get('intercom').event('Purchase',{
            plan_name: plan.get('identifier'),
            plan_category: plan.get('category'),
            period: period,
            value: value,
            payment_type: payment_type,
            currency: plan.get('currency_code')
        });

    },

    added(plan, period) {

        this.get('analytics').addProduct({
            name: plan.get('identifier'),
            category: plan.get('category'),
            variant: period,
        });

        this.get('facebook').addToCart({
            content_type: plan.get('category'),
            content_name: plan.get('identifier'),
            period: period,
        });

        this.get('intercom').event('AddToCart',{
            plan_name: plan.get('identifier'),
            plan_category: plan.get('category'),
            period: period,
        });

    },

    view(plan) {

        this.get('analytics').addImpression({
            name: plan.get('identifier'),
            category: plan.get('category'),
        });

        this.get('facebook').viewContent({
            content_type: plan.get('category'),
            content_name: plan.get('identifier'),
        });

        this.get('intercom').event('ViewContent',{
            plan_name: plan.get('identifier'),
            plan_category: plan.get('category'),
        });

    },

    paymentInfo() {

        this.get('facebook').addPaymentInfo();

        this.get('intercom').event('AddPaymentInfo');

    },

    // GENERAL -----------------------------------------------------------------

    pageview() {

        if ( this.shouldinit() ) {

            var page = this.getRouteName();
            page = this.getPageUrl(page);

            if ( page !== null ) {

                this.get('analytics').pageview(page,this.getTrackerName(page), this.getPageFields());

                this.trackFacebookPageView({ location: page });
                this.trackTwitterPageView({ location: page });
                this.trackIntercomPageView({ location: page });

            }

        }

    },

    //

    trackFacebookPageView(object) {
        if ( this.shouldinit() ) {
            this.get('facebook').pageview(object);
        }
    },

    trackTwitterPageView(object) {
        if ( this.shouldinit() ) {
            this.get('twitter').pageview(object);
        }
    },

    trackIntercomPageView() {
        if ( this.shouldinit() ) {
            this.get('intercom').pageview();
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
        this.get('facebook').event(category + action, data);

        //
        this.get('intercom').event(category + action, data);

    },


});
