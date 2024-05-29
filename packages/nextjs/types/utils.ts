import { Abi } from "viem";

export type Tuple<T, MaxLength extends number = 10, Current extends T[] = []> = Current["length"] extends MaxLength
  ? Current
  : Current | Tuple<T, MaxLength, [T, ...Current]>;

export interface Network {
  id: number;
  name: string;
  icon?: string;
}

export interface Asset {
  network: number;
  name: string;
  symbol: string;
  address: `0x${string}`;
  vault: `0x${string}`;
  decimals: number;
  icon?: string;
  description?: string;
  link?: string;
}

export type ReferralData = {
  code: string;
  createdAt: string;
  id: string;
  referredCount: number;
  updatedAt: string;
  walletAddress: `0x${string}`;
};

export type ContractMapping = {
  contract: {
    address: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: unknown[];
  };
  chainId: number;
};
