"use client";

import DashboardTable from "./DashboardTable";
import { useReduceDashboardData } from "~~/hooks/scaffold-eth/useReduceDashboardData";

const Dashboard = () => {
  const dashboardData = useReduceDashboardData();

  return dashboardData ? (
    <>
      <div id="pattern" />
      <DashboardTable dashboardData={dashboardData} />
    </>
  ) : null;
};

export default Dashboard;
