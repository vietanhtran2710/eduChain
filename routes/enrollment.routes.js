const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const enrollment = require("../controllers/enrollment.controller.js");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", authJwt.verifyToken, enrollment.enroll);

    // Get enrolled course
    router.get("/enrolled/:address", enrollment.getEnrolledCourse);

    // Get unenrolled course
    router.get("/unenrolled/:address", enrollment.getUnenrolledCourse);

    // // Get one course
    // router.get("/one/:id", course.getOneCourse);
  
    app.use('/api/enrollment', router);
  };
  