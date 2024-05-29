import { fallbackRPCs, karak, mainRPCs } from "./chainData";
import { arbitrum, mainnet } from "viem/chains";
import { createConfig, fallback, http } from "wagmi";
import { coinbaseWallet, injected, safe, walletConnect } from "wagmi/connectors";
import scaffoldConfig from "~~/scaffold.config";

const wagmiConnectors = [
  injected(),
  walletConnect({
    projectId: scaffoldConfig.walletConnectProjectId,
  }),
  safe(),
  coinbaseWallet(),
];

export const transports = {
  [mainnet.id]: fallback([http(mainRPCs[mainnet.id]), http(fallbackRPCs[mainnet.id])]),
  [arbitrum.id]: fallback([http(mainRPCs[arbitrum.id]), http(fallbackRPCs[arbitrum.id])]),
  [karak.id]: fallback([http(mainRPCs[karak.id]), http(fallbackRPCs[karak.id])]),
};

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, karak],
  transports: transports,
  connectors: wagmiConnectors,
});
