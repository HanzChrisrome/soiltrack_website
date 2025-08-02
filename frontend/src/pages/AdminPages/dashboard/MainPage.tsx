// 3rd Party
import { ArrowUpRight, Cpu, Grid2X2, UserCheck } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";

// Components
import CardContainer from "../../../components/widgets/CardContainer";
import { useAuthStore } from "../../../store/useAuthStore";

// Assets
import AreaPerformancesCard from "../../../components/AdminComponents/MainPage/RadarChart";
import GradientHeading from "../../../components/widgets/GradientComponent";
import PerformanceView from "../../../components/AdminComponents/MainPage/PerformanceView";
import { useMainPageHook } from "../../../hooks/useMainPage";
import { useReadingStore } from "../../../store/AdminStore/useReadingStore";
import { useUserStore } from "../../../store/AdminStore/useUserStore";
import useUserPageHook from "../../../hooks/useUserPage";

const MainPage = () => {
  const { authUser } = useAuthStore();
  useMainPageHook();
  useUserPageHook();

  const { userPlots, analysisGeneratedCount } = useReadingStore();
  const { userSummary } = useUserStore();

  return (
    <div className="py-5">
      <div className="items-start">
        <GradientHeading className="text-4xl text-neutral-800 font-bold leading-tight">
          Hi, {authUser?.user_fname?.split(" ")[0] || ""}{" "}
          {authUser?.user_lname || ""}
        </GradientHeading>
        <p className="text-sm text-neutral leading-tight">
          Here’s a quick overview of the plots.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
        <CardContainer className="flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start">
              <p className="text-xl font-semibold text-primary mb-2 leading-none">
                Total Plots
              </p>
              <span className="text-xs w-3/4 font-normal text-neutral">
                Total plots that belong and is associated to your municipality
                in{" "}
                {`${
                  authUser?.user_municipality
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase()) || ""
                }
            `}
              </span>
            </div>
            <ArrowUpRight className="w-8 h-8 text-primary cursor-pointer" />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <GradientHeading className="text-6xl font-bold">
                {userPlots?.length || 0}
              </GradientHeading>
            </div>
            <CardContainer padding="p-2">
              <Grid2X2 className="w-8 h-8 text-primary" />
            </CardContainer>
          </div>
        </CardContainer>
        <CardContainer className="flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start">
              <p className="text-lg font-semibold text-primary mb-2 leading-none">
                Total Users
              </p>
              <span className="text-xs w-3/4 font-normal text-neutral">
                Total users that belong and is associated to your municipality
                in{" "}
                {`${
                  authUser?.user_municipality
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase()) || ""
                }
            `}
              </span>
            </div>
            <ArrowUpRight className="w-8 h-8 text-primary cursor-pointer" />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <GradientHeading className="text-6xl font-bold">
                {userSummary?.length || 0}
              </GradientHeading>
            </div>
            <CardContainer padding="p-2">
              <UserCheck className="w-8 h-8 text-primary" />
            </CardContainer>
          </div>
        </CardContainer>
        <CardContainer className="flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start">
              <p className="text-lg font-semibold text-primary mb-2 leading-none">
                Total IOT Devices
              </p>
              <span className="text-xs w-3/4 font-normal text-neutral">
                Total IOT devices that is distributed and is associated to your
                municipality in{" "}
                {`${
                  authUser?.user_municipality
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase()) || ""
                }
            `}
              </span>
            </div>
            <ArrowUpRight className="w-8 h-8 text-primary cursor-pointer" />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <GradientHeading className="text-6xl font-bold">
                {userSummary?.length || 0}
              </GradientHeading>
            </div>
            <CardContainer padding="p-2">
              <Cpu className="w-8 h-8 text-primary" />
            </CardContainer>
          </div>
        </CardContainer>
        <CardContainer className="flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start">
              <p className="text-lg font-semibold text-primary mb-2 leading-none">
                Users that generated analysis
              </p>
              <span className="text-xs w-3/4 font-normal text-neutral">
                Total users that generated analysis and is associated to your
                municipality in{" "}
                {`${
                  authUser?.user_municipality
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase()) || ""
                }
            `}
              </span>
            </div>
            <ArrowUpRight className="w-8 h-8 text-primary cursor-pointer" />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <GradientHeading className="text-6xl font-bold">
                {analysisGeneratedCount || 0}
              </GradientHeading>
            </div>
            <CardContainer padding="p-2">
              <Cpu className="w-8 h-8 text-primary" />
            </CardContainer>
          </div>
        </CardContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-2 mt-2">
        <CardContainer padding="p-6" className="flex flex-col h-full">
          <AreaPerformancesCard />
        </CardContainer>
        <div className="col-span-1 md:col-span-2 flex flex-col h-full">
          <PerformanceView />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
