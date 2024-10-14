import { assetList, networkMap } from "../../utils/constants";
import { formatBigInt } from "../../utils/utils";

const DashboardTable = ({ dashboardData }: { dashboardData: Record<string, any> }) => {
  const combinedData = assetList.map(asset => {
    const data = dashboardData[asset.address];
    return {
      ...asset,
      staked: data ? Number(formatBigInt(data.vaultBalance, asset.decimals)) : 0,
      available: data ? Number(formatBigInt(data.tokenBalance, asset.decimals)) : 0,
    };
  });
  const sortedData = combinedData.sort((a, b) => b.staked - a.staked || b.available - a.available);

  return (
    <div className="relative mx-4 md:mx-12">
      <div className="mt-[3rem] xl:mt-[10rem] border border-black border-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#cebdba] sticky top-0 border-b-2 border-black">
              <tr>
                <th scope="col" className="py-3 px-4 md:px-6 w-2/5">
                  Asset
                </th>
                <th scope="col" className="py-3 px-4 md:px-6 w-1/5 text-center">
                  Staked
                </th>
                <th scope="col" className="py-3 px-4 md:px-6 w-1/5 text-center">
                  Chain
                </th>
                <th scope="col" className="py-3 px-4 md:px-6 w-1/5 text-end">
                  Available To Stake
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody>
                {sortedData.map((item, index) => {
                  const isDisabled = item.staked === 0 && item.available === 0;
                  return (
                    <tr key={index} className="bg-[#cebdba] border-b border-black">
                      <td className={`w-2/5 py-4 px-4 md:px-6 ${isDisabled ? "opacity-50" : ""}`}>{item.symbol}</td>
                      <td className={`w-1/5 py-4 px-4 md:px-6 text-center ${isDisabled ? "opacity-50" : ""}`}>
                        {item.staked}
                      </td>
                      <td className={`w-1/5 py-4 px-4 md:px-6 text-center ${isDisabled ? "opacity-50" : ""}`}>
                        {networkMap[item.network]}
                      </td>
                      <td className={`w-1/5 py-4 px-4 md:px-6 text-end ${isDisabled ? "opacity-50" : ""}`}>
                        {item.available}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-2">Scroll to see more assets</div>
    </div>
  );
};

export default DashboardTable;
