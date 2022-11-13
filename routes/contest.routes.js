const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const contest = require("../controllers/contest.controller.js");
  
    var router = require("express").Router();
  
    // Create a new contest
    router.post("/", authJwt.verifyToken, contest.create);

    // Get contest questions
    router.get("/question/:address", contest.getContestQuestions);

    // Get contest contestants
    router.get("/contestant/:address", contest.getContestants);
  
    app.use('/api/contest', router);
  };
  