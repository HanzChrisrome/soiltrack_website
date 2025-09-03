// useAnnouncementPageHook.ts
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useAnnouncementStore } from "../store/AdminStore/useAnnouncementStore";

const useAnnouncementPageHook = () => {
  const { authUser } = useAuthStore();
  const { announcements, fetchAnnouncements } = useAnnouncementStore();

  useEffect(() => {
    if (!authUser?.user_id) return;

    // ✅ Only fetch if we don't already have announcements loaded
    if (announcements.length === 0) {
      fetchAnnouncements(authUser.user_id);
    }
  }, [authUser?.user_id, announcements.length, fetchAnnouncements]);
};

export default useAnnouncementPageHook;
