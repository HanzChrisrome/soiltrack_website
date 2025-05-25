// 3rd Party
import { Car, CircleUserRound, Gauge, Tractor, User } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";

// Components
import AreaPerformancesCard from "../../components/MainPage/RadarChart";
import PerformanceCard from "../../components/AreaChart";
import CardContainer from "../../components/widgets/CardContainer";
import SoilDistributionCard from "../../components/MainPage/SoilDistributionCard";
import useMainPageHook from "../../hooks/useMainPage";
import { useAuthStore } from "../../store/useAuthStore";
import { Divider } from "../../components/widgets/Widgets";
import StatsCard from "../../components/MainPage/StatsCard";

// Assets
import containerBg from "/container background.png";
import PatientTable from "../../components/MainPage/Table";

const MainPage = () => {
  const {
    overallAverage,
    soilTypes,
    cropTypes,
    plotPerformance,
    userPlots,
    userSummary,
  } = useMainPageHook();

  const { authUser } = useAuthStore();

  return (
    <div className="h-full">
      <div className="w-full">
        <CardContainer
          padding="p-8"
          className="bg-cover bg-no-repeat bg-center text-base-100 rounded-xl mt-2"
          style={{
            backgroundImage: `url(${containerBg})`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
            <div className="flex flex-col gap-6 justify-between">
              <div className="items-start">
                <p className="text-sm text-accent leading-tight">Overview </p>
                <h1 className="text-3xl font-bold leading-normal">
                  Welcome back, {authUser?.user_fname}
                </h1>
                <p className="text-sm leading-tight">
                  Here’s a quick overview of the plots in your municipality.
                </p>
              </div>
              <div className="items-start">
                <p className="text-sm text-accent leading-tight">
                  MUNICIPALITY OF
                </p>
                <h1 className="text-2xl font-bold leading-normal">
                  {`${
                    authUser?.user_municipality
                      ?.toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase()) || ""
                  }, ${
                    authUser?.user_province
                      ?.toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase()) || ""
                  }`.trim()}
                </h1>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-accent leading-tight">
                Quick Summary Overview{" "}
              </p>
              <div className="flex flex-row gap-2">
                <StatsCard
                  icon={<Tractor className="w-6 h-6 text-accent" />}
                  label="Total Plots"
                  value={userPlots?.length || 0}
                />
                <StatsCard
                  icon={<CircleUserRound className="w-6 h-6 text-accent" />}
                  label="Total Users"
                  value={userSummary?.length || 0}
                />
              </div>
            </div>
          </div>
        </CardContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {/* {plotPerformance?.most_improved && (
          <div className="flex flex-col">
            <PerformanceCard
              title="Area with Improved Performance"
              plotOwner={plotPerformance?.most_improved?.user_name}
              plotName={plotPerformance?.most_improved?.location}
              chartSeries={[
                {
                  name: "Improvement",
                  data:
                    plotPerformance?.most_improved?.daily_averages.map(
                      (entry) => Math.floor(entry.total_avg)
                    ) ?? [],
                  color: "#3b82f6",
                },
              ]}
              chartCategories={
                plotPerformance?.most_improved?.daily_averages.map((entry) =>
                  new Date(entry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                ) ?? []
              }
              nutrientAverages={plotPerformance?.most_improved?.daily_averages.map(
                (entry) => ({
                  ...entry,
                  avg_moisture: entry.avg_moisture ?? 0,
                  avg_nitrogen: entry.avg_nitrogen ?? 0,
                  avg_phosphorus: entry.avg_phosphorus ?? 0,
                  avg_potassium: entry.avg_potassium ?? 0,
                })
              )}
            />
          </div>
        )} */}
        <div className="flex flex-col gap-4">
          <CardContainer className="flex">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                <h1 className="text-lg font-semibold text-primary">
                  Users List
                </h1>
              </div>
              <div className="form-control w-full md:w-48 relative">
                <input
                  type="text"
                  placeholder="Search by name"
                  className="input input-bordered input-sm w-full focus:outline-none focus:ring-0 pr-8"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
              </div>
            </div>
            <PatientTable />
          </CardContainer>
        </div>

        {plotPerformance?.least_improved && (
          <div className="flex flex-col">
            <PerformanceCard
              title="Area with Decreased Performance"
              plotOwner={plotPerformance?.least_improved?.user_name}
              plotName={plotPerformance?.least_improved?.location}
              chartSeries={[
                {
                  name: "Least Improvement",
                  data:
                    plotPerformance?.least_improved?.daily_averages.map(
                      (entry) => Math.floor(entry.total_avg)
                    ) ?? [],
                  color: "#ef4444",
                },
              ]}
              chartCategories={
                plotPerformance?.least_improved?.daily_averages.map((entry) =>
                  new Date(entry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                ) ?? []
              }
              nutrientAverages={plotPerformance?.least_improved?.daily_averages.map(
                (entry) => ({
                  ...entry,
                  avg_moisture: entry.avg_moisture ?? 0,
                  avg_nitrogen: entry.avg_nitrogen ?? 0,
                  avg_phosphorus: entry.avg_phosphorus ?? 0,
                  avg_potassium: entry.avg_potassium ?? 0,
                })
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
