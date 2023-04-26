// import required modules
const express = require('express')
const mongoose = require('mongoose')

// define the port number
const PORT = 3000

// create an Express application
const app = express()

// add middleware to parse incoming JSON data and URL encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sensordata', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err))

// require the sensor data router and add it as middleware to the app
const sensorDataRouter = require('./routes/sensorDataRouter')
app.use('/data', sensorDataRouter)

// start the server and listen for incoming requests on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))