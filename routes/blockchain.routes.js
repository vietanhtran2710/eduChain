const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const adminTransaction = require("../controllers/blockchain.controller.js");
  
    var router = require("express").Router();
  
    // Buy VND
    router.post("/buy", authJwt.verifyToken, adminTransaction.mintVND);

    // Sell VND
    router.post("/sell", authJwt.verifyToken, adminTransaction.burnVND);
  
    app.use('/api/blockchain', router);
};
  