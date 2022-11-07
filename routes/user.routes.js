module.exports = app => {
    const user = require("../controllers/user.controller.js");
    // const auth = require("../controllers/auth.controller.js")
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", user.create);

    // //Sign in
    // router.post("/login", auth.signIn)

    // //Verify and refresh token
    // router.get("/token", auth.verify)
  
    // // // Retrieve all users
    // // router.get("/", user.findAll);

    // // // Retrieve a single user
    // // router.get("/address/:address", user.findOne)

    // // Retrieve user nonce
    // router.get("/nonce/:address", user.getNonce)

    // // // Edit an user with address
    // // router.put("/:address", user.edit)
  
    // // //Delete an user with address
    // // router.delete("/:address", user.delete);
  
    app.use('/api/user', router);
  };
  