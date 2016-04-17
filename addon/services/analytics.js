import Ember from 'ember';

export default Ember.Service.extend({

    user: Ember.inject.service(),

    //

    saveUtmTags(params) {

        if ( this.get('utm_campaign') ) return;

        if ( params.utm_source ) {
            this.set('utm_source', params.utm_source);
        }

        if ( params.utm_medium ) {
            this.set('utm_medium', params.utm_medium);
        }

        if ( params.utm_term ) {
            this.set('utm_term', params.utm_term);
        }

        if ( params.utm_source ) {
            this.set('utm_content', params.utm_content);
        }

        if ( params.utm_source ) {
            this.set('utm_campaign', params.utm_campaign);
        }

    },

    //

	init() {

		this._super();

		var config = Ember.getOwner(this)._lookupFactory('config:environment');
        this.set('environment', config.environment);

        if ( config.GOOGLE_ANALYTICS ) {

            if ( config.GOOGLE_ANALYTICS.debug === true ) {
                this.set('debug', true);
            }

            if ( config.GOOGLE_ANALYTICS.tracking_id ) {

                this.create(config.GOOGLE_ANALYTICS.tracking_id);
                this.get('user').on('init', this, this.didUserLoad);

                if ( config.GOOGLE_ANALYTICS.ecommerce ) {
                    if ( this.exist() ) {
                        window.ga('require', 'ec');
                        window.ga('set', '&cu', 'USD');
                    }
                }

            }

        }

	},

    exist() {
        return ( window.ga );
    },

    debugger(action, data) {
        if ( this.get('debug') ) {
            console.log('analytics:', action, data);
        }
    },

    // AUTO USER ID ------------------------------------------------------------

    didUserLoad() {
        if ( this.exist() ) {
            var id = this.get('user.model.id');
            window.ga('set', '&uid', id);
            this.debugger('set: &uid', id);
        }
    },

    // STANDARD ----------------------------------------------------------------

    trackers: [],

    create(tracking_id, name) {
        if ( this.exist() ) {
            if ( name ) {
                window.ga('create', tracking_id, name);
                this.trackers.push(name);
                this.debugger('create', { tracking_id: tracking_id, option: name});
            } else {
                window.ga('create', tracking_id, 'auto');
                this.debugger('create', { tracking_id: tracking_id, name: 'auto'});
            }
        }
    },

    pageview(data) {
        if ( this.exist() ) {
            window.ga('send', 'pageview', data);
            this.debugger('send:pageview', data);
        }
    },

    event(category, action, label, value) {
        if ( this.exist() ) {
            window.ga('send', 'event', category, action, label, value);
            this.debugger('send:event', { category: category, action: action });
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
