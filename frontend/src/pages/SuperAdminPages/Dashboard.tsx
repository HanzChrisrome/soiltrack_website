/* eslint-disable react-hooks/exhaustive-deps */
import "react-circular-progressbar/dist/styles.css";
import { useDashboardStore } from "../../store/SuperAdminStore/useDashboardStore";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import GradientHeading from "../../components/widgets/GradientComponent";
import ServerHealth from "../../components/SuperAdminComponents/DashboardComponents/ServerHealth";
import MetricCard from "../../components/SuperAdminComponents/DashboardComponents/ReusableComponents/MetricCard";
import { FileInput, Users2 } from "lucide-react";
import CardContainer from "../../components/widgets/CardContainer";

const DashboardPage = () => {
  const authUser = useAuthStore((s) => s.authUser);

  //FOR METRICS
  const databaseMetrics = useDashboardStore((s) => s.databaseMetrics);
  const latestMetric = databaseMetrics?.[0];
  const previousMetric = databaseMetrics?.[1];
  const fetchLiveMetric = useDashboardStore((s) => s.fetchLiveMetric);
  const fetchLatestMetrics = useDashboardStore((s) => s.fetchLatestMetrics);
  const lastFetchedAt = useDashboardStore((s) => s.lastFetchedAt);

  //FOR USERS DATA
  const fetchUsersData = useDashboardStore((s) => s.fetchUsersData);
  const usersData = useDashboardStore((s) => s.usersData);
  const onlineDevices = usersData.filter(
    (user) => user.device_status === "online"
  );

  useEffect(() => {
    fetchUsersData(authUser?.user_id || "");

    fetchLatestMetrics(10);
    fetchLiveMetric();

    const interval = setInterval(() => {
      fetchLiveMetric();
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-5">
      <div className="items-start flex flex-col">
        <h1 className="text-md font-normal text-neutral-800">Dashboard</h1>
        <div className="flex items-end justify-between w-full">
          <div className="flex flex-col">
            <GradientHeading className="text-4xl text-neutral-800 font-bold leading-tight mt-3">
              Hi, {authUser?.user_fname?.split(" ")[0] || ""}{" "}
              {authUser?.user_lname || ""}
            </GradientHeading>
            <p className="text-sm text-neutral leading-tight">
              Here’s an overview of the server metrics for your system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-base-100 flex items-center hover:bg-base-200 transition-all duration-200 space-x-2 border border-base-200 py-2 px-4 rounded-xl shadow-sm">
              <FileInput className="w-4 h-4" />
              <span className="text-sm font-medium"> Export </span>
            </button>
            <div className="bg-base-100 border border-base-200 text-neutral-900 flex items-center gap-2 rounded-lg py-2 px-5 shadow-sm">
              {lastFetchedAt && (
                <p className="text-sm text-neutral-600">
                  {lastFetchedAt.toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        {latestMetric && previousMetric ? (
          <>
            <MetricCard
              title="Free Memory"
              tooltip="Amount of available memory in GB."
              value={(latestMetric.free_memory / 1024).toFixed(2) + " GB"}
              diff={
                (latestMetric.free_memory - previousMetric.free_memory) / 1024
              }
            />
            <MetricCard
              title="Total Memory"
              tooltip="Total physical memory available to the system."
              value={(latestMetric.total_memory / 1024).toFixed(2) + " GB"}
              diff={
                (latestMetric.total_memory - previousMetric.total_memory) / 1024
              }
            />
            <MetricCard
              title="System Uptime"
              tooltip="Time since last system restart."
              value={(latestMetric.system_uptime / 3600).toFixed(1) + " hrs"}
              diff={
                (latestMetric.system_uptime - previousMetric.system_uptime) /
                3600
              }
            />
            <MetricCard
              title="Load Average"
              tooltip="Average system load over the last 1 minute."
              value={latestMetric.load_average.toFixed(2)}
              diff={latestMetric.load_average - previousMetric.load_average}
            />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <ServerHealth />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-3">
        <CardContainer className="col-span-1">
          <div className="flex items-center space-x-3 mb-4">
            <CardContainer
              padding="p-1"
              className="bg-primary border border-none"
            >
              <Users2 className="w-5 h-5 text-accent" />
            </CardContainer>
            <GradientHeading className="text-2xl font-semibold leading-tight">
              Active Devices
            </GradientHeading>
          </div>
          {onlineDevices.length > 0 ? (
            onlineDevices.map((user) => (
              <div
                key={user.user_id}
                className="bg-base-100 border border-base-200 p-4 rounded-lg shadow-sm mb-1"
              >
                <h2 className="text-md font-semibold text-neutral-800">
                  {user.user_name}
                </h2>
                <p className="text-sm text-neutral-600">
                  Email: {user.user_email}
                </p>
                <p className="text-sm text-neutral-600">
                  Address: {user.user_address}
                </p>
                <p className="text-sm text-neutral-600">
                  Device Status: {user.device_status}
                </p>
              </div>
            ))
          ) : (
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
              <p>No devices are active.</p>
            </div>
          )}
        </CardContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
