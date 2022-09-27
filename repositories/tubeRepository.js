const dbService = require('../services/dbService');

let tubes = null;
dbService.connectToDb().then((db) => tubes = db.collection('lines'));

const getAllStations = async () => {
    console.log(`Repository: getAllStations`);
    return await tubes.aggregate([
        {$group: {"_id": {name: "$stations.name", code : "$stations.code"}}}
    ]).toArray();
}

const getJourneys = async (start, end) => {
    console.log(`Repository: getJourneys`);
    return await tubes.find(
                {"stations.name":
                        {$in: [start, end]}
        }).toArray();
}

module.exports.getAllStations = getAllStations;
module.exports.getJourneys = getJourneys;

