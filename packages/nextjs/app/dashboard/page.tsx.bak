"use client";

import DashboardTable from "./DashboardTable";
import { useReduceDashboardData } from "~~/hooks/scaffold-eth/useReduceDashboardData";

const Dashboard = () => {
  const dashboardData = useReduceDashboardData();

  return dashboardData ? (
    <>
      <div className="background-combo" />
      <DashboardTable dashboardData={dashboardData} />
    </>
  ) : null;
};

export default Dashboard;
