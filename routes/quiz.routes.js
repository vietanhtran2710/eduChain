module.exports = app => {
    const quiz = require("../controllers/quiz.controller.js");
  
    var router = require("express").Router();
  
    // Create a new quiz
    router.post("/", quiz.create);
  
    app.use('/api/quiz', router);
  };
  