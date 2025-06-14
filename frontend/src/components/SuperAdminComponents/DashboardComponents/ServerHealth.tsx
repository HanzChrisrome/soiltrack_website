import { Calendar, GitGraph, InfoIcon } from "lucide-react";
import { useDashboardStore } from "../../../store/SuperAdminStore/useDashboardStore";
import { parseTimestamp } from "../../../utils/TimeParser";
import CardContainer from "../../widgets/CardContainer";
import { GreenToggleSelector, TooltipIcon } from "../../widgets/Widgets";
import ReusableMetricChart from "./ReusableComponents/ServerMetrics";

const ServerHealth = () => {
  const metrics = useDashboardStore((s) => s.realTimeMetrics);

  const timestamps = metrics.map((m) =>
    parseTimestamp(m.timestamp).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );

  const cpuData = metrics.map((m) => parseFloat(m.cpu_usage.toFixed(2)));

  const freeMemorySlice = metrics
    .slice(-5) // get last 5 entries
    .map((m) => parseFloat((m.free_memory / 1024).toFixed(2)));

  const freeMemoryTimestamps = metrics.slice(-5).map((m) =>
    parseTimestamp(m.timestamp).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );

  return (
    <>
      <div className="items-center flex justify-between mt-9">
        <div className="flex items-center space-x-3">
          <CardContainer padding="p-1">
            <GitGraph className="w-5 h-5 text-neutral" />
          </CardContainer>
          <h1 className="text-2xl font-semibold leading-tight text-neutral-800">
            Server Metrics Graph
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {}}
            className="bg-base-100 border border-base-200 hover:bg-base-200 transition-all duration-200 text-neutral-900 flex items-center gap-2 rounded-full py-1 pl-1 pr-5 shadow-sm"
          >
            <span className="bg-base-200 text-neutral-800 rounded-full p-2">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-sm font-medium">Filter by Date</span>
          </button>
          <GreenToggleSelector
            options={["Today", "Weekly", "Monthly", "Yearly"]}
            selected="Today"
            onSelect={() => {}}
            labelMap={{ CPU: "CPU Usage", Memory: "Free Memory" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch gap-5 mt-6">
        <CardContainer className="col-span-1 md:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-medium leading-tight text-neutral-800">
                CPU Usage Metrics
              </h1>
              <TooltipIcon
                content="This metric shows real-time CPU utilization over time."
                icon={<InfoIcon className="w-5 h-5" />}
              />
            </div>
          </div>
          <ReusableMetricChart
            timestamps={timestamps}
            data={cpuData}
            label="CPU Usage"
            color="#22c55e"
          />
        </CardContainer>
        <CardContainer className=" flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-medium leading-tight text-neutral-800">
                Free Memory Metrics
              </h1>
              <TooltipIcon
                content="This metric shows real-time CPU utilization over time."
                icon={<InfoIcon className="w-5 h-5" />}
              />
            </div>
          </div>
          <ReusableMetricChart
            timestamps={freeMemoryTimestamps}
            data={freeMemorySlice}
            label="CPU Usage"
            color="#22c55e"
          />
        </CardContainer>
      </div>
    </>
  );
};

export default ServerHealth;
