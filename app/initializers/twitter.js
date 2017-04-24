import TwitterService from '../services/twitter';

export function initialize (app) {

	app.register('service:twitter', TwitterService);

    app.inject('route', 'twitter', 'service:twitter');
    app.inject('component', 'twitter', 'service:twitter');

}

export default {
    name: 'twitter',
    initialize: initialize
}
