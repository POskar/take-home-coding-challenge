const express = require('express')
const moment = require('moment')
const router = express.Router()
const SensorData = require('../models/SensorData')

// store sensor data
router.post('/', async (req, res) => {
    try { 
      // check if passed datetime complies with ISO 8601 standard
      datetime = req.body.Datetime
      if (!isIsoDate(datetime)) {
        if (datetime.slice(-1) == "T") {
          datetime = datetime.slice(0, - 1)
        } else {
          return res.status(400).json({message: "Invalid date time format."})
        }
      }
      // create new SensorData document
      const sensorData = new SensorData({
        value: req.body.Value,
        datetime: moment(datetime).toDate(), // convert datetime to Date object
        room: req.body.Room,
        measurement: req.body.Measurement
      })
  
      // save document to MongoDB
      const newData = await sensorData.save()
  
      res.status(201).json(newData)
    } catch (error) {
      console.error(error)
      res.status(500).json({message: error.message})
    }
})
  
// query sensor data
router.get('/', async (req, res) => {
  const { start, end, measurement, room, resolution = 'raw' } = req.query

  let query = {}
  if (start && end) {
    query.datetime = { $gte: new Date(start), $lt: new Date(end) }
  }
  if (measurement) {
    query.measurement = measurement
  }
  if (room) {
    query.room = room
  }

  let data;
  try {
    if (resolution === 'hourly') {
      const hourlyData = await SensorData.aggregate([
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
            avgValue: { $avg: '$value' }
          }
        },
        { $sort: { _id: 1 } }
      ])

      data = hourlyData.map(hour => {
        return {
          value: hour.avgValue,
          datetime: new Date(Date.UTC(hour._id.year, hour._id.month - 1, hour._id.day, hour._id.hour)),
          room: hour._id.room,
          measurement: hour._id.measurement
        }
      })
    } else if (resolution === 'daily') {
      const dailyData = await SensorData.aggregate([
        { $match: query },
        { $group: {
            _id: {
              year: { $year: '$datetime' },
              month: { $month: '$datetime' },
              day: { $dayOfMonth: '$datetime' },
              room: '$room',
              measurement: '$measurement'
            },
            avgValue: { $avg: '$value' }
          }
        },
        { $sort: { _id: 1 } }
      ])
      
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
        { $match: query },
        { $group: {
            _id: {
              year: { $year: '$datetime' },
              week: { $isoWeek: "$datetime" },
              room: '$room',
              measurement: '$measurement'
            },
            avgValue: { $avg: '$value' }
          }
        },
        { $sort: { _id: 1 } }
      ])
    
      data = weeklyData.map(week => {
        return {
          value: week.avgValue,
          datetime: new Date(Date.UTC(week._id.year, 0, (week._id.week - 1) * 7 + 1)),
          room: week._id.room,
          measurement: week._id.measurement
        }
      })
    } else {
      data = await SensorData.find(query)
    }
    
    if (data.length == 0) {
      return res.status(404).json({ message: 'Cannot find any sensor read that matches this criteria.' })
    }
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message})
  }
})

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str); 
  return d instanceof Date && !isNaN(d) && d.toISOString()===str; // valid date 
}

module.exports = router