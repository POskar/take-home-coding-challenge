const express = require('express')
const mongoose = require('mongoose')

const PORT = 3000
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sensordata', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err))

const sensorDataRouter = require('./routes/sensorDataRouter')
app.use('/data', sensorDataRouter)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))