const db = require("../models");
const blockchain = require('../middleware/blockchain')
const Question = db.questions;
const User = db.users;
const Contest = db.contests;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');
const { soliditySha3 } = require("web3-utils");

// Create a new Quiz
exports.create = async (req, res) => {
    try {
        const info = req.body
        let contestInfo = {
            address: info.address,
            title: info.title,
            description: info.description,
            userAddress: req.address,
        }
        let newContest = await Contest.create(contestInfo);
        let questionInfo = [];
        for (let i = 0; i < info.questions.length; i++) {
            questionInfo.push({
                questionText: info.questions[i],
                choices: info.choices[i],
                contestAddress: newContest.address
            })
        }
        Question.bulkCreate(questionInfo)
        .then((data) => {
            res.status(201).send(data);
        })
    }
	catch (err) {
        console.log(err);
        res.status(500).send({error: err});
    }
}

// Get quiz questions
exports.getContestQuestions = (req, res) => {
	const address = req.params.address;

	Contest.findByPk(address, { 
        include: Question
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving questions: " + err
        });
    });
};

// Get contest contestants
exports.getContestants = (req, res) => {
	const address = req.params.address;

	Contest.findByPk(address, { 
        include: {model: User, as: "registration"}
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving contestant: " + err
        });
    });
};

// Get all contests
exports.getAllContests = (req, res) => {
	Contest.findAll({ 
        include: {model: User}
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving contests: " + err
        });
    });
};

// Get one contest
exports.getOne = (req, res) => {
    const address = req.params.address;

	Contest.findByPk(address, { 
        include: {model: User, as: "user"}
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving contest: " + err
        });
    });
};