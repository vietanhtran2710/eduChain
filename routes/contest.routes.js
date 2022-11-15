const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const contest = require("../controllers/contest.controller.js");
  
    var router = require("express").Router();
  
    // Create a new contest
    router.post("/", authJwt.verifyToken, contest.create);

    // Register students
    router.post("/register", authJwt.verifyToken, contest.register);

    // Get contest questions
    router.get("/question/:address", contest.getContestQuestions);

    // Get contest contestants
    router.get("/contestant/:address", contest.getContestants);

    // Get all contests
    router.get("/contests/", contest.getAllContests);

    // Get one contest
    router.get("/one/:address", contest.getOne);
  
    app.use('/api/contest', router);
  };
  