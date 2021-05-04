const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const router = express.Router()
const fs = require('fs')
const Location = require('../models/locations.js')
const { send } = require('process')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    },
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
})

const user = {
    id: 1,
    username: 'user',
    password: bcrypt.hashSync('password', 10),
}

router.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            Location.find({}, (err, items) => {
                if (err) {
                    console.log(err)
                    res.send('An error occured', err)
                } else {
                    res.json({
                        length: items.length,
                        data: items.map((item) => {
                            return {
                                name: item.name,
                                city: item.city,
                                country: item.country,
                                id: item._id,
                            }
                        }),
                    })
                }
            })
        }
    })
})

router.get('/:locationId', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            const id = req.params.locationId
            Location.findById(id)
                .then((loc) => {
                    console.log(loc.locationImage)
                    res.json(loc)
                })
                .catch((err) => {
                    console.log(err)
                    res.json({ message: err })
                })
        }
    })
})

router.post('/', verifyToken, upload.single('locationImage'), (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authtoken) => {
        if (err) {
            res.sendStatus(403)
        } else {
            var location = new Location({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                city: req.body.city,
                country: req.body.country,
                locationImage: {
                    data: fs.readFileSync(req.file.path),
                    contentType: 'image/png',
                },
                timeToVisit: req.body.timeToVisit,
            })

            location.save().then((result) => {
                res.json({
                    message: 'Saved Successfully',
                    data: result,
                })
            })
        }
    })
})

router.patch('/:locationId', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            const id = req.params.locationId
            const updateOps = {}
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value
            }
            Location.update({ _id: id }, { $set: updateOps })
                .exec()
                .then((result) => {
                    res.json({
                        message: 'Location updated',
                        data: result,
                    })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        error: err,
                    })
                })
        }
    })
})

router.delete('/:locationId', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            const id = req.params.locationId
            Location.remove({ _id: id })
                .exec()
                .then((result) => {
                    res.status(200).json({
                        message: 'Loacation deleted',
                    })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        error: err,
                    })
                })
        }
    })
})

router.post('/login', (req, res) => {
    if (
        req.body.name == user.username &&
        bcrypt.compareSync(req.body.password, user.password)
    ) {
        jwt.sign({ user }, 'secretkey', { expiresIn: '300s' }, (err, token) => {
            res.json({
                token,
            })
        })
    } else {
        res.send('Wrong Credentials')
    }
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}

module.exports = router
