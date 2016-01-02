import Ember from 'ember';

export default Ember.Route.extend({

	analytics : Ember.inject.service(),

	beforeModel(transition) {

		this.get('analytics').saveUtmTags(transition.queryParams);

    }

});
