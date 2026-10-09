import { deployScript, artifacts } from "../rocketh/deploy.js";

export default deployScript(
  async env => {
    const { deployer } = env.namedAccounts;

    const votingContract = await env.deploy("Voting", {
      account: deployer,
      artifact: artifacts.Voting,
    });

    console.log("👋 Voting contract deployed to:", votingContract.address);
  },
  {
    tags: ["Voting"],
  },
);
