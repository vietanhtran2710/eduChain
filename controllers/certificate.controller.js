const db = require("../models");
const Credential = db.credentials;
const Course = db.courses;
const User = db.users
const { QueryTypes, Op } = require('sequelize');

exports.getOne = (req, res) => {
    const hash = req.params.hash;
    Credential.findByPk(hash, {
        include: [{model: Course}, {model: User}]
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            message: err
        })
    })
}

exports.findOne = (req, res) => {
    const address = req.params.address;
    const id = req.params.id;
    Credential.findOne({
        where: {
            userAddress: address,
            courseCourseID: id
        },
        attributes: ["hash"]
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            message: err
        })
    })
}

exports.findInCourse = (req, res) => {
    const id = req.params.id;
    Credential.findAll({
        where: {
            courseCourseID: id
        },
        include: {model: User}
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            message: err
        })
    })
}

exports.revoke = (req, res) => {
    const hash = req.params.hash;
    Credential.update(
        { revoked: true },
        { where: { hash: hash }
    })
    .then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "Certificate was revoke successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot revoke certificate with hash=${hash}. Maybe cert was not found`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Error revoking certificate with hash=${hash}, ${err}`
        });
    });
}