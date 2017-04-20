import TrackerService from '../services/tracker';

export function initialize (app) {

	app.register('service:tracker', TrackerService);

    app.inject('route', 'tracker', 'service:tracker');
    app.inject('component', 'tracker', 'service:tracker');

	app.inject('service:tracker', 'router', 'router:main');

}

export default {
    name: 'tracker',
    initialize: initialize
}
