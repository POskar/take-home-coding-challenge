// import the Mongoose library for MongoDB
const mongoose = require("mongoose")

// define schema for real estate sensor data
const sensorDataSchema = new mongoose.Schema({
    value: {
      type: Number
    },
    datetime: {
      type: Date,
      // default value for datetime is the current date and time
      default: Date.now
    },
    room: {
      type: String
    },
    measurement: {
      type: String
    },
  })

  // export the Mongoose model for the sensor data schema as a Node.js module
  module.exports = mongoose.model('SensorData', sensorDataSchema)