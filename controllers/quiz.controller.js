const db = require("../models");
const blockchain = require('../middleware/blockchain')
const Quiz = db.quizes;
const Question = db.questions;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');

// Create a new User
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
        questionInfo = [];
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


