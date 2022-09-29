const tubeController = require('../controllers/tubeController');

const routes = (app) => {
    app.get('/', tubeController.connected);
    app.get('/stations', tubeController.getAllStations);
    app.post('/journeys', tubeController.getJourneys);
}

module.exports  = routes;
