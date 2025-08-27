import { useState } from "react";

const NotificationPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState<"all" | "specific">("all");
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<
    { title: string; message: string; scope: string; timestamp: string }[]
  >([]);

  // Mock farmer list (replace with API fetch later)
  const farmers = ["Juan Dela Cruz", "Maria Santos", "Pedro Reyes"];

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and Message are required.");
      return;
    }

    setIsSending(true);

    try {
      // TODO: Replace with API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add to history
      setHistory((prev) => [
        {
          title,
          message,
          scope: scope === "all" ? "All Farmers" : selectedFarmers.join(", "),
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      // Reset form
      setTitle("");
      setMessage("");
      setSelectedFarmers([]);
      setScope("all");

      alert("✅ Notification sent successfully!");
    } catch (error) {
      alert("❌ Failed to send notification. Try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        📢 Send Notifications
      </h1>

      {/* Form Section */}
      <div className="p-4 border rounded-lg shadow bg-white space-y-4">
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

        <div>
          <label className="block text-sm font-medium">Recipient Scope</label>
          <select
            className="w-full border rounded p-2 mt-1"
            value={scope}
            onChange={(e) => setScope(e.target.value as "all" | "specific")}
          >
            <option value="all">All Farmers</option>
            <option value="specific">Specific Farmers</option>
          </select>
        </div>

        {scope === "specific" && (
          <div>
            <label className="block text-sm font-medium">Select Farmers</label>
            <select
              multiple
              className="w-full border rounded p-2 mt-1"
              value={selectedFarmers}
              onChange={(e) =>
                setSelectedFarmers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {farmers.map((farmer) => (
                <option key={farmer} value={farmer}>
                  {farmer}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple farmers
            </p>
          </div>
        )}

        <button
          onClick={handleSendNotification}
          disabled={isSending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send Notification"}
        </button>
      </div>

      {/* History Section */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-semibold mb-2">📜 Notification History</h2>
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
    </div>
  );
};

export default NotificationPage;
