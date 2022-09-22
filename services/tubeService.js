const tubeRepository = require('../repositories/tubeRepository');

const getTubes = async () => {
    console.log(`Service: getTubes`);
    return await tubeRepository.getTubes();
}

const getAllStations = async () => {
    console.log(`Service: getAllStations`);
    return await tubeRepository.getAllStations()
        .then((stations) => {
            let stationArray = [];
            let codeArray = [];
            let joinedList = [];

            stations.forEach((station) => {
                    station._id.name.map(item => stationArray.push(item))
                    station._id.code.map(item => codeArray.push(item))
                })

            stationArray.forEach((station) => {
                station += ` (${codeArray[stationArray.indexOf(station)]})`
                if (!joinedList.includes(station)) {
                    joinedList.push(station);
                }
            })

            return joinedList.sort();
        })
    }

const getJourneys = async (start, end) => {
    console.log(`Service: getJourneys`);

    return await tubeRepository.getJourneys(start, end)
        .then((journeys) => {
            let startArray = [];
            let startLines = [];
            let endLines = [];
            let singleJourneyLines = [];
            let endArray = [];
            let singleJourneyArray = [];
            let changeData = [];
            let singleLineData = [];
            let oneChangeData = []
            let finalData = [];

            //split lines into those passing through start station, those passing through end station,
            // and those passing through both
            journeys.forEach((journey => {
                if (journey.stations.some(i => i.name === start) && journey.stations.some(i => i.name === end)) {
                    singleJourneyArray.push(journey);
                    singleJourneyLines.push({"line" : journey.line, "stations" : journey.stations.map(station => station.name)})
                    // console.log(journey.endLine)
                }
                else if (journey.stations.some(i => i.name === start)) {
                    startArray.push(journey)
                    startLines.push({"line" : journey.line, "stations" : journey.stations.map(station => station.name)})
                }
                else if (journey.stations.some(i => i.name === end)) {
                    endArray.push(journey)
                    endLines.push({"line" : journey.line, "stations" : journey.stations.map(station => station.name)})
                }
                
            }));

            singleJourneyLines.forEach((line) => {
              let startIndex = line.stations.indexOf(start);
              let endIndex = line.stations.indexOf(end);
              let lineInfo = singleJourneyArray.find(x => x.line === line.line)
              let startZone = lineInfo.stations[startIndex].zone;
              let endZone = lineInfo.stations[endIndex].zone;
              let trip = getJourneyLeg(startIndex, endIndex, lineInfo.stations);
              let journeyTime = trip.reduce((a,b) => a +b.time, 0);
                    let journeyStops = trip.length -1;
                    let journeyPrice = 399 + getPrice(startZone, endZone);
              let routeData = {
                "line" : line.line,
                "stops" : journeyStops,
                "time" : journeyTime,
                "price" : journeyPrice,
                "stations" : trip
            }
            singleLineData.push(routeData)
            })
            singleLineData.sort((a,b) => a.time - b.time);
            

            //Find singlechange journey routes and changeover stations (excluding "changes" at start or end stations!)
            startLines.forEach((startLine => {
                endLines.forEach((endLine => {
                    if (endLine.line != startLine.line) {
                        let toExclude = [start, end]
                        let startAndEndRemoved = endLine.stations.filter(x => !toExclude.includes(x))
                        let changePoints = startAndEndRemoved.filter(x => startLine.stations.includes(x))
                        if (changePoints.length > 0) {
                            let changeIndexes = changePoints.map(x => [startLine.stations.indexOf(x), endLine.stations.indexOf(x)])
                            let startIndex = startLine.stations.indexOf(start)
                            let endIndex = endLine.stations.indexOf(end)
                            let changeInfo = {
                                "startLine" : startLine.line, 
                                "startIndex" : startIndex, 
                                "changePoints" : changeIndexes, 
                                "endLine" : endLine.line,
                                "endIndex" : endIndex
                            } 
                            changeData.push(changeInfo) 
                    }}}))
                // }

            }))

            // get all required info for possible single-change journeys
            changeData.forEach((option => {
                let firstLine = startArray.find(x => x.line === option.startLine).stations
                let lastLine = endArray.find(x => x.line === option.endLine).stations
                let startZone = firstLine[option.startIndex].zone;
                let endZone = lastLine[option.endIndex].zone
                option.changePoints.forEach((changePoint => {
                    let firstLeg = getJourneyLeg(option.startIndex, changePoint[0], firstLine)
                    firstLeg[firstLeg.length -1].stop += ` - CHANGE TO ${(option.endLine).toUpperCase()} LINE`;
                    firstLeg[firstLeg.length -1].time = 90
                    let lastLeg = getJourneyLeg(changePoint[1], option.endIndex, lastLine);
                    lastLeg[lastLeg.length -1].time = 0;
                    let journeyOption = [...firstLeg, ...lastLeg];
                    let journeyTime = journeyOption.reduce((a,b) => a +b.time, 0);
                    let journeyStops = journeyOption.length -1;
                    let journeyPrice = 399 + getPrice(startZone, endZone);
                    console.log(journeyTime)
                    let routeData = {
                        "lines" : [option.startLine, option.endLine],
                        "stops" : journeyStops,
                        "time" : journeyTime,
                        "price" : journeyPrice,
                        "stations" : journeyOption
                    }
                    oneChangeData.push(routeData)
                }))
            }))
            oneChangeData.sort((a,b) => a.time - b.time);
            return [singleLineData, oneChangeData];
            })

}

const getJourneyLeg = (first, last, track) => {
    // console.log(track) 
    if (first > last) {
        let leg = track.slice(last, first + 1).reverse();
        return leg.map(({name, timeToPrev}) => {
            return {"stop" : name, "time" : timeToPrev}
        });
    }

    else {
        let leg = track.slice(first, last + 1);
        return leg.map(({name, timeToNext}) => {
            return {"stop" : name, "time" : timeToNext}
        });
    }
    }

const getPrice = (startZone, endZone) => {
    if (startZone > endZone) {
        return 70 * (startZone - endZone);
    }
    else {
        return 35 * (endZone - startZone);
    }
}    

module.exports.getAllStations = getAllStations;
module.exports.getJourneys = getJourneys;
