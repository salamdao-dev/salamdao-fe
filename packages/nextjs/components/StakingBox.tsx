import React, { useEffect, useState } from "react";
import AssetDropdown from "./AssetDropdown";
import NetworkDropdown from "./NetworkDropdown";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import { useGlobalState } from "~~/services/store/store";
import { Asset } from "~~/types/utils";
import { assetList, networkList } from "~~/utils/constants";
import { formatBigInt, isStrictlyNumber } from "~~/utils/utils";

const StakingBox: React.FC = () => {
  const { theme } = useTheme();
  const { address: connectedAddress } = useAccount();

  const {
    tokenDetails,
    setCanStake,
    vaultBalances,
    selectedNetwork,
    setSelectedNetwork,
    selectedAsset,
    setSelectedAsset,
    stakeAmount,
    setStakeAmount,
  } = useGlobalState();

  const [filteredAssetList, setFilteredAssetList] = useState<Asset[]>(assetList);

  const getVaultBalance = (asset: `0x${string}`): string => {
    const amount = vaultBalances?.[selectedNetwork.id]?.[asset]?.[selectedAsset.vault];
    if (!amount) return "0";
    return formatBigInt(amount, selectedAsset.decimals);
  };

  const getWalletBalance = (asset: `0x${string}`): string => {
    console.log("tokenDetails:", tokenDetails);
    if (Object.keys(tokenDetails).length === 0) return "0";
    const amount = tokenDetails?.["balances"][selectedNetwork.id]?.[asset];
    if (!amount) return "0";
    return formatBigInt(amount, selectedAsset.decimals);
  };

  // const getAllowance = (asset: `0x${string}`): string => {
  //   const amount = tokenDetails?.['allowances'][selectedNetwork.id]?.[asset];
  //   if (!amount) return "0";
  //   return formatBigInt(amount, selectedAsset.decimals);
  // }

  const handleStakeAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setStakeAmount("");
      setCanStake(false);
    } else if (!isStrictlyNumber(event.target.value) || parseFloat(event.target.value) < 0) {
      return;
    } else if (event.target.value === "0") {
      setStakeAmount("0");
      setCanStake(false);
    } else {
      if (event.target.value === "0." || event.target.value === ".") {
        setStakeAmount("0.");
        setCanStake(false);
        return;
      }
      if (parseFloat(getWalletBalance(selectedAsset.address)) > 0) {
        if (parseFloat(event.target.value) > parseFloat(getWalletBalance(selectedAsset.address))) {
          setCanStake(true);
          setStakeAmount(getWalletBalance(selectedAsset.address));
        } else {
          if (parseFloat(event.target.value) > 0) {
            setCanStake(true);
          } else {
            setCanStake(false);
          }
          setStakeAmount(event.target.value);
        }
      } else {
        setCanStake(false);
        setStakeAmount("0");
      }
    }
  };

  useEffect(() => {
    const filteredAssets = assetList.filter(asset => asset.network === selectedNetwork.id);
    setFilteredAssetList(filteredAssets);
    setSelectedAsset(filteredAssets[0]);
  }, [selectedNetwork]);

  useEffect(() => {
    setStakeAmount("0");
    setCanStake(false);
  }, [selectedAsset]);

  useEffect(() => {
    setStakeAmount("0");
    setCanStake(false);
  }, [connectedAddress]);

  return (
    <div className="w-full flex flex-col items-center">
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
            onClick={() => {
              setStakeAmount(getWalletBalance(selectedAsset.address));
              setCanStake(true);
            }}
            className={`mt-auto mb-auto cursor-pointer ml-2 bg-left-bottom bg-gradient-to-r ${
              theme === "dark" ? "from-white to-white" : "from-black to-black"
            } bg-[length:0%_1px] bg-no-repeat hover:bg-[length:100%_1px] transition-all duration-300 ease-out`}
          >
            MAX
          </div>
        </div>
      </div>
      <div className={`flex flex-col border px-4 w-full ${theme === "dark" ? "border-white" : "border-black"}`}>
        <span className="mb-1 mt-2">wallet balance: {getWalletBalance(selectedAsset.address)}</span>
        <span className="mb-2">staked amount: {getVaultBalance(selectedAsset.address)}</span>
      </div>
    </div>
  );
};

export default StakingBox;
