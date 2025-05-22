// 3rd Party
import { Gauge } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";

// Components
import AreaPerformancesCard from "../../components/MainPage/RadarChart";
import Divider from "../../components/widgets/Divider";
import PerformanceCard from "../../components/AreaChart";
import CardContainer from "../../components/widgets/CardContainer";
import SoilDistributionCard from "../../components/MainPage/SoilDistributionCard";
import useMainPage from "../../hooks/useMainPage";

const MainPage = () => {
  const { overallAverage, soilTypes, cropTypes, plotPerformance } =
    useMainPage();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Good Morning!</h1>
          <p className="text-sm text-base-content/70">
            Optimize Your Farm Operations with Real-Time Insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="badge badge-warning text-sm p-4">
            ☀️ 24° Today is partly sunny day
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log(overallAverage);
            console.log(soilTypes);
            console.log(cropTypes);
            console.log(plotPerformance);
          }}
        >
          TESTING BUTTON FUCKERS
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-stretch h-full">
        {/* Left Column */}
        <CardContainer className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <Gauge className="h-6 text-primary" />
            <h2 className="text-xl text-primary font-semibold">
              Area Performances
            </h2>
          </div>
          <p className="text-sm font-light text-base-content/70">
            Here are the analyzed data plots.
          </p>
          <Divider dashed className="my-3" />
          <div className="flex-1">
            <AreaPerformancesCard />
          </div>
        </CardContainer>

        {/* Right Column */}
        <div className="col-span-3 h-full flex flex-col">
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 flex-1">
            <SoilDistributionCard soilData={soilTypes ?? []} />

            <CardContainer padding="p-10 items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-base-content/70 ">
                    Most Common Crop Type
                  </p>
                  <h3 className="text-2xl font-bold text-primary">Clay Soil</h3>
                  <p className="text-xs text-base-content/70">
                    78% in your area is using this soil type.
                  </p>
                </div>

                <div className="hidden md:block overflow-x-auto ">
                  <table className="table table-xs">
                    <thead>
                      <tr className="text-xs text-base-content/60">
                        <th>Soil Type</th>
                        <th className="text-right">Usage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Loam</td>
                        <td className="text-right">12%</td>
                      </tr>
                      <tr>
                        <td>Sandy</td>
                        <td className="text-right">7%</td>
                      </tr>
                      <tr>
                        <td>Silt</td>
                        <td className="text-right">3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContainer>
          </div>

          {/* First Row */}
          <div className="grid grid-cols-2 gap-2">
            {plotPerformance?.most_improved && (
              <PerformanceCard
                title="Area's with Good Performances"
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
                location={`${plotPerformance?.most_improved?.location}, ${plotPerformance?.most_improved?.user_municipality}`}
                badgeText="Good"
                badgeStyle="badge-success"
              />
            )}
            {plotPerformance?.least_improved && (
              <PerformanceCard
                title="Area's with Decreased Performances"
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
                location={`${plotPerformance?.least_improved?.location}, ${plotPerformance?.least_improved?.user_municipality}`}
                badgeText="Good"
                badgeStyle="badge-success"
              />
            )}
          </div>
        </div>
      </div>

      {/* <CardContainer className="mt-3">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 text-base-content text-sm">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">Juan Dela Cruz</td>
              <td>juan@example.com</td>
              <td>Admin</td>
              <td>
                <span className="badge badge-success text-xs">Active</span>
              </td>
              <td className="text-right space-x-2">
                <button className="btn btn-xs btn-outline btn-info">
                  Edit
                </button>
                <button className="btn btn-xs btn-outline btn-error">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td className="font-medium">Maria Santos</td>
              <td>maria@example.com</td>
              <td>User</td>
              <td>
                <span className="badge badge-warning text-xs">Pending</span>
              </td>
              <td className="text-right space-x-2">
                <button className="btn btn-xs btn-outline btn-info">
                  Edit
                </button>
                <button className="btn btn-xs btn-outline btn-error">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td className="font-medium">Jose Rizal</td>
              <td>rizal@example.com</td>
              <td>Moderator</td>
              <td>
                <span className="badge badge-error text-xs">Disabled</span>
              </td>
              <td className="text-right space-x-2">
                <button className="btn btn-xs btn-outline btn-info">
                  Edit
                </button>
                <button className="btn btn-xs btn-outline btn-error">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContainer> */}
    </div>
  );
};

export default MainPage;
