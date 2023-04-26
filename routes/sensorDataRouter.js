// import required modules
const express = require('express')
const moment = require('moment')
const router = express.Router()
// import SensorData model
const SensorData = require('../models/SensorData')

// route handler function for handling POST requests to add new sensor data
router.post('/', async (req, res) => {
    try { 
      // check if passed datetime complies with ISO 8601 standard
      datetime = req.body.Datetime
      if (!isIsoDate(datetime)) {
        // if not, attempt to fix by removing trailing 'T' character
        if (datetime.slice(-1) == "T") {
          datetime = datetime.slice(0, - 1)
        } else {
          // return an error response if datetime is invalid
          return res.status(400).json({message: "Invalid date time format."})
        }
      }
      // create new SensorData document
      const sensorData = new SensorData({
        value: req.body.Value,
         // convert datetime to Date object
        datetime: moment(datetime).toDate(), // convert datetime to Date object
        room: req.body.Room,
        measurement: req.body.Measurement
      })
  
      // save the document to MongoDB
      const newData = await sensorData.save()

      // return a success response with the new data that was added
      res.status(201).json(newData)
    } catch (error) {
      // if an error occurs, log the error and return an error response.
      console.error(error)
      res.status(500).json({message: error.message})
    }
})
  
// route handler function for handling GET requests to query data with parameters
router.get('/', async (req, res) => {
  // destructure query parameters, set a default value for resolution
  const { start, end, measurement, room, resolution = 'raw' } = req.query

  // create an empty query object
  let query = {}
   // if start and end dates are provided, add a filter to the query to get data within that range
   if (start && end) {
    query.datetime = { $gte: new Date(start), $lt: new Date(end) }
  }
  // same for measurement (and room below)
  if (measurement) {
    query.measurement = measurement
  }
  if (room) {
    query.room = room
  }

  let data;
  try {
    // if resolution is set to hourly, aggregate data by hour
    if (resolution === 'hourly') {
      const hourlyData = await SensorData.aggregate([
        // filter data using the query
        { $match: query },
        { $group: {
            _id: {
              year: { $year: '$datetime' },
              month: { $month: '$datetime' },
              day: { $dayOfMonth: '$datetime' },
              hour: { $hour: '$datetime' },
              room: '$room',
              measurement: '$measurement'
            },
            // calculate the average value for each group
            avgValue: { $avg: '$value' }
          }
        },
        // sort the results by datetime
        { $sort: { _id: 1 } }
      ])

      // map the aggregated data into the desired format
      data = hourlyData.map(hour => {
        return {
          value: hour.avgValue,
          datetime: new Date(Date.UTC(hour._id.year, hour._id.month - 1, hour._id.day, hour._id.hour)),
          room: hour._id.room,
          measurement: hour._id.measurement
        }
      })
    // if resolution is set to daily, aggregate data by day
    } else if (resolution === 'daily') {
      const dailyData = await SensorData.aggregate([
        // filter data using the query
        { $match: query },
        { $group: {
            _id: {
              year: { $year: '$datetime' },
              month: { $month: '$datetime' },
              day: { $dayOfMonth: '$datetime' },
              room: '$room',
              measurement: '$measurement'
            },
            // calculate the average value for each group
            avgValue: { $avg: '$value' }
          }
        },
        // sort the results by datetime
        { $sort: { _id: 1 } }
      ])
      
      // map the aggregated data into the desired format
      data = dailyData.map(day => {
        return {
          value: day.avgValue,
          datetime: new Date(Date.UTC(day._id.year, day._id.month - 1, day._id.day)),
          room: day._id.room,
          measurement: day._id.measurement
        }
      })
    } else if (resolution === 'weekly') {
      const weeklyData = await SensorData.aggregate([
        // filter data using the query
        { $match: query },
        { $group: {
            _id: {
              year: { $year: '$datetime' },
              week: { $isoWeek: "$datetime" },
              room: '$room',
              measurement: '$measurement'
            },
            // calculate the average value for each group
            avgValue: { $avg: '$value' }
          }
        },
        // sort the results by datetime
        { $sort: { _id: 1 } }
      ])
    
      // map the aggregated data into the desired format
      data = weeklyData.map(week => {
        return {
          value: week.avgValue,
          datetime: new Date(Date.UTC(week._id.year, 0, (week._id.week - 1) * 7 + 1)),
          room: week._id.room,
          measurement: week._id.measurement
        }
      })
    } else {
      // retrieve raw data matching the given criteria
      data = await SensorData.find(query)
    }
    
    // if no data is returned, return a 404 error message
    if (data.length == 0) {
      return res.status(404).json({ message: 'Cannot find any sensor read that matches this criteria.' })
    } else {
      // return the retrieved data with a 200 status code
      res.status(200).json(data)
    }
  // catch any errors and return a 500 status code with an error message
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message})
  }
})

// function that checks if a string is in the ISO 8601 date format
function isIsoDate(str) {
  // if regex test fails, return false
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false
  // try to create a date object from the string
  const d = new Date(str)
  // return true if a valid date object was created and it matches the original string
  return d instanceof Date && !isNaN(d) && d.toISOString()===str
}

// exports the router object for use in other parts of the application
module.exports = router