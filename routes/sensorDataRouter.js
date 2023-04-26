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

  let data
  try {
    data = await SensorData.find(query)

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