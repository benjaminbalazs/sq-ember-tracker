import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

    analytics: Ember.inject.service(),
    facebook: Ember.inject.service(),
    customerio: Ember.inject.service(),
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
        if ( this.get('fastboot.isFastBoot') !== true ) {
            return true;
        } else {
            return false;
        }
    },

    // STEPS -------------------------------------------------------------------

    signup() {

        this.get('analytics').event('Registration', 'Complete');

        this.get('facebook').completeRegistration();

    },

    //

    login() {

    },

    // PURCHASE ----------------------------------------------------------------

    initiateCheckout(site, plan) {

        this.get('analytics').event('Initiate', 'Checkout', plan.get('identifier'));

        this.get('facebook').initiateCheckout({
            value: 12,
            currency: 'USD',
            content_name: plan.get('identifier'),
        });

        this.get('customerio').event('initiate_checkout', {
            site: site,
            plan_identifier: plan.get('identifier'),
            plan_id: plan.get('id')
        });

    },

    purchase(plan, period) {

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
        });

        this.get('customerio').event('purchase',{
            plan_identifier: plan.get('identifier'),
            period: period,
            value: value,
            currency: plan.get('currency_code')
        });

    },

    added(domain, plan, period) {

        this.get('analytics').addProduct({
            name: plan.get('identifier'),
            variant: period,
            domain: domain,
        });

        this.get('facebook').addToCart({
            content_type: plan.get('category'),
            content_name: plan.get('identifier'),
            period: period,
        });

        this.get('customerio').event('add_to_cart',{
            plan_identifier: plan.get('identifier'),
            period: period,
            domain: domain,
        });

    },

    view(domain, plan) {

        this.get('analytics').addImpression({
            name: plan.get('identifier'),
            domain: domain,
        });

        this.get('facebook').viewContent({
            content_type: plan.get('category'),
            content_name: plan.get('identifier'),
        });

        this.get('customerio').event('view_content',{
            plan_name: plan.get('identifier'),
            domain: domain
        });

    },

    // GENERAL -----------------------------------------------------------------

    pageview() {

        if ( this.shouldinit() ) {

            var page = this.getRouteName();
            page = this.getPageUrl(page);

            if ( page !== null ) {

                this.get('analytics').pageview(page,this.getTrackerName(page), this.getPageFields());

                this.trackFacebookPageView({ location: page });
                this.trackCustomerIoPageView({ location: page });

            }

        }

    },

    //

    trackFacebookPageView(object) {
        if ( this.shouldinit() ) {
            this.get('facebook').pageview(object);
        }
    },

    trackCustomerIoPageView(object) {
        if ( this.shouldinit() ) {
            this.get('customerio').pageview(object);
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
        this.get('customerio').event(category.toLowerCase() + '_' + action.toLowerCase(), data);

    },


});
