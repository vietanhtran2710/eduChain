const jwt = require("jsonwebtoken")
const authConfig = require('../config/auth.config')
const db = require('../models')
const User = db.users

exports.verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, authConfig.secret)
        let user = await User.findByPk(decoded.address)
        if (user) {
            req.address = decoded.address
        }
        next()
    } catch (err) {
        res.send('Invalid token')
    }
}

exports.verifyAdmin = async (req, res, next) => {
    try {
        let token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, authConfig.secret)
        let user = await User.findByPk(decoded.address)
        if (user && user.role == "ADMIN") {
            req.address = decoded.address
        }
        next()
    } catch (err) {
        res.send('Invalid token')
    }
}