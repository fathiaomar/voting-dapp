import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Voting", function () {
  it("allows a non-owner to create a proposal", async function () {
    const [, proposer] = await ethers.getSigners();
    const voting = await ethers.deployContract("Voting");

    await expect(voting.connect(proposer).addCandidate("Community proposal"))
      .to.emit(voting, "CandidateAdded")
      .withArgs(3n, "Community proposal");

    expect(await voting.candidatesCount()).to.equal(3n);
  });

  it("allows a wallet to vote once and updates total votes", async function () {
    const [, voter] = await ethers.getSigners();
    const voting = await ethers.deployContract("Voting");

    await expect(voting.connect(voter).vote(1n))
      .to.emit(voting, "Voted")
      .withArgs(voter.address, 1n);

    expect(await voting.hasAddressVoted(voter.address)).to.equal(true);
    expect(await voting.getTotalVotes()).to.equal(1n);

    const candidate = await voting.getCandidate(1n);
    expect(candidate.voteCount).to.equal(1n);
  });

  it("prevents double voting from the same address", async function () {
    const [, voter] = await ethers.getSigners();
    const voting = await ethers.deployContract("Voting");

    await voting.connect(voter).vote(1n);

    await expect(voting.connect(voter).vote(2n)).to.be.revertedWith(
      "You have already voted."
    );
  });

  it("reverts when voting or querying an invalid candidate ID", async function () {
    const [, voter] = await ethers.getSigners();
    const voting = await ethers.deployContract("Voting");

    await expect(voting.connect(voter).vote(99n)).to.be.revertedWith(
      "Invalid candidate ID."
    );
    await expect(voting.getCandidate(0n)).to.be.revertedWith(
      "Invalid candidate ID."
    );
  });
});
