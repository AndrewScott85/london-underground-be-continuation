const tubeRepository = require('../repositories/tubeRepository');

const getTubes = async () => {
    console.log(`Service: getTubes`);
    return await tubeRepository.getTubes();
}

const getAllStations = async () => {
    console.log(`Service: getAllStations`);
    return await tubeRepository.getAllStations()
        .then((stations) => {
            let stationArrays = stations[0].name;
            let codeArrays = stations[0].code;
            let stationList = [];
            let sortedStationList = [];
            let codeList = [];
            let sortedCodeList = [];
            let finalList = [];

            stationArrays.forEach((line) => {
                line.forEach((station) => {
                    if (!stationList.includes(station)) {
                        stationList.push(station);
                    }
                })
            })
            sortedStationList = stationList.sort();

            codeArrays.forEach((line) => {
                line.forEach((station) => {
                    if (!codeList.includes(station)) {
                        codeList.push(station);
                    }
                })
            })
            sortedCodeList = codeList.sort();

            sortedStationList.forEach((station) => {
                station += ` (${sortedCodeList[sortedStationList.indexOf(station)]})`
                finalList.push(station);
            })

            return finalList;

        });

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
            let filteredData = [];
            let finalData = [];

            //split lines into those passing through start station, those passing through end station,
            // and those passing through both
            journeys.forEach((journey => {
                if (journey.stations.some(i => i.name === start)) {
                    startArray.push(journey)
                    startLines.push({"line" : journey.line, "stations" : journey.stations.map(station => station.name)})
                }
                if (journey.stations.some(i => i.name === end)) {
                    endArray.push(journey)
                    endLines.push({"line" : journey.line, "stations" : journey.stations.map(station => station.name)})
                }
                if (journey.stations.some(i => i.name === start) && journey.stations.some(i => i.name === end)) {
                    singleJourneyArray.push(journey);
                    singleJourneyLines.push(journey.line)
                    // console.log(journey.endLine)
                }
            }));
            console.log(startArray.map(i =>i.line) + " Start lines")
            console.log(endArray.map(i =>i.line) + " End lines")   
            console.log(singleJourneyLines)
            // console.log(startArray[0])

            //Find singlechange journey routes and changeover stations (excluding "changes" at start or end stations!)
            startLines.forEach((startLine => {
                if (!singleJourneyLines.includes(startLine.line)) {
                    endLines.forEach((endLine => {
                        let toExclude = [start, end]
                        let startAndEndRemoved = endLine.stations.filter(x => !toExclude.includes(x))
                        let changePoints = startAndEndRemoved.filter(x => startLine.stations.includes(x))
                        if (changePoints.length > 0) {
                            let changeIndexes = changePoints.map(x => [startLine.stations.indexOf(x), endLine.stations.indexOf(x)])
                            let startIndex = startLine.stations.indexOf(start)
                            let endIndex = endLine.stations.indexOf(end)
                            console.log(startIndex)
                            console.log(startLine.stations[startIndex])
                            console.log(endLine.stations[endIndex])
                            console.log(changeIndexes)
                            let changeInfo = {
                                "startLine" : startLine.line, 
                                "startIndex" : startIndex, 
                                "changePoints" : changeIndexes, 
                                "endLine" : endLine.line,
                                "endIndex" : endIndex
                              } 
                            changeData.push(changeInfo) 
                        }}))
                    }

                }))
            console.log("\n changeData")
            console.log(changeData)

            changeData.forEach((option => {
                option.changePoints.forEach((changePoint => {
                    let firstLine = startArray.find(x => x.line === option.startLine).stations
                    let lastLine = endArray.find(x => x.line === option.endLine).stations
                    let firstLeg = getJourneyLeg(option.startIndex, changePoint[0], firstLine)
                //    console.log(firstLeg)
                    
                   let lastLeg = getJourneyLeg(changePoint[1], option.endIndex, lastLine)
                   journeyoption = [firstLeg, lastLeg]
                //    console.log(journeyoption)
                }))
            }))
            })

}

const getJourneyLeg = (first, last, track) => {
    // console.log(track) 
    if (first > last) {
        let leg = track.slice(last, first + 1).reverse();
        // leg.forEach((station) => delete station.timeToNext);
        // leg.forEach((station) => swapTimes(station, "timeToPrev", "timeToNext"))
        console.log(leg);
        return leg
        
        
    }
    else if (first < last) {
        return track.slice(first, last + 1);
    }
    }

    function swapTimes(obj, key1, key2) {
        [obj[key1], obj[key2]] = [obj[key2], obj[key1]];
     }
     


module.exports.getTubes = getTubes;
module.exports.getAllStations = getAllStations;
module.exports.getJourneys = getJourneys;


            // }))

        //     changeData.forEach((journey) => {
        //         if ((!filteredData.some(change => change[0][0] === journey[0][0] && change[0][1] === journey[0][1]))) {
        //             filteredData.push(journey);
        //         }
        //         })
        //     filteredData.forEach((containerArray) => {
        //         finalData.push(containerArray[0]);
        //     })

        //     let changeArrayStart = [];
        //     let changeArrayEnd = [];
        //     finalData.forEach((option) => {
        //         let keyStart = journeys.findIndex(object => {return object.endLine === option[0];})
        //         let keyEnd = journeys.findIndex(object => {return object.endLine === option[1];})
        //         let startLine = journeys[keyStart];
        //         let endLine = journeys[keyEnd];
        //         let startLineName = startLine.endLine;
        //         let endLineName = endLine.endLine;
        //         let startList = startLine.stations;
        //         let endList = endLine.stations;
        //         let cutPointStart = startList.findIndex(obj => {
        //            return obj.name === option[2]
        //        });
        //         let cutPointEnd = endList.findIndex(obj => {
        //             return obj.name === option[2]
        //         });
        //         if (cutPointStart > 0) {
        //             let cutSegmentStart = startList.slice(0, (cutPointStart + 1));
        //             changeArrayStart.push(`TAKE THE ${startLineName} LINE`)
        //             changeArrayStart.push(cutSegmentStart);
        //             changeArrayStart.push(`CHANGE TO ${endLineName} LINE`)

        //             let cutSegmentEnd = endList.slice(cutPointEnd + 1, end);
        //             changeArrayEnd.push(`TAKE THE ${endLineName} LINE`)
        //             changeArrayEnd.push(cutSegmentEnd);
        //             changeArrayEnd.push(`GET OFF THE TRAIN!!!`)
        //         }
        //     })
        //     // console.log(changeArrayStart);
        //     // console.log(changeArrayEnd);
        //     return finalData;
        // });


    // let lines = [];
    // journeys.forEach(endLine => {
    //     let filteredStations = [];
    //     let journeyTime = 0;
    //     if (start > end) {
    //         filteredStations = endLine.stations.filter(filtered => filtered.name <= start && filtered.name >= end);
    //         filteredStations.reverse();
    //         filteredStations[filteredStations.length - 1].timeToPrev = 0;
    //         journeyTime = filteredStations.reduce((sum, current) => sum + current.timeToPrev, 0);
    //         stops = filteredStations.reduce((stations, station) => {
    //             let stopData = {"stop": station.name, "timeToNext": station.timeToPrev}
    //             stations.push(stopData);
    //             return stations;
    //         }, []);
    //
    //     } else {
    //         filteredStations = endLine.stations.filter(filtered => filtered.name >= start && filtered.name <= end);
    //         filteredStations[filteredStations.length - 1].timeToNext = 0;
    //         journeyTime = filteredStations.reduce((sum, current) => sum + current.timeToNext, 0);
    //         stops = filteredStations.reduce((stations, station) => {
    //             let stopData = {"stop": station.name, "timeToNext": station.timeToNext}
    //             stations.push(stopData);
    //             return stations;
    //         }, []);
    //     }
    //
    //     let numStops = filteredStations.length -1;
    //     let lineData = {"endLine": endLine.endLine, "stops": numStops, "time": journeyTime, "stations": stops};
    //     lines.push(lineData);
    // })
    //
    //     return lines;