const db = require("../models");
const blockchain = require('../middleware/blockchain')
const Question = db.questions;
const User = db.users;
const Contest = db.contests;
const ContestRegistration = db.contestRegistrations;
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

// Create a new Quiz
exports.register = async (req, res) => {
    const address = req.address;
    const contestAddress = req.body.contestAddress;
    try {
        let contest = await Contest.findByPk(contestAddress, {
            include: {model: User, as: "user"}
        });
        if (contest) {
            if (contest.user.address == address) {
                let students = req.body.students;
                let newContestants = [];
                for (let i = 0; i < students.length; i++) {
                    newContestants.push({
                        userAddress: students[i],
                        contestAddress: contestAddress,
                    })
                }
                ContestRegistration.bulkCreate(newContestants)
                .then((data) => {
                    res.status(201).send(data);
                })
            }
            else {
                console.log("Invalid user address");
                res.status(400).send({msg: "Invalid user address"})
            }
        }   
        else {
            console.log("No contest found");
            res.status(400).send({msg: "No contest found"})
        }
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
        include: [{model: Question}, {model: User, as: "user"}]
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
        include: {model: User, as: "user"}
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

// Get contest contestants
exports.getRegisteredContests = (req, res) => {
	const userAddress = req.params.address;

	User.findByPk(userAddress, { 
        include: [
            {model: Contest, include: {model: User, as: "user"}, as: "contestant"}
        ]
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