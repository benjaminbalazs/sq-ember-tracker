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

    login() {

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

    getTrackerName() {
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
