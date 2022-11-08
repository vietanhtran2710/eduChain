const db = require("../models");
const path = require('path')
const Course = db.courses
const sequelize = db.sequelize
const { Op } = require('sequelize');

exports.create = async (req, res) => {
    try {
        const formData = req.body
        const imageFileLocalPath = path.join(__dirname, `./../files/${req.files[0].filename}`) // directory to save book's file
        const course = {
            name: formData.title,
            week: formData.week,
            description: formData.description,
            fee: formData.fee,
            requiredAverageGrade: formData.grade,
            imageURI: imageFileLocalPath,
            userAddress: req.address,
            reward: formData.reward
        }
        await Course.create(course);
        res.status(201).send({ message: 'Success' })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err })
    }
}