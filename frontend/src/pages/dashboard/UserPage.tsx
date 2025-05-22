import { useEffect } from "react";
import { useUserStore } from "../../store/useUserStore";

const UserPage = () => {
  const { users, getUsers, isGettingUsers } = useUserStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold text-2xl mb-4">User Page</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="bg-base-200">#</th>
              <th className="bg-base-200">Name</th>
              <th className="bg-base-200">Email</th>
            </tr>
          </thead>
          <tbody>
            {isGettingUsers ? (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-8 text-base-content/60"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPage;
