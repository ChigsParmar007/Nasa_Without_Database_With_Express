const launchSchema = require('./launches_schema')
const planetsSchema = require('./planets_schema')

let DEFAULT_FLIGHT_NUMBER = 100

const getAllLaunches = async () => {
    return launchSchema.find({}, {
        '_id': 0, '__v': 0
    })
}

const getLatestFlightNumber = async () => {
    const latestLaunch = await launchSchema.findOne({}).sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

const saveLaunch = async (launch) => {
    const planet = await planetsSchema.findOne({
        keplerName: launch.target
    })

    if (!planet) {
        throw new Error(`Planet ${launch.target} not found`)
    }

    await launchSchema.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}


const addNewLaunch = async (launch) => {
    const newFilightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true,
        flightNumber: newFilightNumber
    })
    saveLaunch(newLaunch)
}

const existsLaunchWithID = async (launchId) => {
    return await launchSchema.findOne({
        flightNumber: launchId
    })
}

const abortLaunchId = async (launchId) => {
    const aborted = await launchSchema.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })
    console.log(aborted)
    return aborted.matchedCount === 1 && aborted.modifiedCount === 1
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithID,
    abortLaunchId
}
