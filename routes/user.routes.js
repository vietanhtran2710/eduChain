const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const user = require("../controllers/user.controller.js");
    const auth = require("../controllers/auth.controller.js")
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", user.create);  

    // follow a new User
    router.post("/follow", authJwt.verifyToken, user.follow);

    // get following users
    router.get("/follow/:address", user.getFollowingUsers);

    // Retrieve user nonce
    router.get("/nonce/:address", user.getNonce)

    // Sign in
    router.post("/login", auth.signIn)

    // Verify and refresh token
    router.get("/token", auth.verify)

    // Get all unverified users
    router.get("/unverified", user.getUnverified)

    // Count users
    router.get("/count", user.count)

    // Verify user
    router.put("/verify/:address", user.verifyUser)
  
    app.use('/api/user', router);
  };
  