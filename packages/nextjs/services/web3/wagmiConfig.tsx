import { fallbackRPCs, karak, mainRPCs } from "./chainData";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { arbitrum, mainnet } from "viem/chains";
import { createConfig, fallback, http } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";

const walletList = [metaMaskWallet, rainbowWallet, rabbyWallet, walletConnectWallet, safeWallet, coinbaseWallet];

const connectors = connectorsForWallets([{ groupName: "wallets", wallets: walletList }], {
  appName: "Salam DAO",
  appDescription: "Restake with SalamDAO to maximize your returns on Karak",
  appIcon: "/Salam_Logomark_Black.svg",
  appUrl: "",
  projectId: scaffoldConfig.walletConnectProjectId,
});

export const transports = {
  [mainnet.id]: fallback([http(mainRPCs[mainnet.id]), http(fallbackRPCs[mainnet.id])]),
  [arbitrum.id]: fallback([http(mainRPCs[arbitrum.id]), http(fallbackRPCs[arbitrum.id])]),
  [karak.id]: fallback([http(mainRPCs[karak.id]), http(fallbackRPCs[karak.id])]),
};

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, karak],
  transports: transports,
  connectors,
});
