import Ember from 'ember';

export default Ember.Service.extend({

    user: Ember.inject.service(),

    //

	init() {

		this._super();

        this.setupExceptionHandling();

        // AUTO TRACKER SETUP
		var config = this.container.lookupFactory('config:environment');
        if ( config.GOOGLE_ANALYTICS ) {
            if ( config.GOOGLE_ANALYTICS.tracking_id ) {
                this.create(config.GOOGLE_ANALYTICS.tracking_id);
            }
            if ( config.GOOGLE_ANALYTICS.ecommerce ) {
                if ( this.exist() ) {
                    window.ga('require', 'ec');
                    window.ga('set', '&cu', 'USD');
                }
            }
        }

        // LISTEN TO USER TO BE LOADED
        this.get('user').on('init', this, this.didUserLoad);

	},

    exist() {
        return ( window.ga );
    },

    // EXCEPTION HANDLING --------------------------------------------------------

    setupExceptionHandling() {

        var self = this;

        window.addEventListener('error', function(event) {
            self.exception( { message: event.message, details: String(event.error.stack) } );
        });

        Ember.onerror = function(error) {
            self.exception(error);
        };

        Ember.RSVP.on('error', function(error) {
            self.exception(error);
        });

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
