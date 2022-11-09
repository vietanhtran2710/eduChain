const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const quiz = require("../controllers/quiz.controller.js");
  
    var router = require("express").Router();
  
    // Create a new quiz
    router.post("/", quiz.create);

    // Grade a submission
    router.post("/grade", authJwt.verifyToken, quiz.gradeSubmission);

    // Get course quizes
    router.get("/course/:courseID", quiz.getCourseQuizes);

    // Get course quizes
    router.get("/question/:quizID", quiz.getCourseQuestions);
  
    app.use('/api/quiz', router);
  };
  