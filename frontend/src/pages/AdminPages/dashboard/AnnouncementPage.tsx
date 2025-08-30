import { useState, useEffect } from "react";
import { X, PlusIcon } from "lucide-react";
import GradientHeading from "../../../components/widgets/GradientComponent";
import useUserPageHook from "../../../hooks/useUserPage";
import { useUserStore } from "../../../store/AdminStore/useUserStore";
import { useAnnouncementStore } from "../../../store/AdminStore/useAnnouncementStore";
import { useAuthStore } from "../../../store/useAuthStore";

// Modal Component
const Modal = ({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center p-6 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div
        className={`relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6 z-10 mt-10 transform transition-all duration-300 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <GradientHeading className="text-3xl">
            Send New Announcement
          </GradientHeading>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AnnouncementPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState<"all" | "specific">("all");
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    success: boolean;
    message: string;
  }>({ visible: false, success: true, message: "" });

  const { userSummary } = useUserStore();
  const { authUser } = useAuthStore();
  const { announcements, fetchAnnouncements, sendAnnouncement, loading } =
    useAnnouncementStore();

  useUserPageHook();

  useEffect(() => {
    if (authUser?.user_id) fetchAnnouncements(authUser.user_id);
  }, [authUser?.user_id]);

  const handleSendAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      setFeedback({
        visible: true,
        success: false,
        message: "⚠️ Title and Message are required.",
      });
      return;
    }
    if (!authUser) {
      setFeedback({
        visible: true,
        success: false,
        message: "❌ You must be logged in to send announcements.",
      });
      return;
    }

    try {
      await sendAnnouncement({
        title,
        message,
        scope,
        recipient_ids: scope === "specific" ? selectedFarmers : [],
        sender_id: authUser.user_id,
      });
      setTitle("");
      setMessage("");
      setSelectedFarmers([]);
      setScope("all");
      setIsModalOpen(false);

      setFeedback({
        visible: true,
        success: true,
        message: "✅ Announcement sent successfully!",
      });
    } catch (err) {
      console.error("❌ Failed to send announcement:", err);
      setFeedback({
        visible: true,
        success: false,
        message: "❌ Failed to send announcement. Check console for details.",
      });
    } finally {
      setTimeout(
        () => setFeedback((prev) => ({ ...prev, visible: false })),
        3000
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <GradientHeading className="text-3xl text-neutral-800 font-bold leading-tight">
            Announcements
          </GradientHeading>
          <p className="text-sm text-neutral leading-tight">
            Review sent announcements and send new ones.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-md flex items-center rounded-full py-0 px-1 hover:text-secondary"
        >
          <span className="bg-secondary text-white rounded-full p-2 flex items-center justify-center text-xl">
            <PlusIcon />
          </span>
          <span className="px-2 text-white font-normal">
            Send New Announcement
          </span>
        </button>
      </div>

      {/* Announcement History */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-semibold mb-2">Announcement History</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-gray-500">No announcements found.</p>
        ) : (
          <ul className="space-y-3">
            {announcements.map((item) => (
              <li
                key={item.id}
                className="p-3 border rounded bg-gray-50 text-sm space-y-1"
              >
                <p>
                  <span className="font-bold">Title:</span> {item.title}
                </p>
                <p>
                  <span className="font-bold">Message:</span> {item.message}
                </p>
                <p>
                  <span className="font-bold">Recipients:</span>{" "}
                  {item.scope === "all"
                    ? "All Farmers"
                    : item.recipients.length
                    ? item.recipients.join(", ")
                    : "No recipients"}
                </p>
                <p className="text-xs text-gray-500">
                  Sent at {new Date(item.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Send Announcement Modal */}
      <Modal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          {/* Recipients Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Recipients</h2>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-100 border p-2 flex">
                <button
                  onClick={() => setScope("all")}
                  className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                    scope === "all"
                      ? "bg-green-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All Farmers
                </button>
                <button
                  onClick={() => setScope("specific")}
                  className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                    scope === "specific"
                      ? "bg-green-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Specific Farmers
                </button>
              </div>
            </div>

            {/* Smooth transition between scopes */}
            <div
              className={`transition-all duration-500 ${
                scope === "specific"
                  ? "opacity-100 max-h-60 mt-3"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="mt-3 max-h-40 overflow-y-auto border rounded">
                {!userSummary || userSummary.length === 0 ? (
                  <p className="text-gray-500 p-2">No farmers found.</p>
                ) : (
                  <ul className="divide-y">
                    {userSummary.map((user, index) => {
                      const isSelected = selectedFarmers.includes(user.user_id);
                      return (
                        <li
                          key={user.user_id}
                          onClick={() =>
                            setSelectedFarmers((prev) =>
                              prev.includes(user.user_id)
                                ? prev.filter((id) => id !== user.user_id)
                                : [...prev, user.user_id]
                            )
                          }
                          className={`cursor-pointer flex items-center justify-between p-2 transition-colors duration-200 ${
                            isSelected
                              ? "bg-green-700 text-white"
                              : index % 2 === 0
                              ? "bg-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <span>{user.user_name}</span>
                          <span>{user.user_email}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="w-full border rounded p-2 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className="w-full border rounded p-2 mt-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={4}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendAnnouncement}
            disabled={loading}
            className="btn btn-primary btn-md flex items-center rounded-full py-0 px-7 hover:text-secondary"
          >
            {loading ? "Sending..." : "Send Announcement"}
          </button>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={feedback.visible}
        onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
      >
        <div className="text-center">
          <p
            className={`text-lg font-semibold ${
              feedback.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback.message}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AnnouncementPage;
