"use client";

import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

export const RainbowKitCustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();
  const { address: connectedAddress } = useAccount();
  const blockExplorerAddressLink = connectedAddress
    ? getBlockExplorerAddressLink(targetNetwork, connectedAddress)
    : undefined;

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        return (
          <>
            {!connected ? (
              <div
                className="w-fit ml-auto border border-2 border-orange-500 py-2 px-4 cursor-pointer hover:bg-white/[.1] transition duration-300"
                onClick={openConnectModal}
              >
                connect
              </div>
            ) : chain.unsupported || chain.id !== targetNetwork.id ? (
              <WrongNetworkDropdown />
            ) : (
              <>
                <AddressInfoDropdown
                  address={account.address as Address}
                  displayName={account.displayName}
                  ensAvatar={account.ensAvatar}
                  blockExplorerAddressLink={blockExplorerAddressLink}
                />
                <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />
              </>
            )}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
