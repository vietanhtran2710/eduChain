module.exports = app => {
    const cert = require("../controllers/certificate.controller.js");
  
    var router = require("express").Router();

    // Get one certificate
    router.get("/:hash", cert.getOne);

    // Get one certificate with user address and course ID
    router.get("/find/:address&:id", cert.findOne);

    // Get all course's certificates
    router.get("/course/:id", cert.findInCourse);

  
    app.use('/api/certificate', router);
  };
  