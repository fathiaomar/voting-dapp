import React from "react";

export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div className="w-full">
        <ul className="menu menu-horizontal w-full flex justify-center items-center gap-2 text-sm text-base-content/70">
          <li>
            <span>🗳️ Voting dApp © {new Date().getFullYear()}</span>
          </li>
          <li>·</li>
          <li>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">
              GitHub
            </a>
          </li>
          <li>·</li>
          <li>
            <span className="badge badge-primary badge-sm">Localhost Chain</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
