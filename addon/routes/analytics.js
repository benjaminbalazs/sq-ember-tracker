import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({

	analytics : service(),

	beforeModel(transition) {

		this.get('analytics').saveUtmTags(transition.queryParams);

    }

});
