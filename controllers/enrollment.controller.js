const db = require("../models");
const blockchain = require('../middleware/blockchain')
const Enrollment = db.enrollments;
const Course = db.courses;
const User = db.users;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');

// Create a new User
exports.enroll = async (req, res) => {
    
}

// Retrieve enrolled courses
exports.getEnrolledCourse = (req, res) => {
	const address = req.params.address;

	// Enrollment.findAll({
    //     where: { userAddress: address },
    //     include: Course
    // })
    // .then(data => {
    //     res.status(200).send(data);
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.status(500).send({
    //         message: "Error retrieving courses: " + err
    //     });
    // });
    User.findByPk(address,{ include: Course })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            message: "Error retrieving courses: " + err
        });
    });
};

// Retrieve unenrolled courses
exports.getUnenrolledCourse = async (req, res) => {
	const address = req.params.address;

	try {
        let enrolledCourse = await Enrollment.findAll({
            where: { userAddress: address}
        });
        const courseIds = enrolledCourse.map(info => info.courseCourseID);
        const filteredCourse = Course.findAll({
        where: {
            courseID: { [Op.notIn]: courseIds }
        }
        })
        .then((result) =>{
            res.status(200).send(result);
        });
    }
    catch (err) { 
        console.log(err);
        res.status(500).send({error: err});
    }
};