import { AnnouncementInput } from "../../models/announcementModels";
import { useAnnouncementStore } from "../../store/AdminStore/useAnnouncementStore";

export const announcementService = {
  fetchAnnouncements: async (userId: string) => {
    await useAnnouncementStore.getState().fetchAnnouncements(userId);
  },

  sendAnnouncement: async (data: AnnouncementInput) => {
    await useAnnouncementStore.getState().sendAnnouncement(data);
  },
};
