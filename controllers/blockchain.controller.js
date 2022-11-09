const db = require("../models");
const blockchain = require('../middleware/blockchain')
const User = db.users;
const Following = db.followings;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');

// User buy VND
exports.mintVND = async (req, res) => {
	const amount = req.body.amount
    const address = req.address
	blockchain.mintVND(address, amount)
    .then(
        (result) => {
            res.status(201).send(result);
        }
    )
    .catch(err => {
        res.status(500).send({error: err});
    })
}

// User sell VND
exports.burnVND = async (req, res) => {
	const amount = req.body.amount
    const address = req.address
	blockchain.burnVND(address, amount)
    .then(
        (result) => {
            res.status(201).send(result);
        }
    )
    .catch(err => {
        res.status(500).send({error: err});
    })
}