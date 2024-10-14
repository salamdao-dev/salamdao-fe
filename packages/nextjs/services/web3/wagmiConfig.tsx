import { fallbackRPCs, mainRPCs } from "./chainData";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { mainnet, sepolia } from "viem/chains";
import { createConfig, fallback, http, unstable_connector } from "wagmi";
import { injected } from "wagmi/connectors";
import scaffoldConfig from "~~/scaffold.config";

const walletList = [metaMaskWallet, rainbowWallet, rabbyWallet, walletConnectWallet, safeWallet, coinbaseWallet];

const connectors = connectorsForWallets([{ groupName: "wallets", wallets: walletList }], {
  appName: "Salamels",
  appDescription:
    "Jump into the SALAMEL caravan, where camels stroll through Karaks sunbaked sands, chasing that juicy ORGANIC ALFALFA. Restaking has never been more chill.",
  appIcon: "/Salam_Logomark_Black.svg",
  appUrl: "",
  projectId: scaffoldConfig.walletConnectProjectId,
});

export const transports = {
  [mainnet.id]: fallback([unstable_connector(injected), http(mainRPCs[mainnet.id]), http(fallbackRPCs[mainnet.id])]),
  [sepolia.id]: fallback([unstable_connector(injected), http(mainRPCs[sepolia.id]), http(fallbackRPCs[sepolia.id])]),
};

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: transports,
  connectors,
});
