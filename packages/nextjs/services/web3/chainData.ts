import { mainnet, sepolia } from "viem/chains";

// export const karak = {
//   id: 2410,
//   name: "Karak",
//   nativeCurrency: {
//     name: "Ethereum",
//     symbol: "ETH",
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: {
//       http: ["https://rpc.karak.network"],
//     },
//   },
//   contracts: {
//     multicall3: {
//       address: "0x73331e33f1552E706D56aa453ce19BCE314B4F59",
//     },
//   },
// } as const satisfies Chain;

export const mainRPCs = {
  [mainnet.id]: "https://1rpc.io/eth",
  [sepolia.id]: "https://public.stackup.sh/api/v1/node/ethereum-sepolia	",
};

export const fallbackRPCs = {
  [mainnet.id]: "https://mainnet.infura.io/v3/",
  [sepolia.id]: "https://eth-sepolia.api.onfinality.io/public",
};
