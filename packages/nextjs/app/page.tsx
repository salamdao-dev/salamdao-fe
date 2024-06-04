"use client";

import { useEffect, useMemo } from "react";
import StakingBox from "../components/StakingBox";
import { switchChain } from "@wagmi/core";
import { waitForTransactionReceipt } from "@wagmi/core";
import type { NextPage } from "next";
import toast from "react-hot-toast";
import { zeroAddress } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import ERC20Abi from "~~/contracts/abis/ERC20.json";
import externalContracts from "~~/contracts/externalContracts";
import { useTokenBalances } from "~~/hooks/scaffold-eth/useFetchTokenBalances";
import { useVaultBalances } from "~~/hooks/scaffold-eth/useFetchVaultStakes";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const Home: NextPage = () => {
  const {
    selectedAsset,
    selectedNetwork,
    canStake,
    stakeAmount,
    tokenDetails,
    setStakeAmount,
    setTokenDetails,
    setVaultBalances,
  } = useGlobalState(state => ({
    selectedAsset: state.selectedAsset,
    selectedNetwork: state.selectedNetwork,
    canStake: state.canStake,
    stakeAmount: state.stakeAmount,
    tokenDetails: state.tokenDetails,
    setStakeAmount: state.setStakeAmount,
    setTokenDetails: state.setTokenDetails,
    setVaultBalances: state.setVaultBalances,
  }));
  const { address: connectedAddress, chainId } = useAccount();
  const fetchBalances = useTokenBalances(connectedAddress as `0x${string}`);
  const fetchVaultBalances = useVaultBalances((connectedAddress as `0x${string}`) ?? zeroAddress);

  const { writeContract, data, isError, isPending, isSuccess } = useWriteContract();

  const {
    writeContract: stakeWrite,
    data: stakeData,
    isError: stakeIsError,
    isPending: stakeIsPending,
    isSuccess: stakeIsSuccess,
  } = useWriteContract();

  useEffect(() => {
    const waitForApproval = async () => {
      if (data && isSuccess) {
        const response = await waitForTransactionReceipt(wagmiConfig, { hash: data });
        if (response.status === "success") {
          toast.success("Approval successful!");
          const { allowances }: Record<any, any> = await fetchBalances();
          setTokenDetails({ ...tokenDetails, allowances });
        } else {
          toast.error("Approval failed");
        }
      }
    };
    waitForApproval();
  }, [isSuccess, isPending, data, isError]);

  useEffect(() => {
    const waitForStake = async () => {
      if (stakeData && stakeIsSuccess) {
        const response = await waitForTransactionReceipt(wagmiConfig, { hash: stakeData });
        if (response.status === "success") {
          setStakeAmount("0");
          const { balances, allowances }: Record<any, any> = await fetchBalances();
          const vaultBalances = await fetchVaultBalances();
          setTokenDetails({ balances, allowances });
          setVaultBalances(vaultBalances);
          toast.success("Stake successful!");
        } else {
          toast.error("Stake failed");
        }
      }
    };
    waitForStake();
  }, [stakeData, stakeIsError, stakeIsPending, stakeIsSuccess]);

  const getStakeButtonMessage = useMemo(() => {
    if (connectedAddress === undefined) return "CONNECT WALLET";
    if (stakeAmount === "0" || stakeAmount === "" || parseFloat(stakeAmount) === 0) return "ENTER AMOUNT";
    if (
      tokenDetails?.["allowances"][selectedNetwork.id]?.[selectedAsset.address] <
      BigInt(parseFloat(stakeAmount) * 10 ** selectedAsset.decimals)
    )
      return "APPROVE";
    if (canStake) return "STAKE";
    return "";
  }, [connectedAddress, stakeAmount, canStake, selectedAsset, tokenDetails]);

  const { symbol, description, link } = selectedAsset;

  return (
    <>
      <div className="background-combo" />
      <div className="flex flex-col-reverse lg:flex-row mx-4 md:mx-12 lg:mx-24 mt-12 lg:mt-[6rem]">
        <div className="w-full lg:w-3/5 lg:pr-[12rem]">
          <div className="italic font-bold text-2xl text-[#ff6a48] pb-8">WHY STAKING?</div>
          <div>
            Earn Karak XP and potentially ETH staking rewards + Restaking Rewards + Eigenlayer Points + LRT Points
          </div>
          <div className="italic font-bold text-2xl text-[#ff6a48] pt-8 pb-8">{symbol}</div>
          <div>{description}</div>
          {link && (
            <a href={link} className="mt-12 relative underline pb-[3rem] lg:pb-0" target="_blank" rel="noreferrer">
              Find Out More On Coingecko
            </a>
          )}
        </div>
        <div className="w-full lg:w-2/5 mb-8 lg:mb-0">
          <div className="w-full flex flex-col items-center">
            <div className={`w-full `}>
              <div className={`border-2 p-4 w-full border-black bg-[#cebdba]`}>
                <StakingBox />
                <div className="flex flex-row justify-end text-xs w-full mt-2 lg:mt-4">7 day period to unstake</div>
                <div
                  className={`
                  w-full mt-4 py-2 text-center transition duration-300 
                  ${
                    canStake
                      ? "bg-[#ff6a48] hover:bg-[#ff6a48]/[0.7] cursor-pointer"
                      : "bg-[#8e8b87] cursor-not-allowed text-black/[.8]"
                  }
                `}
                  onClick={async () => {
                    if (canStake) {
                      const scaledNumber = BigInt(parseFloat(stakeAmount) * 10 ** selectedAsset.decimals);
                      const supervisor =
                        externalContracts[selectedNetwork.id as keyof typeof externalContracts].VaultSupervisor.address;
                      const abi =
                        externalContracts[selectedNetwork.id as keyof typeof externalContracts].VaultSupervisor.abi;
                      if (selectedNetwork.id !== chainId) {
                        await switchChain(wagmiConfig, {
                          chainId: selectedNetwork.id as keyof typeof externalContracts,
                        });
                      }
                      const allowance = tokenDetails?.["allowances"][selectedNetwork.id]?.[selectedAsset.address];

                      if (allowance < scaledNumber) {
                        writeContract({
                          address: selectedAsset.address,
                          functionName: "approve",
                          abi: ERC20Abi,
                          args: [selectedAsset.vault, scaledNumber],
                        });
                      }

                      stakeWrite({
                        address: supervisor,
                        functionName: "deposit",
                        abi: abi,
                        args: [selectedAsset.vault, scaledNumber],
                      });
                    }
                  }}
                >
                  {isPending && !!data
                    ? "APPROVING ..."
                    : stakeIsPending && !!stakeData
                    ? "STAKING ..."
                    : getStakeButtonMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
