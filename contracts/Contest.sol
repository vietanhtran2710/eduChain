// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LearningReward.sol";

pragma solidity ^0.8.0;

// Reward for the best only.
contract Contest is Ownable {
    LearningReward rewardContract;
    address rewardAddress;

    uint256 public constant SKILL_ID = 0;
    uint256 public constant VND_ID = 1;

    struct Reward {
        uint256[] collectiblesTokenId;
        uint256 vnhToken;
    }

    struct Result {
        uint256 grade;
        uint256 time;
    }
    address[] sponsors;
    mapping(address => Reward) sponsorReward;

    address[] contestants;
    mapping(address => bool) isContestant;
    mapping(address => Result) contestantsResult;

    uint256 totalVnhReward;
    uint256[] totalNftReward;

    bytes[] answers;

    constructor(bytes[] memory _answers, address rewardContractAddress) {
        answers = _answers;
        rewardContract = LearningReward(rewardContractAddress);
        rewardAddress = rewardContractAddress;
    }

    function getStudentResults() public view returns (Result[] memory) {
        Result[] memory grades = new Result[](contestants.length);
        for (uint256 i = 0; i < contestants.length; i++) {
            grades[i] = contestantsResult[contestants[i]];
        }
        return grades;
    }

    function getStudents() public view returns (address[] memory) {
        return contestants;
    }

    function getTopWinner() public view returns (address) {
        address winner;
        uint256 max = 0;
        uint256 time = 0;
        uint256 numberOfContestants = contestants.length;
        for (uint256 i = 0; i < numberOfContestants; i++) {
            if (contestantsResult[contestants[i]].grade > max) {
                max = contestantsResult[contestants[i]].grade;
                winner = contestants[i];
                time = contestantsResult[contestants[i]].time;
            }
            else if (contestantsResult[contestants[i]].grade == max) {
                if (contestantsResult[contestants[i]].time < time) {
                    winner = contestants[i];
                    time = contestantsResult[contestants[i]].time;
                }
            }
        }
        return winner;
    }

    function getSponsors() public view returns (address[] memory) {
        return sponsors;
    }

    function getVNHRewards(address sponsor) public view returns (uint256) {
        return sponsorReward[sponsor].vnhToken;
    }

    function getNFTRewards(address sponsor)
        public
        view
        returns (uint256[] memory)
    {
        return sponsorReward[sponsor].collectiblesTokenId;
    }

    function register(address student) public onlyOwner {
        require(
            rewardContract.isStudent(student),
            "OLPContestFactory: only role student"
        );
        contestants.push(student);
        isContestant[student] = true;
    }

    function registerBatch(address[] memory students) public onlyOwner {
        for (uint256 i = 0; i < students.length; ++i) {
            require(
                rewardContract.isStudent(students[i]),
                "OLPContestFactory: only role student"
            );
        }
        for (uint256 i = 0; i < students.length; ++i) {
            contestants.push(students[i]);
            isContestant[students[i]] = true;
        }
    }

    function gradeSubmission(address student, bytes[] calldata submission, uint time) public returns (uint) {
        require(msg.sender == student && rewardContract.isStudent(student), "Only student can send their own submission");
        uint grade = 0;
        for (uint256 i = 0; i < answers.length; i++) {
            bytes memory a = answers[i]; bytes memory b = submission[i];
            if (keccak256(a) == keccak256(b)) grade++;
        }
        contestantsResult[student].grade = grade;
        contestantsResult[student].time = time;
        return grade;
    }

    function registerReward(
        uint256 _totalVnh,
        uint256[] memory nfts
    ) public {
        require(
            rewardContract.isSponsor(msg.sender),
            "OLPContestFactory: only role sponsor"
        );

        // Send sponsor's registed reward token to contract's balance.
        uint256 len = nfts.length;

        uint256[] memory ids = new uint256[](len + 1);
        uint256[] memory amounts = new uint256[](len + 1);

        for (uint256 i = 0; i < len; ++i) {
            ids[i] = nfts[i];
            amounts[i] = 1;
        }

        ids[len] = VND_ID;
        amounts[len] = _totalVnh;

        rewardContract.safeBatchTransferFrom(
            msg.sender,
            rewardAddress,
            ids,
            amounts,
            ""
        );
        sponsors.push(msg.sender);
        sponsorReward[msg.sender] = Reward({
            vnhToken: _totalVnh,
            collectiblesTokenId: nfts
        });
        totalVnhReward += _totalVnh;
        for (uint256 i = 0; i < nfts.length; ++i) {
            totalNftReward.push(nfts[i]);
        }
    }

    function getTotalVnhReward() public view returns (uint256) {
        return totalVnhReward;
    }

    function getTotalNftReward() public view returns (uint256[] memory) {
        return totalNftReward;
    }

    function endContest() public onlyOwner {
        address winner = getTopWinner();

        // Send reward (from contract's balance) the to winner.
        uint256 len = getTotalNftReward().length;

        uint256[] memory ids = new uint256[](len + 1);
        uint256[] memory amounts = new uint256[](len + 1);

        for (uint256 i = 0; i < len; ++i) {
            ids[i] = getTotalNftReward()[i];
            amounts[i] = 1;
        }

        ids[len] = VND_ID;
        amounts[len] = getTotalVnhReward();
        rewardContract.withdrawBatchFromContract(winner, ids, amounts, "");
    }

    function getAllRewardOf()
        public
        view
        returns (uint256, uint256[] memory)
    {
        return (
            getTotalVnhReward(),
            getTotalNftReward()
        );
    }
}
