import React, { useState } from "react";
import AssetDropdown from "./AssetDropdown";
import NetworkDropdown from "./NetworkDropdown";
import { useTheme } from "next-themes";

const networkList: Network[] = [
  { id: 1, name: "Ethereum", icon: "/networks/eth.svg" },
  { id: 2, name: "Arbitrum", icon: "/networks/arbitrum.svg" },
  { id: 3, name: "K2", icon: "/networks/karak.svg" },
];

const assetList: Asset[] = [
  { network: "Ethereum", name: "Swell ETH", icon: "/assets/swell-eth.svg", address: "0x1234567890abcdef" },
  { network: "Ethereum", name: "Staked Frax ETH", icon: "/assets/staked-frax-eth.svg", address: "0x1234567890abcdef" },
  {
    network: "Ethereum",
    name: "Lido Wrapped stETH",
    icon: "/assets/lido-wrapped-eth.svg",
    address: "0x1234567890abcdef",
  },
  { network: "Ethereum", name: "Mantle ETH", icon: "/assets/mantle-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Rocket Pool ETH", icon: "/assets/rocketpool-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Coinbase ETH", icon: "/assets/coinbase-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Binance ETH", icon: "/assets/binance-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Stader ETH", icon: "/assets/stader-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Restaked Swell ETH", icon: "/assets/restaked-swell-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Etherfi Wrapped eETH", icon: "/assets/etherfi-wrapped-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Kelp Restaked ETH", icon: "/assets/kelp-restaked-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Renzo Restaked ETH", icon: "/assets/renzo-restaked-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Puffer Restaked ETH", icon: "/assets/puffer-restaked-eth.svg", address: "0x" },
  { network: "Ethereum", name: "Staked Frax", icon: "/assets/staked-frax.svg", address: "0x" },
  { network: "Ethereum", name: "USDC", icon: "/assets/usdc.svg", address: "0x" },
  { network: "Ethereum", name: "Tether", icon: "/assets/tether.svg", address: "0x" },
  { network: "Ethereum", name: "Savings DAI", icon: "/assets/savings-dai.svg", address: "0x" },
  { network: "Ethereum", name: "Pendle rswETH", icon: "/assets/pendle-rsweth.svg", address: "0x" },
  { network: "Ethereum", name: "Pendle weETH", icon: "/assets/pendle-weeth.svg", address: "0x" },
  { network: "Ethereum", name: "Pendle rsETH", icon: "/assets/pendle-rseth.svg", address: "0x" },
];

export interface Network {
  id: number;
  name: string;
  icon?: string;
}

export interface Asset {
  network: string;
  name: string;
  icon?: string;
  address?: `0x${string}`;
}

interface Props {
  networks: string[];
  assets: string[];
  walletBalance: number;
}

const StakingBox: React.FC<Props> = ({ walletBalance }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networkList[0]);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(assetList[0]);
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
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            networkList={networkList}
          />
        </div>
        <div className="flex mb-4 mt-3 border border-black px-4">
          <AssetDropdown selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} assetList={assetList} />
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
    </div>
  );
};

export default StakingBox;
