"use client";

import { useCallback, useEffect } from "react";
import { useTokenBalances } from "../../../hooks/scaffold-eth/useFetchTokenBalances";
import { useVaultBalances } from "../../../hooks/scaffold-eth/useFetchVaultStakes";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { Address, zeroAddress } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

export const RainbowKitCustomConnectButton = () => {
  // useAutoConnect();
  const { targetNetwork } = useTargetNetwork();
  const { signMessage, data: signMessageData } = useSignMessage();
  const { address: connectedAddress } = useAccount();
  const blockExplorerAddressLink = connectedAddress
    ? getBlockExplorerAddressLink(targetNetwork, connectedAddress)
    : undefined;

  const { setVaultBalances, referrals, nonce, setNonce, setReferrals, setTokenBalances } = useGlobalState(state => ({
    setVaultBalances: state.setVaultBalances,
    referrals: state.referrals,
    nonce: state.nonce,
    setNonce: state.setNonce,
    setReferrals: state.setReferrals,
    setTokenBalances: state.setTokenBalances,
  }));

  const fetchBalances = useTokenBalances(connectedAddress as `0x${string}`);
  const fetchVaultBalances = useVaultBalances((connectedAddress as `0x${string}`) ?? zeroAddress);

  const checkReferrals = useCallback(async (): Promise<any> => {
    const urlData = `batch=1&input=%7B"0"%3A%7B"wallet"%3A"${connectedAddress}"%7D%7D`;
    const url = `https://restaking-backend.karak.network/getReferrals?${urlData}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return { error: true, message: error.message, details: error.response?.data };
      } else {
        return { error: true, message: "An unknown error occurred" };
      }
    }
  }, [connectedAddress]);

  useEffect(() => {
    if (!connectedAddress) {
      setTokenBalances([]);
      setVaultBalances({});
      return;
    }

    const startRegisterWallet = async (): Promise<any> => {
      const url = "https://restaking-backend.karak.network/startRegisterWallet";
      const data = { referralCode: "SALAM" };

      try {
        const response = await axios.post(url, data);
        return response.data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          return { error: true, message: error.message, details: error.response?.data };
        } else {
          return { error: true, message: "An unknown error occurred" };
        }
      }
    };

    checkReferrals().then(data => {
      if (data.error) {
        startRegisterWallet().then(data => {
          if (data.error) {
            console.error(data.message);
            return;
          }
          setNonce({
            message: data.result.data.message,
            walletDraftId: data.result.data.walletDraftId,
          });
        });
        return;
      } else {
        setReferrals(data[0].result.data);
      }
    });
  }, [connectedAddress, checkReferrals, setNonce, setReferrals, setTokenBalances, setVaultBalances]);

  useEffect(() => {
    if (!connectedAddress) {
      setTokenBalances([]);
      return;
    }

    const updateBalances = async () => {
      const balances = await fetchBalances();
      console.log(balances);
      const vaultBalances = await fetchVaultBalances();
      setTokenBalances(balances);
      setVaultBalances(vaultBalances);
    };

    updateBalances();

    // const intervalId = setInterval(updateBalances, 60000); // Refresh once a minute

    // return () => clearInterval(intervalId);
  }, [connectedAddress, fetchBalances, fetchVaultBalances, setTokenBalances, setVaultBalances]);

  useEffect(() => {
    if (!signMessageData) return;

    const finishRegisterWallet = async () => {
      try {
        await axios.post("https://restaking-backend.karak.network/finishRegisterWallet", {
          walletDraftId: nonce.walletDraftId,
          signature: signMessageData,
          wallet: connectedAddress,
        });
        const data = await checkReferrals();
        if (data.error) {
          console.error(data.message);
          return;
        }
        setReferrals(data[0].result.data);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error(error.message, error.response?.data);
        } else {
          console.error("An unknown error occurred");
        }
      }
    };

    finishRegisterWallet();
  }, [signMessageData, nonce, connectedAddress, checkReferrals, setReferrals]);

  const signNonceMessage = () => {
    signMessage({ message: nonce.message });
  };

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
            ) : referrals.length === 0 ? (
              <div
                className="btn btn-sm bg-[#ff6a48] hover:bg-[#ff6a48]/[0.7] rounded-none border-0 pl-2 pr-2 dropdown-toggle gap-0 !h-auto"
                onClick={signNonceMessage}
              >
                register to stake
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
