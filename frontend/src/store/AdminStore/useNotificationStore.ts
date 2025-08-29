import { create } from "zustand";
import supabase from "../../lib/supabase";
import {
  Notification,
  NotificationInput,
} from "../../models/notificationModels";
import { useUserStore } from "./useUserStore";

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  fetchNotifications: (userId: string) => Promise<void>;
  sendNotification: (data: NotificationInput) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async (userId: string) => {
    set({ loading: true });
    try {
      const { data: notificationsData, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("sender_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("📢 Notifications fetched:", notificationsData);

      if (!notificationsData?.length) {
        set({ notifications: [] });
        return;
      }

      const notificationIds = notificationsData.map((n: any) => String(n.id));

      const { data: recipientsData, error: recipsError } = await supabase
        .from("notification_recipients")
        .select("notification_id, recipient_id")
        .in("notification_id", notificationIds);

      if (recipsError) throw recipsError;

      console.log("👥 Recipients fetched:", recipientsData);

      const { userSummary } = useUserStore.getState();
      console.log("📒 userSummary from store:", userSummary);

      const formatted: Notification[] = notificationsData.map((notif: any) => {
        const recipient_ids = recipientsData
          .filter((r: any) => String(r.notification_id) === String(notif.id))
          .map((r: any) => r.recipient_id);

        console.log(
          "📌 For notif",
          notif.id,
          "recipients found:",
          recipient_ids
        );

        const recipients = recipient_ids
          .map((id) => {
            const user = userSummary.find((u) => u.user_id === id);
            console.log("🔎 Mapping recipient_id → user:", id, user);
            return user ? `${user.user_name}` : "Unknown";
          })
          .filter(Boolean);

        return {
          ...notif,
          recipient_ids,
          recipients,
        };
      });

      set({ notifications: formatted });
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    } finally {
      set({ loading: false });
    }
  },

  sendNotification: async ({
    title,
    message,
    scope,
    recipient_ids,
    sender_id,
  }) => {
    set({ loading: true });
    try {
      const { data: notif, error: notifError } = await supabase
        .from("notifications")
        .insert([{ title, message, scope, sender_id }])
        .select()
        .single();

      if (notifError) throw notifError;

      if (scope === "specific" && recipient_ids?.length) {
        const recipientsData = recipient_ids.map((id) => ({
          notification_id: notif.id,
          recipient_id: id,
        }));

        console.log("📝 Inserting recipients:", recipientsData);

        const { error: recipsError } = await supabase
          .from("notification_recipients")
          .insert(recipientsData);

        if (recipsError) throw recipsError;
      }

      await useNotificationStore.getState().fetchNotifications(sender_id);
    } catch (err) {
      console.error("Error sending notification:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
