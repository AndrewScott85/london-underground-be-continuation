const tubeService = require('../services/tubeService');

const connected = (req, res) => {
    console.log('Controller: connected');
    return res.status(200).json({
        code : 200,
        message: "OK"
    })
}

const getAllStations = (req, res) => {
    console.log('Controller: getAllStations');
    tubeService.getAllStations().then((allStations) => res.json(allStations));
}

const getJourneys = (req, res) => {
    console.log('Controller: getJourneys');
    let start = req.body.selectedStartStation;
    let end = req.body.selectedEndStation;
    tubeService.getJourneys(start, end).then((journeys) => res.json(journeys));
}

module.exports.connected = connected;
module.exports.getAllStations = getAllStations;
module.exports.getJourneys = getJourneys;
