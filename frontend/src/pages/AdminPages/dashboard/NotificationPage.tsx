import { useState } from "react";
import { X, PlusIcon } from "lucide-react";
import GradientHeading from "../../../components/widgets/GradientComponent";
import useUserPageHook from "../../../hooks/useUserPage";
import { useUserStore } from "../../../store/AdminStore/useUserStore";
import { UserSummary } from "../../../models/readingStoreModels";

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
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      {/* Gray overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      {/* Modal content */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6 z-10 mt-10">
        <div className="flex justify-between items-center mb-4">
          <GradientHeading className="text-3xl">
            Send New Notification
          </GradientHeading>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const NotificationPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState<"all" | "specific">("all");
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState<
    { title: string; message: string; scope: string; timestamp: string }[]
  >([]);

  const { userSummary } = useUserStore();
  useUserPageHook();

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and Message are required.");
      return;
    }

    setIsSending(true);

    try {
      // Simulate API
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setHistory((prev) => [
        {
          title,
          message,
          scope: scope === "all" ? "All Farmers" : selectedFarmers.join(", "),
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      // Reset
      setTitle("");
      setMessage("");
      setSelectedFarmers([]);
      setScope("all");
      setIsModalOpen(false);

      alert("✅ Notification sent successfully!");
    } catch (error) {
      alert("❌ Failed to send notification.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with button */}
      <div className="flex items-center justify-between">
        <div>
          <GradientHeading className="text-3xl text-neutral-800 font-bold leading-tight">
            Notifications
          </GradientHeading>
          <p className="text-sm text-neutral leading-tight">
            Review sent notifications and send new ones.
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
            Send New Notification
          </span>
        </button>
      </div>

      {/* History Section */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-semibold mb-2">Notification History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications sent yet.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((item, index) => (
              <li
                key={index}
                className="p-3 border rounded bg-gray-50 text-sm space-y-1"
              >
                <p>
                  <span className="font-bold">Title:</span> {item.title}
                </p>
                <p>
                  <span className="font-bold">Message:</span> {item.message}
                </p>
                <p>
                  <span className="font-bold">Recipients:</span> {item.scope}
                </p>
                <p className="text-xs text-gray-500">
                  Sent at {item.timestamp}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      <Modal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          {/* Recipient Scope */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Recipients</h2>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-100 border p-2 flex">
                <button
                  onClick={() => setScope("all")}
                  className={`px-4 py-2 rounded ${
                    scope === "all"
                      ? "bg-green-900 rounded-full text-white"
                      : "bg-gray-100 rounded-full text-gray-700"
                  }`}
                >
                  All Farmers
                </button>
                <button
                  onClick={() => setScope("specific")}
                  className={`px-4 py-2 rounded ${
                    scope === "specific"
                      ? "bg-green-900 rounded-full text-white"
                      : "bg-gray-100 rounded-full text-gray-700"
                  }`}
                >
                  Specific Farmers
                </button>
              </div>
            </div>

            {scope === "specific" && (
              <div className="mt-3 max-h-40 overflow-y-auto border p-2 rounded">
                {!userSummary || userSummary.length === 0 ? (
                  <p className="text-gray-500">No farmers found.</p>
                ) : (
                  <ul className="space-y-2">
                    {userSummary.map((user: UserSummary) => (
                      <li
                        key={user.user_id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFarmers.includes(user.user_name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFarmers((prev) => [
                                ...prev,
                                user.user_name,
                              ]);
                            } else {
                              setSelectedFarmers((prev) =>
                                prev.filter((name) => name !== user.user_name)
                              );
                            }
                          }}
                        />
                        <span>
                          {user.user_name} ({user.user_email})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Notification Content */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="w-full border rounded p-2 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>

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

          <button
            onClick={handleSendNotification}
            disabled={isSending}
            className="btn btn-primary btn-md flex items-center rounded-full py-0 px-7 hover:text-secondary"
          >
            {isSending ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationPage;
