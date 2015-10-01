import AnalyticsService from '../services/analytics';

export function initialize (container, app) {

	app.register('service:analytics', AnalyticsService);

    app.inject('route', 'analytics', 'service:analytics');
    app.inject('adapter', 'analytics', 'service:analytics');
    app.inject('component', 'analytics', 'service:analytics');
    app.inject('controller', 'analytics', 'service:analytics');

}

export default {
    name: 'analytics',
    initialize: initialize
}
