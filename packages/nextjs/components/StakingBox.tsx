import React, { useEffect, useState } from "react";
import AssetDropdown from "./AssetDropdown";
import NetworkDropdown from "./NetworkDropdown";
import { useTheme } from "next-themes";
import { useNetwork } from "wagmi";

const networkList: Network[] = [
  { id: 1, name: "Ethereum", icon: "/networks/eth.svg" },
  { id: 42161, name: "Arbitrum", icon: "/networks/arbitrum.svg" },
  { id: 2410, name: "K2", icon: "/networks/karak.svg" },
];

const assetList: Asset[] = [
  {
    network: 1,
    name: "Swell ETH",
    symbol: "swETH",
    icon: "/assets/swell-eth.svg",
    address: "0x1234567890abcdef",
  },
  {
    network: 1,
    name: "Staked Frax ETH",
    symbol: "sfrxETH",
    icon: "/assets/staked-frax-eth.svg",
    address: "0x1234567890abcdef",
  },
  {
    network: 1,
    name: "Lido Wrapped stETH",
    symbol: "wstETH",
    icon: "/assets/lido-wrapped-eth.svg",
    address: "0x1234567890abcdef",
  },
  { network: 1, name: "Mantle ETH", symbol: "mETH", icon: "/assets/mantle-eth.svg", address: "0x" },
  { network: 1, name: "Rocket Pool ETH", symbol: "rETH", icon: "/assets/rocketpool-eth.svg", address: "0x" },
  { network: 1, name: "Coinbase ETH", symbol: "cbETH", icon: "/assets/coinbase-eth.svg", address: "0x" },
  { network: 1, name: "Binance ETH", symbol: "wbETH", icon: "/assets/binance-eth.svg", address: "0x" },
  { network: 1, name: "Stader ETH", symbol: "ETHx", icon: "/assets/stader-eth.webp", address: "0x" },
  {
    network: 1,
    name: "Restaked Swell ETH",
    symbol: "rswETH",
    icon: "/assets/restaked-swell-eth.svg",
    address: "0x",
  },
  {
    network: 1,
    name: "Etherfi Wrapped eETH",
    symbol: "WeETH",
    icon: "/assets/etherfi-wrapped-eth.webp",
    address: "0x",
  },
  {
    network: 1,
    name: "Kelp Restaked ETH",
    symbol: "rsETH",
    icon: "/assets/kelp-restaked-eth.svg",
    address: "0x",
  },
  {
    network: 1,
    name: "Renzo Restaked ETH",
    symbol: "ezETH",
    icon: "/assets/renzo-restaked-eth.webp",
    address: "0x",
  },
  {
    network: 1,
    name: "Puffer Restaked ETH",
    symbol: "pufETH",
    icon: "/assets/puffer-restaked-eth.svg",
    address: "0x",
  },
  { network: 1, name: "Staked Frax", symbol: "sFRAX", icon: "/assets/staked-frax.svg", address: "0x" },
  { network: 1, name: "USDC", symbol: "USDC", icon: "/assets/usdc.svg", address: "0x" },
  { network: 1, name: "Tether", symbol: "USDT", icon: "/assets/tether.webp", address: "0x" },
  { network: 1, name: "Savings DAI", symbol: "sDAI", icon: "/assets/savings-dai.svg", address: "0x" },
  { network: 1, name: "Pendle rswETH", symbol: "PT-rswETH", icon: "/assets/pendle.webp", address: "0x" },
  { network: 1, name: "Pendle weETH", symbol: "PT-weETH", icon: "/assets/pendle.webp", address: "0x" },
  { network: 1, name: "Pendle rsETH", symbol: "PT-rsETH", icon: "/assets/pendle.webp", address: "0x" },
  { network: 1, name: "Wrapped Bitcoin", symbol: "wBTC", icon: "/assets/wbtc.webp", address: "0x" },
  {
    network: 42161,
    name: "Lido Wrapped stETH",
    symbol: "wstETH",
    icon: "/assets/lido-wrapped-eth.svg",
    address: "0x1234567890abcdef",
  },
  {
    network: 42161,
    name: "Etherfi Wrapped eETH",
    symbol: "WeETH",
    icon: "/assets/etherfi-wrapped-eth.webp",
    address: "0x",
  },
  {
    network: 42161,
    name: "Renzo Restaked ETH",
    symbol: "ezETH",
    icon: "/assets/renzo-restaked-eth.webp",
    address: "0x",
  },
  { network: 42161, name: "USDC", symbol: "USDC", icon: "/assets/usdc.svg", address: "0x" },
  { network: 42161, name: "Tether", symbol: "USDT", icon: "/assets/tether.webp", address: "0x" },
  { network: 42161, name: "Pendle eETH 6/27", symbol: "PT-eETH-6/27", icon: "/assets/pendle.webp", address: "0x" },
  { network: 42161, name: "Pendle rsETH 6/27", symbol: "PT-rsETH-6/27", icon: "/assets/pendle.webp", address: "0x" },
  { network: 42161, name: "Pendle ezETH 6/27", symbol: "PT-ezETH-6/27", icon: "/assets/pendle.webp", address: "0x" },
  {
    network: 2410,
    name: "Restaked Swell ETH",
    symbol: "rswETH",
    icon: "/assets/restaked-swell-eth.svg",
    address: "0x",
  },
  { network: 2410, name: "USDC", symbol: "USDC", icon: "/assets/usdc.svg", address: "0x" },
  { network: 2410, name: "Wrapped ETH", symbol: "wETH", icon: "/assets/weth.png", address: "0x" },
];

export interface Network {
  id: number;
  name: string;
  icon?: string;
}

export interface Asset {
  network: number;
  name: string;
  symbol: string;
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
  const [filteredAssetList, setFilteredAssetList] = useState<Asset[]>(assetList);

  const handleStakeAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "" || isNaN(parseFloat(event.target.value)) || parseFloat(event.target.value) < 0) {
      setStakeAmount("");
    } else {
      setStakeAmount(parseFloat(event.target.value));
    }
  };

  const { theme } = useTheme();
  const { chain } = useNetwork();

  console.log(chain && chain);

  useEffect(() => {
    const filteredAssets = assetList.filter(asset => asset.network === selectedNetwork.id);
    setFilteredAssetList(filteredAssets);
    setSelectedAsset(filteredAssets[0]);
  }, [selectedNetwork]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className={`border-2 p-4 ${theme && theme === "dark" ? "border-white" : "border-black bg-[#cebdba]"}`}>
        <div className="w-full">
          <NetworkDropdown
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            networkList={networkList}
            from={true}
          />
        </div>
        <div className="flex mb-4 mt-3 border border-black px-4">
          <AssetDropdown
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            assetList={filteredAssetList}
            disableDropdown={false}
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
    </div>
  );
};

export default StakingBox;
