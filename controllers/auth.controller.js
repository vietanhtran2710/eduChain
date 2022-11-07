const db = require("../models");
const User = db.users;
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.config')  
const utils = require('@metamask/eth-sig-util');
const etherjs = require('ethereumjs-util');

exports.signIn = async (req, res) => {
	const { signature, publicAddress } = req.body;
	console.log(signature, publicAddress);
    try {
        let result = await User.findByPk(publicAddress)

        if (result !== null) {
            if (result.verified) {
                const msg = `You are signing your one-time nonce to login: ${result.nonce}`;
                const msgBufferHex = etherjs.bufferToHex(Buffer.from(msg, 'utf8'));
                const address = utils.recoverPersonalSignature({
                    data: msgBufferHex,
                    signature: signature,
                });
                console.log(address);
                if (address.toLowerCase() === result.address.toLowerCase()) {
                    let token = jwt.sign({ address: result.address, role: result.role }, authConfig.secret, {
                        expiresIn: "1d"
                    });

                    await User.update({
                        nonce: Math.floor(Math.random() * 1000000)
                    }, {
                        where: { address: result.address }
                    });

                    res.status(202).send({
                        address: result.address,
                        role: result.role,
                        token
                    })
                } else {
                    res.status(401).send({ message: 'Invalid signature' })
                }
            }
            else {
                res.status(401).send({ message: 'Account not verified' })
            }
        } else {
            res.status(400).send({ message: 'Your public address not found' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err })
    }
}

exports.verify = async (req, res) => {
    try {
        let token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, authConfig.secret)
        let user = await User.findByPk(decoded.address)
        if (user && user.verified) {
            let token = jwt.sign({ address: decoded.address, role: user.role }, authConfig.secret, {
                expiresIn: "1d"
            })
            res.status(202).send({
                address: decoded.address,
                role: user.role,
                token
            })
        }
        else {
            res.status(401).send({error: 'Invalid token'})
        }
    } catch (err) {
        console.log(err);
        res.status(401).send({error: 'Invalid token'})
    }
}