import { NotificationInput } from "../../models/notificationModels";
import { useNotificationStore } from "../../store/AdminStore/useNotificationStore";

export const notificationService = {
  fetchNotifications: async (userId: string) => {
    await useNotificationStore.getState().fetchNotifications(userId);
  },

  sendNotification: async (data: NotificationInput) => {
    await useNotificationStore.getState().sendNotification(data);
  },
};
