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

        // AUTO TRACKER SETUP
		var config = this.container.lookupFactory('config:environment');
        this.set('environment', config.environment);

        if ( config.GOOGLE_ANALYTICS ) {

            if ( config.GOOGLE_ANALYTICS.tracking_id ) {

                this.setupExceptionHandling();
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

        //
        //var router = this.container.lookupFactory('router:main');
        //router.on('init', this, function() {
        //    console.log('init');
        //});

	},

    exist() {
        return ( window.ga );
    },

    // EXCEPTION HANDLING --------------------------------------------------------

    setupExceptionHandling() {

        if ( this.get('environment') !== 'development' ) {
            /*
            var self = this;

            window.addEventListener('error', function(event) {
                console.error(event);
                self.exception( { message: event.message, details: String(event.error.stack) } );
            });

            Ember.onerror = function(error) {
                console.error(error.stack);
                self.exception(error);
            };

            Ember.RSVP.on('error', function(reason, label) {
                if ( label ) {
                    console.error(label);
                }
                console.assert(false, reason);
                self.exception(reason);
            });
            */
        }

    },

    exception(data) {
        window.ga('send', 'exception', data);
    },

    // AUTO USER ID ------------------------------------------------------------

    didUserLoad() {
        if ( this.exist() ) {
            var id = this.get('user.model.id');
            window.ga('set', '&uid', id);
        }
    },

    // STANDARD ----------------------------------------------------------------

    trackers: [],

    create(tracking_id, name) {
        if ( this.exist() ) {
            if ( name ) {
                window.ga('create', tracking_id, name);
                this.trackers.push(name);
            } else {
                window.ga('create', tracking_id, 'auto');
            }
        }
    },

    pageview() {
        if ( this.exist() ) {
            window.ga('send', 'pageview');
        }
    },

    event(category, action, label, value) {
        if ( this.exist() ) {
            window.ga('send', 'event', category, action, label, value);
        }
    },

    // ECOMMERCE ---------------------------------------------------------------

    addImpression(data) {
        if ( this.exist() ) {
            window.ga('ec:addImpression', data);
        }
    },

    addProduct(data) {
        if ( this.exist() ) {
            window.ga('ec:addProduct', data);
        }
    },

    purchase(data) {
        if ( this.exist() ) {
            window.ga('ec:setAction', 'purchase', data);
        }
    },

    checkout(step, option) {
        if ( this.exist() ) {
            window.ga('ec:setAction','checkout', {
                'step': step,
                'option': option
            });
        }
    }

});
