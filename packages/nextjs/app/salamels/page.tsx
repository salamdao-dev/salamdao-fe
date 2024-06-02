"use client";

import { useState } from "react";

// import { useWriteContract } from "wagmi";

const Salamels = () => {
  const [count, setCount] = useState<string>("1");
  // const { writeContract, data, isError, isPending, isSuccess } = useWriteContract();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "0") {
      setCount("1");
    } else if (value === "") {
      setCount("");
    } else if (isNaN(parseInt(value))) {
      return;
    } else if (parseInt(value) >= 20) {
      setCount("20");
    } else if (value.match(/^[0-9]*$/) && parseInt(value) <= 20) {
      setCount(value);
    }
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
                  onClick={() => parseInt(count) < 20 && setCount((parseInt(count) + 1).toString())}
                >
                  +
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="border border-black p-4 w-full bg-transparent flex justify-between">
                  <div>total</div>
                  <div>0.025 ETH + gas</div>
                </div>
              </div>
            </div>
            <div className="text-sm text-right my-0 max-w-[35rem] mt-2 mb-1 flex flex-row justify-end">
              You are eligible for a 50% discount
              <svg
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
            </div>
            <div className="bg-red-500 max-w-[35rem] py-2 text-center hover:cursor-pointer hover:bg-red-400 transition duration-300 select-none">
              MINT
            </div>
            <div className="max-w-[35rem] text-xl">
              <div className="max-w-[15rem] flex flex-row justify-between mt-6 w-full mx-auto">
                <div>MINTED</div>
                <div>0/10000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Salamels;
