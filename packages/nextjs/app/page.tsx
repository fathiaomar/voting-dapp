"use client";

import { useRef, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [newCandidateName, setNewCandidateName] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "proposals" | "create">("dashboard");

  // Section references for smooth scrolling
  const proposalsRef = useRef<HTMLDivElement>(null);
  const createProposalRef = useRef<HTMLDivElement>(null);

  // Read smart contract state
  const { data: candidatesCount } = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "candidatesCount",
  });

  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "hasVoted",
    args: [connectedAddress],
  });

  const { writeContractAsync: writeVotingAsync } = useScaffoldWriteContract("Voting");

  const totalCandidates = candidatesCount ? Number(candidatesCount) : 0;

  // --- Smooth Scroll & Tab Handlers ---
  const handleStartVotingClick = () => {
    setActiveTab("proposals");
    setTimeout(() => {
      proposalsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCreateProposalClick = () => {
    setActiveTab("create");
    setTimeout(() => {
      createProposalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleVote = async (candidateId: number) => {
    try {
      await writeVotingAsync({
        functionName: "vote",
        args: [BigInt(candidateId)],
      });
    } catch (e) {
      console.error("Error submitting vote:", e);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim()) return;
    try {
      await writeVotingAsync({
        functionName: "addCandidate",
        args: [newCandidateName],
      });
      setNewCandidateName("");
      setActiveTab("proposals");
    } catch (e) {
      console.error("Error adding candidate/proposal:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center px-4 md:px-8 py-8">
      {/* --- HERO SECTION --- */}
      <section className="w-full max-w-6xl text-center py-12 border-b border-[#1A1A1A]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#00E5FF]/30 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></span>
          <span className="text-xs text-[#00E5FF] font-semibold tracking-wide uppercase">
            CHAINVOTE DAO • LIVE GOVERNANCE
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-gray-200 to-[#00E5FF] bg-clip-text text-transparent">
          Vote Transparently on the Blockchain
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Create proposals, vote securely with on-chain signatures, and track governance decisions in real time.
        </p>

        {/* Working Hero Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStartVotingClick}
            className="px-6 py-3 rounded-lg font-bold bg-[#00E5FF] text-black hover:bg-[#00E5FF]/80 transition cursor-pointer shadow-lg shadow-[#00E5FF]/20"
          >
            Start Voting
          </button>

          <button
            onClick={handleCreateProposalClick}
            className="px-6 py-3 rounded-lg font-bold bg-[#111111] border border-[#1A1A1A] hover:border-[#00E5FF] text-white transition cursor-pointer"
          >
            Create Proposal
          </button>
        </div>
      </section>

      {/* --- DASHBOARD STATS --- */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
        <div className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Total Proposals</p>
          <p className="text-3xl font-bold text-[#00E5FF] mt-1">{totalCandidates}</p>
        </div>
        <div className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Active Votes</p>
          <p className="text-3xl font-bold text-[#00FF88] mt-1">1</p>
        </div>
        <div className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Voter Eligibility</p>
          <p className="text-lg font-semibold mt-1">
            {hasVoted ? (
              <span className="text-[#FF4D4D]">Voted</span>
            ) : (
              <span className="text-[#00FF88]">Eligible</span>
            )}
          </p>
        </div>
        <div className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-xl">
          <p className="text-gray-400 text-sm">DAO Treasury Balance</p>
          <p className="text-3xl font-bold text-white mt-1">100.0 ETH</p>
        </div>
      </section>

      {/* --- MAIN NAVIGATION TABS --- */}
      <div className="w-full max-w-6xl flex border-b border-[#1A1A1A] mb-8">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-6 py-3 font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "dashboard"
              ? "border-[#00E5FF] text-[#00E5FF]"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("proposals")}
          className={`px-6 py-3 font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "proposals"
              ? "border-[#00E5FF] text-[#00E5FF]"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Active Proposals
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-6 py-3 font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "create"
              ? "border-[#00E5FF] text-[#00E5FF]"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Create Proposal
        </button>
      </div>

      {/* --- TAB CONTENT: CREATE PROPOSAL FORM --- */}
      {activeTab === "create" && (
        <div
          ref={createProposalRef}
          className="w-full max-w-2xl bg-[#111111] border border-[#1A1A1A] p-6 rounded-xl mb-12 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-[#00E5FF]">Create Governance Proposal</h2>
          <form onSubmit={handleAddCandidate} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Proposal Title / Candidate Name</label>
              <input
                type="text"
                placeholder="e.g. Allocate 10 ETH to Community Grant Pool"
                value={newCandidateName}
                onChange={e => setNewCandidateName(e.target.value)}
                className="w-full bg-[#050505] border border-[#1A1A1A] p-3 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
            <button
              type="submit"
              disabled={!newCandidateName.trim() || !connectedAddress}
              className="w-full py-3 bg-[#00E5FF] text-black font-bold rounded-lg hover:bg-[#00E5FF]/80 transition cursor-pointer disabled:opacity-50"
            >
              Submit Proposal to Smart Contract
            </button>
          </form>
        </div>
      )}

      {/* --- TAB CONTENT: PROPOSALS / BALLOT LIST --- */}
      {(activeTab === "dashboard" || activeTab === "proposals") && (
        <div ref={proposalsRef} className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: totalCandidates }, (_, i) => i + 1).map(id => (
            <CandidateProposalCard
              key={id}
              id={id}
              hasVoted={!!hasVoted}
              connectedAddress={connectedAddress}
              onVote={handleVote}
            />
          ))}
        </div>
      )}

      {/* --- RECENT VOTER ACTIVITY --- */}
      <section className="w-full max-w-6xl bg-[#111111] border border-[#1A1A1A] p-6 rounded-xl mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF88]"></span> Real-Time Voter Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A] text-gray-400 text-sm">
                <th className="py-3">Voter Wallet</th>
                <th className="py-3">Status</th>
                <th className="py-3">Network</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#1A1A1A]">
              <tr>
                <td className="py-3 font-mono text-[#00E5FF]">{connectedAddress || "0x123...456"}</td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded bg-[#00FF88]/10 text-[#00FF88] text-xs font-semibold">
                    {hasVoted ? "Voted Yes" : "Active"}
                  </span>
                </td>
                <td className="py-3 text-gray-400">Hardhat Localhost</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// --- CANDIDATE CARD COMPONENT ---
const CandidateProposalCard = ({
  id,
  hasVoted,
  connectedAddress,
  onVote,
}: {
  id: number;
  hasVoted: boolean;
  connectedAddress?: string;
  onVote: (id: number) => void;
}) => {
  const { data: candidate } = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "candidates",
    args: [BigInt(id)],
  });

  if (!candidate) return <div className="bg-[#111111] animate-pulse h-48 rounded-xl border border-[#1A1A1A]"></div>;

  const [candidateId, name, voteCount] = candidate;

  return (
    <div className="bg-[#111111] border border-[#1A1A1A] hover:border-[#00E5FF]/50 p-6 rounded-xl transition duration-200 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs bg-[#1A1A1A] px-2.5 py-1 rounded-full text-gray-300">
            Proposal #{candidateId.toString()}
          </span>
          <span className="text-xs font-bold text-[#00FF88] bg-[#00FF88]/10 px-2.5 py-1 rounded-full">
            {voteCount.toString()} Votes
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-4">{name}</h3>
      </div>

      <button
        onClick={() => onVote(Number(candidateId))}
        disabled={hasVoted || !connectedAddress}
        className={`w-full py-2.5 rounded-lg font-semibold transition cursor-pointer ${
          hasVoted ? "bg-[#1A1A1A] text-gray-500 cursor-not-allowed" : "bg-[#00E5FF] text-black hover:bg-[#00E5FF]/80"
        }`}
      >
        {hasVoted ? "Already Voted" : `Vote for Option`}
      </button>
    </div>
  );
};

export default Home;
