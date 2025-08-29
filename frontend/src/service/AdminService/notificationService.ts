import supabase from "../../lib/supabase";
import {
  Notification,
  NotificationInput,
} from "../../models/notificationModels";

export const notificationService = {
  async fetchNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(`recipient_ids.cs.{${userId}},sender_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async sendNotification(input: NotificationInput): Promise<void> {
    const { error } = await supabase.from("notifications").insert([
      {
        title: input.title,
        message: input.message,
        scope: input.scope,
        recipient_ids: input.recipient_ids ?? [],
        sender_id: input.sender_id,
      },
    ]);

    if (error) throw error;
  },
};
