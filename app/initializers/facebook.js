import FacebookService from '../services/facebook';

export function initialize (container, app) {

	app.register('service:facebook', FacebookService);

    app.inject('route', 'facebook', 'service:facebook');
    app.inject('adapter', 'facebook', 'service:facebook');
    app.inject('component', 'facebook', 'service:facebook');
    app.inject('controller', 'facebook', 'service:facebook');

}

export default {
    name: 'facebook',
    initialize: initialize
}
