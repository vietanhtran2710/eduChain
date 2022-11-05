var Reward = artifacts.require("LearningReward");
var ContestFactory = artifacts.require("ContestFactory");

module.exports = async function (deployer) {
  deployer.deploy(Reward)
  .then(function() {
    return deployer.deploy(ContestFactory, Reward.address);
  })
  .then(async function() {
    rewardContractInstance = await Reward.deployed();
    rewardContractInstance.setContract(ContestFactory.address);
  })
};