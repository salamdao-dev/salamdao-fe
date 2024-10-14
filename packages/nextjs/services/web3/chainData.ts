import { base, baseSepolia, mainnet, sepolia } from "viem/chains";

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
  [base.id]: "https://base.llamarpc.com",
  [baseSepolia.id]: "https://base-sepolia.blockpi.network/v1/rpc/public",
  [sepolia.id]: "https://public.stackup.sh/api/v1/node/ethereum-sepolia	",
};

export const fallbackRPCs = {
  [mainnet.id]: "https://mainnet.infura.io/v3/",
  [base.id]: "https://white-broken-card.base-mainnet.quiknode.pro/d521b0d6af5c96b250021a8ed422bc3add517bf9",
  [baseSepolia.id]: "https://quiet-sparkling-model.base-sepolia.quiknode.pro/b3f9858bf22223a57f92d5a286908127a3ef861f",
  [sepolia.id]: "https://eth-sepolia.api.onfinality.io/public",
};
