"use client";

import { useMemo } from "react";
import StakingBox from "../components/StakingBox";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useGlobalState } from "~~/services/store/store";

const Home: NextPage = () => {
  const { selectedAsset, canStake, stakeAmount } = useGlobalState();
  const { address: connectedAddress } = useAccount();

  const getStakeButtonMessage = useMemo(() => {
    if (connectedAddress === undefined) return "CONNECT WALLET";
    if (stakeAmount === "0" || stakeAmount === "") return "ENTER AMOUNT";
    if (canStake) return "STAKE";
    return "";
  }, [connectedAddress, stakeAmount, canStake]);

  const { symbol, description, link } = selectedAsset;

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row mx-4 md:mx-12 lg:mx-24 mt-12 lg:mt-[6rem]">
        <div className="w-full lg:w-3/5 lg:pr-[12rem]">
          <div className="italic font-bold text-2xl text-[#ff6a48] pb-8">WHY STAKING?</div>
          <div>
            Earn Karak XP and potentially ETH staking rewards + Restaking Rewards + Eigenlayer Points + LRT Points
          </div>
          <div className="italic font-bold text-2xl text-[#ff6a48] pt-8 pb-8">{symbol}</div>
          <div>{description}</div>
          {link && (
            <a href={link} className="mt-12 relative" target="_blank" rel="noreferrer">
              Find Out More On Coingecko
            </a>
          )}
        </div>
        <div className="w-full lg:w-2/5 mb-8 lg:mb-0">
          <div className="w-full flex flex-col items-center">
            <div className={`w-full `}>
              <StakingBox />
              <div className="flex flex-row justify-end text-xs w-full mt-2 lg:mt-4">14 day period to unstake</div>
              <div
                className={`
                  w-full mt-4 py-2 text-center transition duration-300 
                  ${
                    canStake
                      ? "bg-[#ff6a48] hover:bg-[#ff6a48]/[0.7] cursor-pointer"
                      : "bg-[#8e8b87] cursor-not-allowed text-black/[.8]"
                  }
                `}
              >
                {getStakeButtonMessage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
