const db = require("../models");
const blockchain = require('../middleware/blockchain')
const Quiz = db.quizes;
const Question = db.questions;
const Course = db.courses;
const Submission = db.submissions;
const Credential = db.credentials;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');
const { soliditySha3 } = require("web3-utils");

// Create a new Quiz
exports.create = async (req, res) => {
    try {
        const info = req.body
        let quizInfo = {
            title: info.title,
            week: info.week,
            description: info.description,
            answer: info.answer,
            courseCourseID: info.course,
        }
        let newQuiz = await Quiz.create(quizInfo);
        let questionInfo = [];
        for (let i = 0; i < info.questions.length; i++) {
            questionInfo.push({
                questionText: info.questions[i],
                choices: info.choices[i],
                quizQuizID: newQuiz.quizID
            })
        }
        Question.bulkCreate(questionInfo)
        .then((data) => {
            res.status(201).send(data);
        })
    }
	catch (err) {
        res.status(500).send({error: err});
    }
}

exports.gradeSubmission = async (req, res) => {
    const submission = req.body.answer;
    const quizID = req.body.quizID;
    const userAddress = req.address;

    try {
        let quizInfo = await Quiz.findByPk(quizID, { include: [{model: Course}, {model: Question} ]});
        let requiredGrade = quizInfo.dataValues.course.requiredAverageGrade;
        console.log(requiredGrade);
        let correctAnswer = quizInfo.dataValues.answer;
        let question_mark = 10 / correctAnswer.length;
        let grade = 0;
        for (let index = 0; index < correctAnswer.length; index++) {
            if (index < submission.length)
                if (submission[index] == correctAnswer[index]) {
                    grade += question_mark;
                }
        }
        Submission.findOne({ where: {
            userAddress: userAddress,
            quizQuizID: quizID
        }})
        .then((result) => {
            console.log(result);
            if (result) {
                if (result.dataValues.grade < grade) {
                    Submission.update(
                        { grade: grade },
                        { 
                            where: {
                                userAddress: userAddress,
                                quizQuizID: quizID
                            },
                        }
                    )
                    .then(async (updateResult) => {
                        if (result.dataValues.grade < requiredGrade && grade >= requiredGrade) {
                            console.log("Gonna mint");
                            let _transaction = await blockchain.mintSKILL(userAddress)
                        }
                        Submission.findOne({ where: {
                            userAddress: userAddress,
                            quizQuizID: quizID
                        }})
                        .then((result) => {
                            res.status(201).send(result);
                        })
                    })
                }
                else {
                    res.status(200).send({grade: grade});
                }
            }
            else {
                let submit = {
                    grade: grade,
                    userAddress: userAddress,
                    quizQuizID: quizID,
                    courseCourseID: quizInfo.dataValues.course.courseID
                }
                Submission.create(submit)
                .then((result) => {
                    if (grade >= requiredGrade) {
                        blockchain.mintSKILL(userAddress)
                        .then((data) => {
                            console.log("minted");
                            res.status(201).send(result);
                        })
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({error: err});
    }
}

// Retrieve course quiz
exports.getCourseQuizes = (req, res) => {
    Credential.count().then((count) => console.log(count));
	const id = req.params.courseID;

	Quiz.findAll({ where: {courseCourseID: id}})
		.then(data => {
			res.status(200).send(data);
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving quizes: " + err
			});
		});
};

// Get quiz questions
exports.getCourseQuestions = (req, res) => {
	const id = req.params.quizID;

	Quiz.findByPk(id, {
        attributes: ["title", "week", "description", "courseCourseID", "createdAt", "updatedAt"], 
        include: [{ model: Question }, {model: Course}]
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

// Get check course status
exports.checkStatus = (req, res) => {
	const userAddress = req.params.address;
    const courseID = req.params.id;
    Course.findByPk(courseID, {include: Quiz})
    .then((result) => { 
        let requiredGrade = result.dataValues.requiredAverageGrade;
        let quizLength = result.dataValues.quizzes.length;
        Submission.findAll({where: {
            userAddress: userAddress,
            courseCourseID: courseID
        }})
        .then((data) => {
            console.log(requiredGrade, quizLength);
            console.log(data);
            if (data.length < quizLength) {
                res.status(200).send({status: 0});
            }
            else {
                let gradeSum = 0;
                for (let item of data) {
                    console.log(item);
                    gradeSum += item.dataValues.grade;
                }
                gradeSum /= data.length;
                if (gradeSum >= requiredGrade) {
                    Credential.findOne({
                        where: {
                            userAddress: userAddress,
                            courseCourseID: courseID
                        }
                    })
                    .then((findResult) => {
                        if (findResult) {
                            res.status(200).send({status: 2});
                        }
                        else {
                            res.status(200).send({status: 3});
                        }
                    })
                    
                }
                else {
                    res.status(200).send({status: 1});
                }
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })
};

// Claim certificate
exports.claim = (req, res) => {
	const userAddress = req.address;
    const courseID = req.params.id;
    Course.findByPk(courseID, {include: Quiz})
    .then((result) => { 
        let requiredGrade = result.dataValues.requiredAverageGrade;
        let quizLength = result.dataValues.quizzes.length;
        let reward = result.dataValues.reward;
        let teacher = result.dataValues.userAddress;
        Submission.findAll({where: {
            userAddress: userAddress,
            courseCourseID: courseID
        }})
        .then((data) => {
            console.log(requiredGrade, quizLength);
            console.log(data);
            if (data.length < quizLength) {
                res.status(400).send({status: 0});
            }
            else {
                let gradeSum = 0;
                for (let item of data) {
                    console.log(item);
                    gradeSum += item.dataValues.grade;
                }
                gradeSum /= data.length;
                if (gradeSum >= requiredGrade) {
                    Credential.findOne({
                        where: {
                            userAddress: userAddress,
                            courseCourseID: courseID
                        }
                    })
                    .then((findResult) => {
                        if (findResult) {
                            res.status(400).send({status: 1});
                        }
                        else {
                            // Create certificate and reward here
                            Credential.count().then((countResult) => {
                                let newID = countResult + 1;
                                let timestamp = Math.floor(Date.now() / 1000)
                                let hash = soliditySha3(teacher + ";" + userAddress + ";" + newID + ";" + timestamp.toString())
                                certData = [{
                                    issuer: teacher,
                                    recipient: userAddress,
                                    certHash: hash,
                                    CID: newID.toString(),
                                    issuanceTimestamp: timestamp
                                }]
                                blockchain.createCertificate(certData)
                                .then((result) => {
                                    blockchain.mintVND(userAddress, reward)
                                    .then((result) => {
                                        Credential.create({
                                            hash: hash,
                                            issueDate: timestamp.toString(),
                                            grade: gradeSum,
                                            issuer: teacher,
                                            userAddress: userAddress,
                                            courseCourseID: courseID,
                                            revoked: false
                                        })
                                        .then((data) => {
                                            res.status(201).send(data);
                                            return;
                                        })
                                    })
                                })
                            })
                        }
                    })
                }
                else {
                    res.status(400).send({status: 0});
                }
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })
};
