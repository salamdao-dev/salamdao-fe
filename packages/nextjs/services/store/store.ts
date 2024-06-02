import create from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { Asset, Network, ReferralData } from "~~/types/utils";
import { assetList, networkList } from "~~/utils/constants";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  selectedNetwork: Network;
  setSelectedNetwork: (newSelectedNetworkState: Network) => void;
  nonce: any;
  setNonce: (newNonceState: any) => void;
  referrals: ReferralData[];
  setReferrals: (newReferralsState: ReferralData[]) => void;
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  tokenDetails: Record<string, Record<number, Record<`0x${string}`, bigint>>>;
  setTokenDetails: (newTokenBalancesState: Record<string, Record<number, Record<`0x${string}`, bigint>>>) => void;
  canStake: boolean;
  setCanStake: (newCanStakeState: boolean) => void;
  selectedAsset: Asset;
  setSelectedAsset: (newSelectedAssetState: Asset) => void;
  stakeAmount: string;
  setStakeAmount: (newStakeAmountState: string) => void;
  vaultBalances: Record<number, Record<string, Record<string, bigint>>> | undefined;
  setVaultBalances: (newVaultBalancesState: Record<number, Record<string, Record<string, bigint>>> | undefined) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  selectedNetwork: networkList[0],
  setSelectedNetwork: (newSelectedNetwork: Network) => set(() => ({ selectedNetwork: newSelectedNetwork })),
  nonce: {},
  setNonce: (newNonce: string) => set(() => ({ nonce: newNonce })),
  referrals: [],
  setReferrals: (newReferrals: ReferralData[]) => set(() => ({ referrals: newReferrals })),
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  tokenDetails: {},
  setTokenDetails: (newTokenDetails: any) => set(() => ({ tokenDetails: newTokenDetails })),
  canStake: false,
  setCanStake: (newCanStake: boolean) => set(() => ({ canStake: newCanStake })),
  selectedAsset: assetList[0],
  setSelectedAsset: (newSelectedAsset: Asset) => set(() => ({ selectedAsset: newSelectedAsset })),
  stakeAmount: "0",
  setStakeAmount: (newStakeAmount: string) => set(() => ({ stakeAmount: newStakeAmount })),
  vaultBalances: undefined,
  setVaultBalances: (
    newVaultBalances: Record<number, Record<`0x${string}`, Record<`0x${string}`, bigint>>> | undefined,
  ) => set(() => ({ vaultBalances: newVaultBalances })),
}));
