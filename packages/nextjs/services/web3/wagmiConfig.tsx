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
import { base, baseSepolia } from "viem/chains";
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
  [base.id]: fallback([unstable_connector(injected), http(mainRPCs[base.id]), http(fallbackRPCs[base.id])]),
  [baseSepolia.id]: fallback([
    unstable_connector(injected),
    http(mainRPCs[baseSepolia.id]),
    http(fallbackRPCs[baseSepolia.id]),
  ]),
};

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: transports,
  connectors,
});
