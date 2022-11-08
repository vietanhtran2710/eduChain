const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const enrollment = require("../controllers/enrollment.controller.js");
  
    var router = require("express").Router();
  
    // Enroll
    router.post("/", authJwt.verifyToken, enrollment.enroll);

    // Get enrolled course
    router.get("/enrolled/:address", enrollment.getEnrolledCourse);

    // Get unenrolled course
    router.get("/unenrolled/:address", enrollment.getUnenrolledCourse);

    // Check enrollment status
    router.get("/status/:address&:id", enrollment.checkStatus);

    // Get course students
    router.get("/student/:courseID", enrollment.getCourseStudents);
  
    app.use('/api/enrollment', router);
  };
  