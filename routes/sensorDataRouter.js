const express = require('express')
const moment = require('moment')
const router = express.Router()
const SensorData = require('../models/SensorData')

// store sensor data
router.post('/', async (req, res) => {
    try { 
      // splicing the datatime from the json as there is an error with the last character
      datetime = req.body.Datetime.substring(0, req.body.Datetime.length - 1)
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

module.exports = router