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
                className="px-4 py-2  text-sm sm:text-base md:text-lg lg:text-3xl border border-[#FF3217] rounded-none"
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
