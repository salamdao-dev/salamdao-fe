"use client";

import StakingBox from "../components/StakingBox";
import type { NextPage } from "next";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <div id="pattern" />
      <div className="flex flex-row mx-24 mt-[6rem]">
        <div className="flex flex-col w-3/5 pr-[12rem]">
          <div className="italic font-bold text-[2rem] text-[#ff6a48] pb-8">WHY STAKING?</div>
          <div>
            Earn Karak XP and potentially ETH staking rewards + Restaking Rewards + Eigenlayer Points + LRT Points
          </div>
          {/* TODO: Make this a dynamic component based on what is selected in the staking component */}
          <div className="italic font-bold text-[2rem] text-[#ff6a48] pt-8 pb-8">wstETH?</div>
          <div>
            wstETH is a wrapped stETH token that is used to stake on the Karak network. It can be traded on
            decentralized exchanges like Balancer V2, UniswapV3 and Astroport.
          </div>
        </div>
        <div className="flex flex-col">
          <StakingBox networks={["Ethereum", "Arbitrum", "K2"]} assets={["wstETH", "ETH"]} walletBalance={2.03} />
          <div className="flex flex-row justify-end text-xs w-full">14 day period to unstake</div>
          <div className="w-full bg-[#ff6a48] mt-4 py-2 text-center">STAKE</div>
        </div>
      </div>
    </>
  );
};

export default Home;
