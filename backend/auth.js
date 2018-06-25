var User = require('./models/User.js')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()

router.post('/register', (req, res) => {
    var userData = req.body

    var user = new User(userData)

    user.save((err, newUser) => {
        if (err)
        return res.status(500).send({ message: 'Error saving user' })

        
            var payload = {sub: newUser._id}

            var token = jwt.encode(payload, '123')
    
            res.status(200).send({ token })
    })
})

router.post('/login', async (req, res) => {
    var loginData = req.body

    var user = await User.findOne({ email: loginData.email })

    if (!user)
        return res.status(401).send({ message: 'Email or Password invalid' })

    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (!isMatch)
            return res.status(401).send({ message: 'Email or Password invalid' })

        var payload = {sub: user._id}

        var token = jwt.encode(payload, '123')

        res.status(200).send({ token })
    })
})

module.exports = router