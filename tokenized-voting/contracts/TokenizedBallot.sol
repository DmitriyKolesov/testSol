// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
/// @title Voting with delegation.

interface IMyToken {
    function getPastVotes(address account, uint256 blockNumber) external view returns (uint256);
}

contract TokenizedBallot {

    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    Proposal[] public proposals;

    IMyToken public tokenContract;

    mapping(address => uint256) public spentVotePower;

    uint256 public targetBlockNumber;

    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {
        targetBlockNumber = _targetBlockNumber;
        tokenContract = IMyToken(_tokenContract);
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal, uint256 amount) external {
        uint256 votingPower = getVotePower(msg.sender);
        require(votingPower >= amount, "Not enough voting power");
        spentVotePower[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function getVotePower(address voter) public view returns (uint256) {
        uint256 votingPower = tokenContract.getPastVotes(voter, targetBlockNumber) - spentVotePower[voter];
        return votingPower;
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
    returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
    returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
