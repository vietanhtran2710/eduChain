const imageUpload = require('./fileUpload.js')
const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const course = require("../controllers/course.controller.js");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", authJwt.verifyToken, imageUpload.uploadFile().any('file'), course.create);

    // Get user course
    router.get("/teacher/:address", course.getUserCourse);

    // Get course image
    router.get("/download/:id", course.getCourseImage);
  
    app.use('/api/course', router);
  };
  