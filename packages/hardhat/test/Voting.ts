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
});
