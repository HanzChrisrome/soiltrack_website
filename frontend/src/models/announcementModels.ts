export interface Announcement {
  id: string;
  title: string;
  message: string;
  scope: "all" | "specific";
  sender_id: string;
  recipient_ids: string[];
  recipients: string[];
  created_at: string;
  type: string; // "Information" | "Warning" | etc
  status: string; // "Ongoing" | "Expired" | "Archived"
  expiry: string | null; // ISO date string
}

export interface AnnouncementInput {
  title: string;
  message: string;
  scope: "all" | "specific";
  recipient_ids?: string[];
  sender_id: string;
  type: string;
  status?: string;
  expiry?: string | null;
}
