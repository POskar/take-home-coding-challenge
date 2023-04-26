const mongoose = require("mongoose")

// define schema for real estate sensor data
const sensorDataSchema = new mongoose.Schema({
    value: {
      type: Number
    },
    datetime: {
      type: Date,
      default: Date.now
    },
    room: {
      type: String
    },
    measurement: {
      type: String
    },
  })

  module.exports = mongoose.model('SensorData', sensorDataSchema)