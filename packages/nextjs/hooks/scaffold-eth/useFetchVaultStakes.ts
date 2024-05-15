import { useCallback } from "react";
import { assetList } from "../../utils/constants";
import { readContracts } from "@wagmi/core";
import { zeroAddress } from "viem";
import externalContracts from "~~/contracts/externalContracts";

export function useVaultBalances(account: `0x${string}`) {
  const fetchVaultBalances = useCallback(async () => {
    if (!account) return [];

    const chainIds = assetList.map(({ network }) => network);
    const uniqueChainIds = [...new Set(chainIds)];

    const readData = uniqueChainIds.map(chainId => {
      return {
        chainId,
        address: externalContracts[chainId].VaultSupervisor.address,
        abi: externalContracts[chainId].VaultSupervisor.abi,
        functionName: "getDeposits",
        args: [account],
      };
    });

    const finalData: Record<number, Record<string, Record<string, bigint>>> = {};

    const results = await readContracts({ contracts: readData });
    for (let i = 0; i < results.length; i++) {
      const { result, status } = results[i];
      if (!status || !result) {
        console.error("Error fetching vault stakes", result);
        finalData[uniqueChainIds[i]] = { [zeroAddress]: { [zeroAddress]: BigInt(0) } };
      } else {
        const typedResult = result as [string[], string[], number[]];
        if (typedResult[0].length > 0) {
          for (let j = 0; j < typedResult[0].length; j++) {
            if (!finalData[uniqueChainIds[i]]) {
              finalData[uniqueChainIds[i]] = {};
            }
            finalData[uniqueChainIds[i]][typedResult[1][j]] = { [typedResult[0][j]]: BigInt(typedResult[2][j]) };
          }
        } else {
          finalData[uniqueChainIds[i]] = { [zeroAddress]: { [zeroAddress]: BigInt(0) } };
        }
      }
    }
    return finalData;
  }, [account]);

  return fetchVaultBalances;
}
