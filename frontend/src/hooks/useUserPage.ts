//useUserPage.ts
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/mun_admin/useUserStore";

const useUserPageHook = () => {
  const { authUser } = useAuthStore();
  const { fetchUserSummary } = useUserStore();

  const locationReady =
    !!authUser?.user_municipality && !!authUser?.user_province;

  useEffect(() => {
    if (!locationReady) return;

    fetchUserSummary(authUser.user_municipality, authUser.user_province);
  }, [authUser, fetchUserSummary, locationReady]);
};

export default useUserPageHook;
