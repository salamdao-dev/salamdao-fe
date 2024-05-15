import { useEffect, useState } from "react";
import { zeroAddress } from "viem";
import { useGlobalState } from "~~/services/store/store";
import { assetMap } from "~~/utils/constants";

interface DashboardData {
  assetName: string;
  assetSymbol: string;
  chain: number;
  vault: `0x${string}`;
  vaultBalance: bigint;
  tokenBalance: bigint;
  decimals: number;
}

export const useReduceDashboardData = () => {
  const { tokenBalances, vaultBalances } = useGlobalState();
  const [dashboardData, setDashboardData] = useState<Record<`0x${string}`, DashboardData> | undefined>(undefined);

  useEffect(() => {
    const data: Record<`0x${string}`, DashboardData> = {};
    if (!vaultBalances) return;
    for (const chain of Object.keys(vaultBalances)) {
      if (!isNaN(chain as unknown as number)) {
        const chainId = parseInt(chain, 10);
        for (const asset in vaultBalances[chainId]) {
          if (asset === zeroAddress) continue;
          const addressString: `0x${string}` = asset as `0x${string}`;
          for (const vault in vaultBalances[chainId][addressString]) {
            const vaultBalance = vaultBalances[chainId][addressString][vault];
            const tokenBalance = tokenBalances?.[chainId]?.[addressString] ?? BigInt(0);
            data[addressString] = {
              assetName: assetMap[addressString].name,
              assetSymbol: assetMap[addressString].symbol,
              chain: chainId,
              vault: vault as `0x${string}`,
              vaultBalance,
              tokenBalance,
              decimals: assetMap[addressString].decimals,
            };
          }
        }
      }
    }
    setDashboardData(data);
  }, [tokenBalances, vaultBalances]);

  return dashboardData;
};
