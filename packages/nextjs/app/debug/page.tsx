import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts | ChainVote DAO",
  description: "Debug your deployed smart contracts",
});

const Debug: NextPage = () => {
  return (
    <div className="debug-contracts-page min-h-screen bg-[#050505] text-white p-4 sm:p-8">
      {/* Debug Interface */}
      <DebugContracts />

      {/* Footer Banner */}
      <div className="text-center mt-12 bg-[#111111] border border-[#1A1A1A] text-white p-8 rounded-xl max-w-4xl mx-auto shadow-lg">
        <h1 className="text-3xl font-bold my-0 text-[#00E5FF]">🗳️ Contract Debugger</h1>
        <p className="text-gray-400 mt-2">
          Directly interact with deployed read and write functions on your local Hardhat chain.
        </p>
      </div>
    </div>
  );
};

export default Debug;
