const db = require("../models");
const blockchain = require('../middleware/blockchain')
const Quiz = db.quizes;
const Question = db.questions;
const Course = db.courses;
const Submission = db.submissions;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');

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


