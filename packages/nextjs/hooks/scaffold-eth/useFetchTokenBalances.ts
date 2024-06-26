import { useCallback, useMemo } from "react";
import { multicall } from "@wagmi/core";
import { Abi } from "viem";
import ERC20 from "~~/contracts/abis/ERC20.json";
import { mainRPCs } from "~~/services/web3/chainData";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { ContractMapping } from "~~/types/utils";
import { assetList } from "~~/utils/constants";

export function useTokenBalances(account: `0x${string}`) {
  const contractDetails: ContractMapping[] = useMemo(() => {
    if (!account) return [];

    return assetList.map(asset => ({
      contract: {
        address: asset.address as `0x${string}`,
        abi: ERC20 as Abi,
        functionName: "balanceOf",
        args: [account],
      },
      chainId: asset.network,
    }));
  }, [account]);

  const approvalDetails: ContractMapping[] = useMemo(() => {
    if (!account) return [];

    return assetList.map(asset => ({
      contract: {
        address: asset.address as `0x${string}`,
        abi: ERC20 as Abi,
        functionName: "allowance",
        args: [account, asset.vault],
      },
      chainId: asset.network,
    }));
  }, [account]);

  const fetchBalances = useCallback(async () => {
    if (contractDetails.length === 0) return [];
    if (approvalDetails.length === 0) return [];

    const chainIds = contractDetails.map(({ chainId }) => chainId);
    const uniqueChainIds = [...new Set(chainIds)];

    const chainIdToContracts = uniqueChainIds.map(chainId => ({
      chainId: chainId as keyof typeof mainRPCs,
      contracts: contractDetails.filter(detail => detail.chainId === chainId),
    }));

    const chainIdToApprovalCalls = uniqueChainIds.map(chainId => ({
      chainId: chainId as keyof typeof mainRPCs,
      contracts: approvalDetails.filter(detail => detail.chainId === chainId),
    }));

    const balances: any = {};
    const allowances: any = {};
    for (const chainId of uniqueChainIds) {
      balances[chainId] = {};
      allowances[chainId] = {};
    }

    await Promise.all(
      chainIdToApprovalCalls.map(async ({ chainId, contracts }) => {
        const contractsForChain = contracts.map(({ contract }) => contract);

        try {
          const results = await multicall(wagmiConfig, {
            contracts: contractsForChain,
            chainId,
          });

          contractsForChain.map(
            (contract, index) => (allowances[chainId][contract.address] = results[index].result ?? "0"),
          );
          return allowances;
        } catch (error: any) {
          console.error(`Failed to fetch data for chainId ${chainId}:`, error);
          return { success: false, chainId, error: error.message };
        }
      }),
    );

    await Promise.all(
      chainIdToContracts.map(async ({ chainId, contracts }) => {
        const contractsForChain = contracts.map(({ contract }) => contract);

        try {
          const results = await multicall(wagmiConfig, {
            contracts: contractsForChain,
            chainId,
          });

          contractsForChain.map(
            (contract, index) => (balances[chainId][contract.address] = results[index].result ?? "0"),
          );
          return balances;
        } catch (error: any) {
          console.error(`Failed to fetch data for chainId ${chainId}:`, error);
          return { success: false, chainId, error: error.message };
        }
      }),
    );
    return { balances, allowances };
  }, [account]);

  return fetchBalances;
}
