var Reward = artifacts.require("LearningReward");
var ContestFactory = artifacts.require("ContestFactory");
var Certificate = artifacts.require("Certificate");

module.exports = async function (deployer) {
  deployer.deploy(Reward)
  .then(function() {
    return deployer.deploy(ContestFactory, Reward.address);
  })
  .then(async function() {
    rewardContractInstance = await Reward.deployed();
    rewardContractInstance.setContract(ContestFactory.address);
    return deployer.deploy(Certificate, "Certificate", "CERT");
  })
  .then(() => {
    console.log("Contracts deployed sucessfully");
  })
};