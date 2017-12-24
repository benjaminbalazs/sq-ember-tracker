import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

    fastboot: Ember.inject.service(),

    //

    saveUtmTags(params) {

        if ( params.utm_content ) {
            this.set('utm_content', params.utm_content);
            this.set('user.storage.utm_content', params.utm_content);
        }

        if ( params.utm_medium ) {
            this.set('utm_medium', params.utm_medium);
            this.set('user.storage.utm_medium', params.utm_medium);
        }

        if ( params.utm_term ) {
            this.set('utm_term', params.utm_term);
            this.set('user.storage.utm_term', params.utm_term);
        }

        if ( params.utm_source ) {
            this.set('utm_source', params.utm_source);
            this.set('user.storage.utm_source', params.utm_source);
        }

        if ( params.utm_campaign ) {
            this.set('utm_campaign', params.utm_campaign);
            this.set('user.storage.utm_campaign', params.utm_campaign);
        }

        this.saveTags(params);

    },

    saveTags(params) {

        if ( params.content ) {
            this.set('utm_content', params.content);
            this.set('user.storage.utm_content', params.content);
        }

        if ( params.medium ) {
            this.set('utm_medium', params.medium);
            this.set('user.storage.utm_medium', params.medium);
        }

        if ( params.term ) {
            this.set('utm_term', params.term);
            this.set('user.storage.utm_term', params.term);
        }

        if ( params.source ) {
            this.set('utm_source', params.source);
            this.set('user.storage.utm_source', params.source);
        }

        if ( params.campaign ) {
            this.set('utm_campaign', params.campaign);
            this.set('user.storage.utm_campaign', params.campaign);
        }

    },

    //

	init() {

		this._super();

        var self = this;

        //

        if ( this.get('user.storage.utm_content') ) {
            this.set('utm_content', this.get('user.storage.utm_content'));
        }

        if ( this.get('user.storage.utm_medium') ) {
            this.set('utm_medium', this.get('user.storage.utm_medium'));
        }

        if ( this.get('user.storage.utm_term') ) {
            this.set('utm_term', this.get('user.storage.utm_term'));
        }

        if ( this.get('user.storage.utm_source') ) {
            this.set('utm_source', this.get('user.storage.utm_source'));
        }

        if ( this.get('user.storage.utm_campaign') ) {
            this.set('utm_campaign', this.get('user.storage.utm_campaign'));
        }

	},

    shouldinit() {

        if ( this.get('fastboot.isFastBoot') !== true && config.GOOGLE_ANALYTICS && config.GOOGLE_ANALYTICS.tracking_id ) {
            return true;
        } else {
            return false;
        }

    },

    setup() {

        if ( this.shouldinit() === false ) return;

        this.create(config.GOOGLE_ANALYTICS.tracking_id);

        if ( config.GOOGLE_ANALYTICS.ecommerce ) {
            if ( this.exist() ) {
                window.ga('require', 'ec');
                window.ga('set', '&cu', 'USD');
            }
        }

    },

    exist() {
        if ( window.ga && this.get('fastboot.isFastBoot') !== true && this.get('trackers').length !== 0 ) {
            return true;
        } else {
            return false;
        }
    },

    debugger(action, data) {
        if ( config.GOOGLE_ANALYTICS.debug === true ) {
            console.log('analytics:', action, data);
        }
    },

    // STANDARD ----------------------------------------------------------------

    trackers: [],

    customSet(name, value) {
        if ( this.exist() ) {
            window.ga('set', '&' + name, value);
            this.debugger('set:' + name, value);
        }
    },

    create(tracking_id, name) {
        if ( this.exist() ) {
            if ( name ) {
                window.ga('create', tracking_id, 'auto', name);
                this.trackers.push(name);
                this.debugger('create', { tracking_id: tracking_id, name: name});
            } else {
                window.ga('create', tracking_id, 'auto');
                this.debugger('create', { tracking_id: tracking_id, name: 'auto'});
            }
        }
    },

    pageview(data, tracker, fields) {
        if ( this.exist() ) {
            if ( tracker ) {
                var list = tracker;
                if ( !Ember.isArray(tracker) ) {
                    list = [tracker];
                }
                for (var i = 0; i < list.length; i++) {
                    window.ga(list[i]+'.send', 'pageview', data, fields);
                    this.debugger(list[i]+'.send:pageview', data);
                }
            } else {
                window.ga('send', 'pageview', data, fields);
                this.debugger('send:pageview', data);
            }
        }
    },

    event(category, action, label, value) {
        if ( this.exist() ) {
            window.ga('send', 'event', category, action, label, value);
            this.debugger('send:event', { category: category, action: action, label:label, value:value });
        }
    },

    // ECOMMERCE ---------------------------------------------------------------

    addImpression(data) {
        if ( this.exist() ) {
            window.ga('ec:addImpression', data);
            this.debugger('ec:addImpression', data);
        }
    },

    addProduct(data) {
        if ( this.exist() ) {
            window.ga('ec:addProduct', data);
            this.debugger('ec:addProduct', data);
        }
    },

    purchase(data) {
        if ( this.exist() ) {
            window.ga('ec:setAction', 'purchase', data);
            this.debugger('ec:setAction: purchase', data);
        }
    },

});
