import { assetList, networkMap } from "../../utils/constants";
import { formatBigInt } from "../../utils/utils";

const DashboardTable = ({ dashboardData }: { dashboardData: Record<string, any> }) => {
  // Combine assetList and dashboardData
  const combinedData = assetList.map(asset => {
    const data = dashboardData[asset.address];
    return {
      ...asset,
      staked: data ? Number(formatBigInt(data.vaultBalance, asset.decimals)) : 0,
      available: data ? Number(formatBigInt(data.tokenBalance, asset.decimals)) : 0,
    };
  });

  // Sort combined data by staked and available amounts
  const sortedData = combinedData.sort((a, b) => b.staked - a.staked || b.available - a.available);

  return (
    <div className="relative mx-12">
      <div className="mt-[10rem] border border-black overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#cebdba] sticky top-0">
            <tr>
              <th scope="col" className="py-3 px-6 w-2/5">
                Asset
              </th>
              <th scope="col" className="py-3 px-6 w-7/20 text-center">
                Staked
              </th>
              <th scope="col" className="py-3 px-6 w-7/20 text-center">
                Chain
              </th>
              <th scope="col" className="py-3 px-6 w-7/20 text-end">
                Available To Stake
              </th>
            </tr>
          </thead>
        </table>
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left">
            <tbody>
              {sortedData.map((item, index) => {
                const isDisabled = item.staked === 0 && item.available === 0;
                return (
                  <tr key={index} className={`bg-[#cebdba] border-b border-black ${isDisabled ? "opacity-50" : ""}`}>
                    <td className="py-4 px-6">{item.symbol}</td>
                    <td className="py-4 px-6 text-center">{item.staked}</td>
                    <td className="py-4 px-6 text-center">{networkMap[item.network]}</td>
                    <td className="py-4 px-6 text-end">{item.available}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-2">Scroll to see more assets</div>
    </div>
  );
};

export default DashboardTable;
