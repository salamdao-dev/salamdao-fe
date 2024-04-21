import type { NextPage } from "next";

const Dashboard: NextPage = () => {
  const data = [
    { asset: "ETH", staked: "1.5", chain: "Ethereum", availableToStake: "0.5" },
    { asset: "USDC", staked: "10", chain: "K2", availableToStake: "5" },
    { asset: "rswETH", staked: "1000", chain: "Arbitrum", availableToStake: "500" },
  ];

  return (
    <>
      <div id="pattern" />
      <table className="mt-[10rem] mx-12 text-left border border-black">
        <thead className="bg-[#cebdba]">
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
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="bg-[#cebdba] border border-black">
              <td className="py-4 px-6">{item.asset}</td>
              <td className="py-4 px-6 text-center">{item.staked}</td>
              <td className="py-4 px-6 text-center">{item.chain}</td>
              <td className="py-4 px-6 text-end">{item.availableToStake}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Dashboard;
