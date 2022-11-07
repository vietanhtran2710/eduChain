const Web3 = require('web3')
const key = require('../config/secret-key.json');
const rewardArtifacts = require('../build/contracts/LearningReward.json');
const rewardABI = rewardArtifacts.abi;
const rewardAddress = rewardArtifacts.networks["5777"].address

const blockchainConfig = require('../config/blockchain.config.json');

this.web3 = new Web3(Web3.givenProvider || blockchainConfig.url);

exports.grantStudentRole = async (address) => {
    const that = this;
    this.rewardContract = await new this.web3.eth.Contract(rewardABI, rewardAddress);
    const query = this.rewardContract.methods.addStudent(address);
    const encodedABI = query.encodeABI();
    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        data: encodedABI,
        from: key.address,
        gas: 2000000,
        to: this.rewardContract.options.address,
      },
      key.secret,
      false,
    );
    return new Promise((resolve, reject) => {
      this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .then(result => {
        return resolve(result);
      })
      .catch(err => {
        return reject(err);
      })
    })
}