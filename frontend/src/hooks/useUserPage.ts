//useUserPage.ts
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

const useUserPageHook = () => {
  const { authUser } = useAuthStore();
  const { userSummary, fetchUserSummary } = useUserStore();

  const locationReady =
    !!authUser?.user_municipality && !!authUser?.user_province;

  useEffect(() => {
    if (!locationReady) return;
    if (userSummary && userSummary.length > 0) return;

    fetchUserSummary(authUser.user_municipality, authUser.user_province);
  }, [authUser, locationReady, userSummary, fetchUserSummary]);

  return {
    userSummary,
  };
};

export default useUserPageHook;
