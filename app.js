const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const routes = require('./routes/locations.js')
var mongoDB =
    'mongodb+srv://rishwi:OPyc2ATrFESOMcAV@cluster0.ytd5e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB')
)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.listen(3000, () => console.log('Server Running'))

app.use('/', routes)
