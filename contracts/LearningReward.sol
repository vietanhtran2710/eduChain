// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Tokens.sol";

contract LearningReward is Tokens {
    struct Reward {
        address sponsorAddress;
        uint256 minimumKNGRequired;
        uint256 vnhTokenReward;
    }

    mapping(address => Reward[]) studyProgressReward;

    function createStudyProgressReward(
        address student,
        uint256 vnhReward,
        uint256 requiredKNG
    ) public onlyRole(PARENT_ROLE) {
        safeTransferFrom(_msgSender(), address(this), VND_ID, vnhReward, "");
        studyProgressReward[student].push(
            Reward({
                sponsorAddress: msg.sender,
                minimumKNGRequired: requiredKNG,
                vnhTokenReward: vnhReward
            })
        );
    }

    function earnReward(address student)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        mintSKILL(student, 10, "");
        uint256 studentKNGBalance = ERC1155.balanceOf(student, SKILL_ID);
        uint256 i = 0;
        while (i < studyProgressReward[student].length) {
            if (
                (studentKNGBalance >=
                    studyProgressReward[student][i].minimumKNGRequired)
            ) {
                LearningReward(address(this)).safeTransferFrom(address(this), student, VND_ID, studyProgressReward[student][i].vnhTokenReward, "");

                // noted.
                for (
                    uint256 j = i;
                    j < studyProgressReward[student].length - 1;
                    j++
                ) {
                    studyProgressReward[student][j] = studyProgressReward[
                        student
                    ][j + 1];
                }
                studyProgressReward[student].pop();
            } else {
                i++;
            }
        }
    }

    function getAllRewards(address student)
        public
        view
        returns (Reward[] memory)
    {
        return studyProgressReward[student];
    }
}
