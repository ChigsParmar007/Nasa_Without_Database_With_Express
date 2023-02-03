const { getAllLaunches, addNewLaunch, existsLaunchWithID, abortLaunchId } = require('../../models/launches_model')

const httpGetAllLaunches = async (req, res) => {
    return res.status(200).json(await getAllLaunches())
}

const httpAddNewLaunch = async (req, res) => {
    const launch = req.body
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Provide a mission, rocket, launch date, and destination'
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }
    await addNewLaunch(launch)
    return res.status(201).json(launch)
}

const httpAbortLaunch = async (req, res) => {
    const launchId = Number(req.params.id)

    const existsLaunch = await existsLaunchWithID(launchId)
    if (!existsLaunch) {
        return res.status(404).json({
            error: "Launch not found"
        })
    }

    const aborted = await abortLaunchId(launchId)
    if (!aborted) {
        return res.status(400).json({
            error: `Launch not aborted ${aborted}`
        })
    }
    return res.status(200).json({
        ok: true
    })
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }