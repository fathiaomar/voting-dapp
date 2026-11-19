// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Storage state
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint256 public candidatesCount;

    // Events
    event CandidateAdded(uint256 indexed candidateId, string name);
    event Voted(address indexed voter, uint256 indexed candidateId);

    constructor() {
        // Initialize with default proposal options
        addCandidate("Proposal 1: Allocate Treasury Grant");
        addCandidate("Proposal 2: Upgrade Smart Contract Protocol");
    }

    /**
     * @notice Allows any user/wallet to create a new proposal candidate
     * @param _name Title or name of the proposal candidate
     */
    function addCandidate(string memory _name) public {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");

        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);

        emit CandidateAdded(candidatesCount, _name);
    }

    /**
     * @notice Allows connected wallets to vote once for a candidate
     * @param _candidateId The ID of the candidate/proposal being voted for
     */
    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    /**
     * @notice Returns full details for a given candidate ID
     * @param _candidateId The ID of the candidate to fetch
     */
    function getCandidate(uint256 _candidateId) public view returns (Candidate memory) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        return candidates[_candidateId];
    }

    /**
     * @notice Checks whether a given wallet address has already cast a vote
     * @param _voter Address to check voting status for
     */
    function hasAddressVoted(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }

    /**
     * @notice Returns the total number of votes cast across all candidates
     */
    function getTotalVotes() public view returns (uint256 totalVotes) {
        for (uint256 i = 1; i <= candidatesCount; i++) {
            totalVotes += candidates[i].voteCount;
        }
    }
}
