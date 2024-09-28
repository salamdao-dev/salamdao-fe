"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { formatEther, getAddress } from "viem";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { salamels } from "~~/utils/constants";

type Claim = {
  price: bigint;
  quantity: number;
  sig: string;
};

const Salamels = () => {
  const [count, setCount] = useState<string>("0");
  const [amountMinted, setAmountMinted] = useState<bigint>(BigInt(0));
  const [claimData, setClaimData] = useState<Claim>({
    price: BigInt(0),
    quantity: 0,
    sig: "",
  });

  const { chain, address } = useAccount();
  const client = usePublicClient();
  const balance = useBalance({ address: address });

  const { data: nextTokenId } = useReadContract({
    abi: chain && salamels[chain?.id as number].abi,
    address: chain && salamels[chain?.id as number].address,
    functionName: "getNextTokenId",
  });

  const basePrice = BigInt("40000000000000000");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "0") {
      setCount("1");
    } else if (value === "") {
      setCount("");
    } else if (isNaN(parseInt(value))) {
      return;
    } else if (claimData.quantity === 0) {
      setCount(value);
    } else if (parseInt(value) >= claimData.quantity - parseInt(amountMinted.toString())) {
      setCount((claimData.quantity - parseInt(amountMinted.toString())).toString());
    } else if (value.match(/^[0-9]*$/) && parseInt(value) <= claimData.quantity) {
      setCount(value);
    }
  };

  useEffect(() => {
    if (!address) return;
    const fetchClaims = async () => {
      let price = BigInt(0);
      let quantity = 0;
      let sig = "";

      try {
        const response = await fetch(`https://salamdao.vip/api/claims?address=${getAddress(address)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        ({ price, quantity, sig } = data as Claim);
      } catch (error) {
        console.error("Error fetching claimable signature from backend: ", error);
      }
      setClaimData({
        price: BigInt(price),
        quantity,
        sig,
      });

      const result = (await client?.readContract({
        address: salamels[chain?.id as number].address,
        abi: salamels[chain?.id as number].abi,
        functionName: "amountMintedBySignedApproval",
        args: [address],
      })) as bigint;
      if (result !== amountMinted) {
        setAmountMinted(result);
      }
    };

    fetchClaims();
  }, [address]);

  const mintData = {
    abi: chain && salamels[chain?.id as number].abi,
    address: chain && salamels[chain?.id as number].address,
    functionName: "claimSignedMint",
    args: [claimData.sig, Number(count), claimData.quantity, claimData.price],
    value: claimData.price * BigInt(count),
  };

  const publicMintData = {
    abi: chain && salamels[chain?.id as number].abi,
    address: chain && salamels[chain?.id as number].address,
    functionName: "publicMint",
    args: [Number(count)],
    value: basePrice * BigInt(count),
  };

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash });

  const isMintTxLoading = isPending || isLoading;

  const handleMint = async () => {
    if (!hasSufficientBalance()) {
      toast.error("Insufficient balance");
      return;
    }
    if (count === "0") {
      toast.error("Please select a quantity");
      return;
    }
    if (claimData.quantity > 0) {
      // @ts-ignore
      writeContract(mintData);
    } else {
      // @ts-ignore
      writeContract(publicMintData);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Minted successfully!");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isLoading) {
      toast(() => (
        <div>
          <div>Minting...</div>
          <a className="color-[#ff6a48] underline" href={`https://etherscan.io/tx/${hash}`} target="_blank">
            View Transaction
          </a>
        </div>
      ));
    }
  }, [isLoading]);

  useEffect(() => {
    if (isError) {
      toast.error("Mint failed");
    }
  }, [isError]);

  const hasSufficientBalance = () => {
    return balance.data && balance.data.value >= claimData.price * BigInt(count);
  };

  return (
    <>
      <div className="salamels-bg" />
      <div className="flex flex-row w-full mr-4 h-[80vh]">
        <img
          src="/nft/Salamel-Overlay-Mint-page.gif"
          alt="Salamel"
          className="hidden md:block md:w-[50%] md:max-w-[50rem] md:bottom-0 md:fixed md:max-h-[95%]"
        />
        <div className="my-auto w-full md:w-[40%] mx-4 md:ml-auto md:mr-[10%]">
          <div className="p-4 bg-[#cebdba] border border-2 border-black max-w-[35rem]">
            <div className="max-w-[35rem] p-2 h-fit">
              <div className="flex flex-row w-full">
                <div
                  className="border border-black p-4 hover:cursor-pointer hover:bg-[#b1a19f] transition duration-300 select-none"
                  onClick={() => parseInt(count) > 1 && setCount((parseInt(count) - 1).toString())}
                >
                  -
                </div>
                <div className="flex align-center justify-center w-full border border-x-0 border-black text-xl">
                  <input
                    className="w-full text-center bg-transparent border-0 focus:ring-0 focus:ring-offset-0 focus:outline-0"
                    value={count}
                    onChange={e => handleInput(e)}
                  />
                </div>
                <div
                  className="border border-black p-4 ml-auto hover:cursor-pointer hover:bg-[#b1a19f] transition duration-300 select-none"
                  onClick={() =>
                    claimData.quantity > 0
                      ? parseInt(count) < claimData.quantity && setCount((parseInt(count) + 1).toString())
                      : setCount((parseInt(count) + 1).toString())
                  }
                >
                  +
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="border border-black p-4 w-full bg-transparent flex justify-between">
                  <div>total</div>
                  <div>
                    {formatEther(claimData.price > 0 ? claimData.price * BigInt(count) : basePrice * BigInt(count))} ETH
                    + gas
                  </div>
                </div>
              </div>
            </div>
            {claimData.price > 0 && claimData.price < basePrice && (
              <>
                <div className="text-sm text-right my-0 max-w-[35rem] mt-2 mb-1 flex flex-row justify-end">
                  You are eligible for a{" "}
                  {parseFloat(Number((basePrice - claimData.price) / claimData.price).toFixed(2)).toString()}% discount
                  <svg
                    data-tooltip-id="info-tooltip"
                    data-tooltip-place="top-start"
                    data-tooltip-html={`<div className='max-w-[90vw] sm:break-words'>You are eligible for a discount based on your activity on Karak.<br /> The more you have participated in the community, the higher the discount.</div>`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-0 my-auto ml-1 hover:opacity-70 transition duration-300 hover:cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                  <Tooltip className="!w-[20rem] md:!w-fit break-words" id="info-tooltip" />
                </div>
                <div className="text-sm text-right my-0 max-w-[35rem] mt-2 mb-1 flex flex-row justify-end">
                  You have minted {amountMinted.toString()} of {claimData.quantity} Salamels available at a discount.
                </div>
              </>
            )}
            <div
              onClick={handleMint}
              className={`bg-red-500 max-w-[35rem] py-2 text-center hover:cursor-pointer hover:bg-red-400 transition duration-300 select-none ${
                (!hasSufficientBalance() || isMintTxLoading || count == "0") &&
                "opacity-50 !cursor-default pointer-events-none"
              }`}
            >
              {!hasSufficientBalance() ? "INSUFFICIENT BALANCE" : isMintTxLoading ? "MINTING..." : "MINT"}
            </div>
            <div className="max-w-[35rem] text-xl">
              <div className="max-w-[15rem] flex flex-row justify-between mt-6 w-full mx-auto">
                <div>{"MINTED"}</div>
                <div>{!isNaN(Number(nextTokenId)) ? Number(nextTokenId) - 1 : 0}/10000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Salamels;
