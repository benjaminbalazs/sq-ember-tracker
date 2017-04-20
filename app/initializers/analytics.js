import AnalyticsService from '../services/analytics';

export function initialize (app) {

	app.register('service:analytics', AnalyticsService);

    app.inject('route', 'analytics', 'service:analytics');
    app.inject('component', 'analytics', 'service:analytics');

}

export default {
    name: 'analytics',
    initialize: initialize
}
