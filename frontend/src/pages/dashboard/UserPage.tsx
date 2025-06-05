import { useState, useMemo } from "react";
import {
  Download,
  PlusIcon,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Tractor,
  ShieldAlert,
  Users2,
  X,
} from "lucide-react";
import CardContainer from "../../components/widgets/CardContainer";
import GradientHeading from "../../components/widgets/GradientComponent";
import useUserPageHook from "../../hooks/useUserPage";
import { format } from "date-fns";
import { UserSummary } from "../../models/readingStoreModels";
import { Sidebar } from "../../components/widgets/Widgets";
import { useNavigate } from "react-router-dom";

type SortableColumn =
  | "user_name"
  | "user_email"
  | "user_address"
  | "plot_count"
  | "device_status"
  | "created_at";

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    return format(new Date(dateStr), "MMM d, yyyy hh:mm a");
  } catch {
    return dateStr;
  }
};

const UserPage = () => {
  const { userSummary } = useUserPageHook();
  const isGettingUsers = false;

  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = useMemo(() => {
    // Get the list of users or empty array if none
    const users: UserSummary[] = userSummary || [];

    // If no column is selected for sorting, just return the users as is
    if (!sortColumn) return users;

    // Make a copy of users array so we don't change the original data
    return [...users].sort((a, b) => {
      // Get the values for the column we want to sort by
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      // Handle null or undefined values: push them to the end
      if (aVal == null) return 1; // 'a' should come after 'b'
      if (bVal == null) return -1; // 'b' should come after 'a'

      // If sorting by a number column (like total plots)
      if (sortColumn === "plot_count") {
        // For ascending, subtract aVal from bVal
        // For descending, subtract bVal from aVal (reverse)
        return sortDirection === "asc"
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      }

      // If sorting by a date column (like join date)
      if (sortColumn === "created_at") {
        // Convert the date strings to timestamps and subtract for comparison
        return sortDirection === "asc"
          ? new Date(aVal as string).getTime() -
              new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() -
              new Date(aVal as string).getTime();
      }

      // For string columns (like name or email), use localeCompare to sort alphabetically
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal)) // ascending (A → Z)
        : String(bVal).localeCompare(String(aVal)); // descending (Z → A)
    });
  }, [userSummary, sortColumn, sortDirection]);

  // Helper to show arrow icon in headers
  const SortIcon = ({ column }: { column: SortableColumn }) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="inline w-4 ml-1 text-neutral-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="inline w-4 ml-1" />
    ) : (
      <ArrowDown className="inline w-4 ml-1" />
    );
  };

  return (
    <div className="py-5">
      <div className="flex flex-row items-center justify-between">
        <div className="items-start">
          <GradientHeading className="text-3xl text-neutral-800 font-bold leading-tight">
            User Management
          </GradientHeading>
          <p className="text-sm text-neutral leading-tight">
            Lists of users in your municipality.
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <button className="btn bg-base-100 btn-md flex items-center rounded-full gap-2 py-0 px-6 hover:bg-base-200">
            <Download className="w-4" />
            <span className="font-normal">Export</span>
          </button>
          <button
            onClick={() => {
              setIsSidebarOpen(true);
            }}
            className="btn btn-primary btn-md flex items-center rounded-full py-0 px-1 hover:text-secondary"
          >
            <span className="bg-secondary text-white rounded-full p-2 flex items-center justify-center text-xl">
              <PlusIcon />
            </span>
            <span className="px-2 text-white font-normal">Add New User</span>
          </button>
        </div>
      </div>

      <CardContainer padding="p-0" className="border mt-5">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th
                onClick={() => handleSort("user_name")}
                className="cursor-pointer select-none"
              >
                NAME <SortIcon column="user_name" />
              </th>
              <th
                onClick={() => handleSort("user_email")}
                className="cursor-pointer select-none"
              >
                EMAIL <SortIcon column="user_email" />
              </th>
              <th
                onClick={() => handleSort("user_address")}
                className="cursor-pointer select-none"
              >
                ADDRESS <SortIcon column="user_address" />
              </th>
              <th
                onClick={() => handleSort("plot_count")}
                className="cursor-pointer select-none"
              >
                TOTAL PLOTS <SortIcon column="plot_count" />
              </th>
              <th
                onClick={() => handleSort("device_status")}
                className="cursor-pointer select-none"
              >
                DEVICE STATUS <SortIcon column="device_status" />
              </th>
              <th
                onClick={() => handleSort("created_at")}
                className="cursor-pointer select-none"
              >
                JOINED AT <SortIcon column="created_at" />
              </th>
            </tr>
          </thead>
          <tbody className="text-md">
            {isGettingUsers ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </td>
              </tr>
            ) : !sortedUsers || sortedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-base-content/60"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              sortedUsers.map((user, idx) => (
                <tr key={user.user_id} className="hover:bg-base-300">
                  <td className="p-5">{idx + 1}</td>
                  <td className="p-5">{user.user_name}</td>
                  <td className="p-5">{user.user_email}</td>
                  <td className="p-5">{toTitleCase(user.user_address)}</td>
                  <td className="p-5">{user.plot_count}</td>
                  <td className="p-5">
                    <span
                      className={`badge ${
                        user.device_status === "ONLINE"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {user.device_status}
                    </span>
                  </td>
                  <td className="p-5">{formatDate(user.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContainer>

      <Sidebar visible={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <div className="flex flex-row items-center justify-between">
          <GradientHeading className="text-3xl">Add New User</GradientHeading>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-base-200 focus:outline-none"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <CardContainer
          className="hover:cursor-pointer border border-base-200 bg-base-100 hover:bg-base-200 p-12 mt-5"
          onClick={() => console.log("Add Farmer Clicked")}
        >
          <div className="flex flex-col items-center">
            <Tractor className="w-16 h-16 text-primary mb-3" />
            <h3 className="text-xl font-semibold">Assign a Device to a User</h3>
            <p className="text-base text-gray-600">
              Assigning of IOT Device to users
            </p>
          </div>
        </CardContainer>
        <CardContainer
          className="hover:cursor-pointer bg-base-300 hover:bg-base-200 p-12 mt-3"
          onClick={() => navigate("/add-user")}
        >
          <div className="flex flex-col items-center">
            <Users2 className="w-16 h-16 text-primary mb-3" />
            <h3 className="text-xl font-semibold">Add new Farmer/User</h3>
            <p className="text-base text-gray-600">
              Add a new user or farmer and request for a device.
            </p>
          </div>
        </CardContainer>
        <CardContainer
          className="hover:cursor-pointer bg-base-300 hover:bg-base-200 p-12 mt-3"
          onClick={() => console.log("Add Farmer Clicked")}
        >
          <div className="flex flex-col items-center">
            <ShieldAlert className="w-16 h-16 text-primary mb-3" />
            <h3 className="text-xl font-semibold">Add new Admin</h3>
            <p className="text-base text-gray-600">
              Add a admin to manage your farms municipality and users.
            </p>
          </div>
        </CardContainer>
      </Sidebar>
    </div>
  );
};

export default UserPage;
