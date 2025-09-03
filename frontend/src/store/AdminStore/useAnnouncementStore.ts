import { create } from "zustand";
import supabase from "../../lib/supabase";
import {
  Announcement,
  AnnouncementInput,
} from "../../models/announcementModels";
import { useUserStore } from "./useUserStore";

interface AnnouncementState {
  announcements: Announcement[];
  loading: boolean;
  fetchAnnouncements: (userId: string) => Promise<void>;
  sendAnnouncement: (data: AnnouncementInput) => Promise<void>;
  archiveAnnouncement: (id: string, sender_id: string) => Promise<void>;
  updateAnnouncement: (
    id: string,
    updates: Partial<AnnouncementInput>,
    sender_id: string
  ) => Promise<void>;
}

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
  announcements: [],
  loading: false,

  fetchAnnouncements: async (userId: string) => {
    set({ loading: true });
    try {
      const { data: announcementsData, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("sender_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("📢 Announcements fetched:", announcementsData);

      if (!announcementsData?.length) {
        set({ announcements: [] });
        return;
      }

      const announcementIds = announcementsData.map((a: any) => String(a.id));

      const { data: recipientsData, error: recipsError } = await supabase
        .from("announcement_recipients")
        .select("announcement_id, recipient_id")
        .in("announcement_id", announcementIds);

      if (recipsError) throw recipsError;

      console.log("👥 Recipients fetched:", recipientsData);

      const { userSummary } = useUserStore.getState();

      const formatted: Announcement[] = announcementsData.map((a: any) => {
        const recipient_ids = recipientsData
          .filter((r: any) => String(r.announcement_id) === String(a.id))
          .map((r: any) => r.recipient_id);

        const recipients = recipient_ids
          .map((id) => {
            const user = userSummary.find((u) => u.user_id === id);
            return user ? `${user.user_name}` : "Unknown";
          })
          .filter(Boolean);

        return {
          ...a,
          recipient_ids,
          recipients,
          type: a.type,
          status: a.status,
          expiry: a.expiry,
        };
      });

      set({ announcements: formatted });
    } catch (err) {
      console.error("❌ Error fetching announcements:", err);
    } finally {
      set({ loading: false });
    }
  },

  sendAnnouncement: async ({
    title,
    message,
    scope,
    recipient_ids,
    sender_id,
    type,
    status = "active",
    expiry,
  }) => {
    set({ loading: true });
    try {
      const { data: ann, error: annError } = await supabase
        .from("announcements")
        .insert([
          {
            title,
            message,
            scope,
            sender_id,
            type,
            status,
            expiry,
          },
        ])
        .select()
        .single();

      if (annError) throw annError;

      if (scope === "specific" && recipient_ids?.length) {
        const recipientsData = recipient_ids.map((id) => ({
          announcement_id: ann.id,
          recipient_id: id,
        }));

        console.log("📝 Inserting recipients:", recipientsData);

        const { error: recipsError } = await supabase
          .from("announcement_recipients")
          .insert(recipientsData);

        if (recipsError) throw recipsError;
      }

      await useAnnouncementStore.getState().fetchAnnouncements(sender_id);
    } catch (err) {
      console.error("❌ Error sending announcement:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  archiveAnnouncement: async (id, sender_id) => {
    set({ loading: true });
    try {
      // Only update status field
      const allowedUpdates = { status: "Archived" };

      console.log("📦 Archiving announcement:", id, allowedUpdates);

      const { error } = await supabase
        .from("announcements")
        .update(allowedUpdates)
        .eq("id", id); // only filter by id (RLS already protects ownership)

      if (error) throw error;

      // Refresh list
      await useAnnouncementStore.getState().fetchAnnouncements(sender_id);
    } catch (err) {
      console.error("❌ Error archiving announcement:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateAnnouncement: async (id, updates, sender_id) => {
    set({ loading: true });
    try {
      // Only keep the fields that exist in announcements
      const allowedUpdates = (({ title, message, type, status, expiry }) => ({
        title,
        message,
        type,
        status,
        expiry,
      }))(updates);

      // 🧹 Remove keys with undefined values
      Object.keys(allowedUpdates).forEach((key) => {
        if (allowedUpdates[key as keyof typeof allowedUpdates] === undefined) {
          delete allowedUpdates[key as keyof typeof allowedUpdates];
        }
      });

      console.log("🔍 Cleaned update payload:", allowedUpdates);

      const { error } = await supabase
        .from("announcements")
        .update(allowedUpdates)
        .eq("id", id); // or "announcement_id" if that's your PK

      if (error) throw error;

      await useAnnouncementStore.getState().fetchAnnouncements(sender_id);
    } catch (err) {
      console.error("❌ Error updating announcement:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
