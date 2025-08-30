export interface Announcement {
  id: string;
  title: string;
  message: string;
  scope: "all" | "specific";
  recipient_ids: string[];
  recipients: string[]; // resolved names from DB
  sender_id: string;
  created_at: string;
}

export interface AnnouncementInput {
  title: string;
  message: string;
  scope: "all" | "specific";
  recipient_ids?: string[];
  sender_id: string;
}
