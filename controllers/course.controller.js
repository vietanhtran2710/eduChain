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

// Retrieve all unverified users
exports.getUserCourse = (req, res) => {
	Course.findAll({ 
        where: { userAddress: req.params.address },
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving courses."
        });
    });
};

exports.getCourseImage = async (req, res) => {
    let id = req.params.id;
    console.log(id);
    const course = await Course.findByPk(id);
    if (course !== null) {
        res.download(course.imageURI); // Set disposition and send it.
    }
    else {
        res.status(404).send({ error: 'Course id not found' })
    }
}