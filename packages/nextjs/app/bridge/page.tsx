"use client";

import type { NextPage } from "next";
import BridgingBox from "~~/components/BridgingBox";

const Bridge: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <div id="pattern" />
      <div className="flex flex-row mx-24 mt-[6rem]">
        <div className="flex flex-col w-3/5 pr-[12rem]">
          <div className="italic font-bold text-[2rem] text-[#ff6a48] pb-8">WHY BRIDGE?</div>
          <div>For a limited time, assets staked on K2 give a double amount of XP.</div>
        </div>
        <div className="flex flex-col">
          <BridgingBox networks={["Ethereum", "Arbitrum", "K2"]} assets={["wstETH", "ETH"]} walletBalance={2.03} />
          <div className="flex flex-row justify-end text-xs w-full">~1 min via Karak Bridge</div>
          <div className="w-full bg-[#ff6a48] mt-4 py-2 text-center">BRIDGE</div>
        </div>
      </div>
    </>
  );
};

export default Bridge;
