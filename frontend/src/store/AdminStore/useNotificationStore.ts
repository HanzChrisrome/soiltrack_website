// useNotificationStore.ts (sendNotification)
import { create } from "zustand";
import supabase from "../../lib/supabase";
import { Notification } from "../../models/notificationModels";

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  fetchNotifications: (userId: string) => Promise<void>;
  sendNotification: (data: {
    title: string;
    message: string;
    scope: "all" | "specific";
    recipient_ids: string[];
    sender_id: string;
  }) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async (userId: string) => {
    set({ loading: true });

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          id,
          title,
          message,
          scope,
          sender_id,
          created_at,
          notification_recipients (recipient_id)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Flatten recipients into array
      const formatted = data.map((n) => ({
        ...n,
        recipient_ids:
          n.notification_recipients?.map((r) => r.recipient_id) || [],
      }));

      set({ notifications: formatted });
    } catch (err) {
      console.error("Supabase fetch error:", err);
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
      // Step 1: Insert into notifications
      const { data: notif, error: notifError } = await supabase
        .from("notifications")
        .insert([
          {
            title,
            message,
            scope,
            sender_id,
          },
        ])
        .select()
        .single();

      if (notifError) throw notifError;

      // Step 2: If specific, insert recipients
      if (scope === "specific" && recipient_ids.length > 0) {
        const recipientsData = recipient_ids.map((id) => ({
          notification_id: notif.id,
          recipient_id: id,
        }));

        const { error: recipsError } = await supabase
          .from("notification_recipients")
          .insert(recipientsData);

        if (recipsError) throw recipsError;
      }

      // Step 3: Refresh list
      await useNotificationStore.getState().fetchNotifications(sender_id);
    } catch (err) {
      console.error("Supabase insert error:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
