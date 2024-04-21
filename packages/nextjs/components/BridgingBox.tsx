import React, { useState } from "react";
import AssetDropdown from "./AssetDropdown";
import NetworkDropdown from "./NetworkDropdown";
import { Asset, Network } from "./StakingBox";
import { useTheme } from "next-themes";

const networkList: Network[] = [
  { id: 1, name: "Ethereum", icon: "/networks/eth.svg" },
  { id: 2, name: "Arbitrum", icon: "/networks/arbitrum.svg" },
  { id: 3, name: "K2", icon: "/networks/karak.svg" },
];

const assetList: Asset[] = [
  { network: "Ethereum", name: "Ether", symbol: "ETH", icon: "/assets/eth.svg", address: "0x1234567890abcdef" },
  { network: "Ethereum", name: "USDC", symbol: "USDC", icon: "/assets/usdc.svg", address: "0x1234567890abcdef" },
  {
    network: "Ethereum",
    name: "Restaked Swell ETH",
    symbol: "rswETH",
    icon: "/assets/restaked-swell-eth.svg",
    address: "0x1234567890abcdef",
  },
];

interface Props {
  networks: string[];
  assets: string[];
  walletBalance: number;
}

const BridgingBox: React.FC<Props> = ({ walletBalance }) => {
  const [selectedFromNetwork, setSelectedFromNetwork] = useState<Network>(networkList[0]);
  const [selectedFromAsset, setSelectedFromAsset] = useState<Asset>(assetList[0]);

  const [selectedToNetwork, setSelectedToNetwork] = useState<Network>(networkList[2]);
  const [selectedToAsset, setSelectedToAsset] = useState<Asset>(assetList[0]);

  const [stakeAmount, setStakeAmount] = useState<number | string>(0);

  const handleStakeAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "" || isNaN(parseFloat(event.target.value)) || parseFloat(event.target.value) < 0) {
      setStakeAmount("");
    } else {
      setStakeAmount(parseFloat(event.target.value));
    }
  };

  const { theme } = useTheme();

  return (
    <div className="w-full flex flex-col items-center">
      <div className={`border-2 p-4 ${theme && theme === "dark" ? "border-white" : "border-black bg-[#cebdba]"}`}>
        <div className="w-full">
          <NetworkDropdown
            selectedNetwork={selectedFromNetwork}
            setSelectedNetwork={setSelectedFromNetwork}
            networkList={networkList}
            from={true}
          />
        </div>
        <div className="flex mb-4 mt-3 border border-black px-4">
          <AssetDropdown
            selectedAsset={selectedFromAsset}
            setSelectedAsset={setSelectedFromAsset}
            assetList={assetList}
          />
          <div className="flex flex-row flex-2 ml-10">
            <input
              type="string"
              value={stakeAmount}
              onChange={handleStakeAmountChange}
              className="w-full h-full border-0 bg-transparent text-2xl p-2 focus:ring-0 focus:ring-offset-0 focus:outline-0"
            />
            <div
              onClick={() => setStakeAmount(walletBalance)}
              className={`mt-auto mb-auto cursor-pointer ml-2 bg-left-bottom bg-gradient-to-r ${
                theme === "dark" ? "from-white to-white" : "from-black to-black"
              } bg-[length:0%_1px] bg-no-repeat hover:bg-[length:100%_1px] transition-all duration-300 ease-out`}
            >
              MAX
            </div>
          </div>
        </div>
        <div className={`flex flex-col border px-4 ${theme === "dark" ? "border-white" : "border-black"}`}>
          <span className="mb-1 mt-2">wallet balance: {walletBalance}</span>
          <span className="mb-2">staked amount: 0.0</span>
        </div>
      </div>

      <div
        className="absolute bottom-[34.1%] hover:cursor-pointer flex justify-center items-center h-12 w-12 bg-[#cebdba] border-2 border-black -translate-y-6"
        onClick={() => {
          const tempFrom = selectedFromNetwork;
          setSelectedFromNetwork(selectedToNetwork);
          setSelectedToNetwork(tempFrom);
        }}
      >
        <div className="focus:outline-none">
          <svg
            className="w-6 h-6 translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l5-5 5 5M12 3v14"></path>
          </svg>
        </div>
        <div className="focus:outline-none">
          <svg
            className="w-6 h-6 -translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l5 5 5-5M12 21V7"></path>
          </svg>
        </div>
      </div>

      <div className={`border-2 mt-6 p-4 ${theme && theme === "dark" ? "border-white" : "border-black bg-[#cebdba]"}`}>
        <div className="w-full">
          <NetworkDropdown
            selectedNetwork={selectedToNetwork}
            setSelectedNetwork={setSelectedToNetwork}
            networkList={networkList}
            from={true}
          />
        </div>
        <div className="flex mb-4 mt-3 border border-black px-4">
          <AssetDropdown selectedAsset={selectedToAsset} setSelectedAsset={setSelectedToAsset} assetList={assetList} />
          <div className="flex flex-row flex-2 ml-10">
            <input
              type="string"
              value={stakeAmount}
              onChange={handleStakeAmountChange}
              className="w-full h-full border-0 bg-transparent text-2xl p-2 focus:ring-0 focus:ring-offset-0 focus:outline-0"
            />
            <div
              onClick={() => setStakeAmount(walletBalance)}
              className={`mt-auto mb-auto cursor-pointer ml-2 bg-left-bottom bg-gradient-to-r ${
                theme === "dark" ? "from-white to-white" : "from-black to-black"
              } bg-[length:0%_1px] bg-no-repeat hover:bg-[length:100%_1px] transition-all duration-300 ease-out`}
            >
              MAX
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgingBox;
