const db = require("../models");
const blockchain = require('../middleware/blockchain')
const User = db.users;
const Following = db.followings;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');

// Create a new User
exports.create = async (req, res) => {
	const userData = req.body
	if (!userData.address || !userData.role || !userData.fullName || !userData.email || !userData.workLocation || !userData.dateOfBirth) {
		res.status(400).send({
			message: "A required field is missing!"
		});
		return;
	}

    let user = await User.findByPk(userData.address);
    if (user !== null) {
        res.status(400).send({
            message: "User address already exist"
        });
        return;
    }

    try {
        const user = {
            address: userData.address,
            role: userData.role,
            fullName: userData.fullName,
            email: userData.email,
            workLocation: userData.workLocation,
            dateOfBirth: userData.dateOfBirth,
            verified: true
        }
        console.log(user);
        if (user.role == "TEACHER" || user.role == "SPONSOR") {
            user.verified = false;
            await User.create(user);
            res.status(201).send({ message: 'Signup successfully' });
            return;
        }
        else {
            if (user.role == "STUDENT") {
                blockchain.grantStudentRole(user.address)
                .then(async (result) => {
                    await User.create(user);
                    res.status(201).send({ message: 'Signup successfully' })
                    return;
                })
                .catch(err => {

                })
            }
            else {
                blockchain.grantParentRole(user.address)
                .then(async (result) => {
                    await User.create(user);
                    res.status(201).send({ message: 'Signup successfully' })
                    return;
                })
                .catch(err => {

                })
            }
        }
        await User.create(user);
        res.status(201).send({ message: 'Signup successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: "Some error occurred while creating the account." + err
        });
    }
}

exports.follow = async (req, res) => {
    const follower = req.address;
    const followed = req.body.address;

    try {
        Following.findOne({
            where: {
                followingAddress: follower,
                followedAddress: followed
            }
        })
        .then(result => {
            if (!result) {
                Following.create(
                    {
                        followingAddress: follower,
                        followedAddress: followed
                    }
                )
                .then((result) => {
                    res.status(201).send(result);
                })
            }
        })
    } catch (err) {
        res.status(500).send({error: err});
    }
}

exports.getFollowingUsers = async (req, res) => {
    const address = req.params.address;

    User.findByPk(address,
        {include: { model: User, as: "following" }
    }).then((result) => {
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({error: err});
    })
}

// Retrieve single user with address
exports.getNonce = (req, res) => {
	const address = req.params.address;

	User.findByPk(address, {attributes: ['nonce']})
		.then(data => {
			res.status(200).send(data);
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving account with address=" + address + ", " + err
			});
		});
};

// Retrieve all unverified users
exports.getUnverified = (req, res) => {
	User.findAll({ 
        where: { verified: false },
        attributes: ['address', 'fullName', 'email', 'workLocation', 'dateOfBirth', 'role']
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving accounts."
        });
    });
};

exports.count = (req, res) => {
    User.count()
    .then(data => {
        res.status(200).send({count: data});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            message: err
        })
    })
}

exports.verifyUser = (req, res) => {
    const address = req.params.address;
	User.update({
        verified: true
    }, {
		where: { address }
	})
    .then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "Account was verified successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot verify account with address=${address}. Maybe account was not found`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Error verifing account with address=${address}, ${err}`
        });
    });
}

// // Retrieve all users
// exports.findAll = (req, res) => {
// 	condition = req.query
// 	User.findAll({ where: condition })
// 		.then(data => {
// 			res.send(data);
// 		})
// 		.catch(err => {
// 			res.status(500).send({
// 				message: err.message || "Some error occurred while retrieving accounts."
// 			});
// 		});
// };

// // Retrieve single user with address
// exports.findOne = (req, res) => {
// 	const address = req.params.address;

// 	User.findByPk(address)
// 		.then(data => {
// 			res.send(data);
// 		})
// 		.catch(err => {
// 			res.status(500).send({
// 				message: "Error retrieving account with address=" + address + ", " + err
// 			});
// 		});
// };

// // Retrieve users with a certain role
// exports.findUnverified = (req, res) => {

// 	User.findAll({ where: { verified: false } })
// 		.then(data => {
// 			res.send(data);
// 		})
// 		.catch(err => {
// 			res.status(500).send({
// 				message: err.message || "Some error occurred while retrieving accounts."
// 			});
// 		});
// };

// // Retrieve users with a certain role
// exports.findByRole = (req, res) => {
// 	const role = req.params.role;

// 	User.findAll({ where: { role: role } })
// 		.then(data => {
// 			res.send(data);
// 		})
// 		.catch(err => {
// 			res.status(500).send({
// 				message: err.message || "Some error occurred while retrieving accounts."
// 			});
// 		});
// };

// //Edit an user with address
// exports.edit = (req, res) => {
// 	const address = req.params.address;

// 	User.update(req.body, {
// 		where: { address }
// 	})
// 		.then(num => {
// 			if (num == 1) {
// 				res.send({
// 					message: "Account was updated successfully."
// 				});
// 			} else {
// 				res.send({
// 					message: `Cannot update account with address=${address}. Maybe account was not found or req.body is empty!`
// 				});
// 			}
// 		})
// 		.catch(err => {
// 			res.status(500).send({
// 				message: `Error updating account with address=${address}, ${err}`
// 			});
// 		});
// };

// //Delete an user with address
// exports.delete = (req, res) => {
// 	const address = req.params.address;

// 	User.destroy({
// 		where: { address: address }
// 	})
// 		.then(num => {
// 			if (num == 1) {
// 				res.send({
// 					message: "Account was deleted successfully!"
// 				});
// 			} else {
// 				res.send({
// 					message: `Cannot delete account with address=${address}. Maybe account was not found!`
// 				});
// 			}
// 		})
// 		.catch(err => {
// 			res.status(500).send({
// 				message: `Could not delete account with address=${address}. ${err}`
// 			});
// 		});
// };





