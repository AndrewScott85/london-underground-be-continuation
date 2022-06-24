const tubeService = require('../services/tubeService');

const getAllStations = (req, res) => {
    tubeService.getAllStations().then((allStations) => res.json(allStations));
}

const getJourneys = (req, res) => {
    let start = req.body.selectedStartStation;
    let end = req.body.selectedEndStation;
    tubeService.getJourneys(start, end).then((journeys) => res.json(journeys));
}

module.exports.getAllStations = getAllStations;
module.exports.getJourneys = getJourneys;
