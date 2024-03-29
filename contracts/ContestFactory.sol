// SPDX-License-Identifier: MIT
import "./LearningReward.sol";
import "./Contest.sol";

pragma solidity ^0.8.0;

contract ContestFactory {
    event CreatedContest(address contestAddress);

    mapping(address => address[]) ownedContests;
    LearningReward rewardContract;
    address rewardAddress;
    uint256 totalContest = 0;

    constructor(address rewardContractAddress) {
        rewardContract = LearningReward(rewardContractAddress);
        rewardAddress = rewardContractAddress;
    }

    function createNewContest(bytes[] memory answers) public returns (address) {
        Contest contest = new Contest(answers, rewardAddress);
        address contestAddress = address(contest);
        rewardContract.grantRole(rewardContract.CONTRACT_ROLE(), contestAddress);
        contest.transferOwnership(msg.sender);
        ownedContests[msg.sender].push(contestAddress);
        totalContest++;
        emit CreatedContest(contestAddress);
        return contestAddress;
    }

    function getUserContests(address user) public view returns (address[] memory) {
        return ownedContests[user];
    }

    function getNumberOfContests() public view returns (uint256) {
        return totalContest;
    }
}
