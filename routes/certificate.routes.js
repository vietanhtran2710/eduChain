module.exports = app => {
    const cert = require("../controllers/certificate.controller.js");
  
    var router = require("express").Router();

    // Get one certificate
    router.get("/:hash", cert.getOne);

    // Get one certificate
    router.get("/find/:address&:id", cert.findOne);

  
    app.use('/api/certificate', router);
  };
  