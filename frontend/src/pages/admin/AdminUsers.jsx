import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";

import { api } from "../../utils/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");

      setUsers(data.users || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this user?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}`);

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#24110a]">
            Registered Users
          </h1>

          <p className="text-[#7a6255] mt-1">
            Total Users: {users.length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#eadccb] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead className="bg-[#fff7ee]">
              <tr>
                <th className="text-left px-6 py-5 font-black">
                  Name
                </th>

                <th className="text-left px-6 py-5 font-black">
                  Email
                </th>

                <th className="text-left px-6 py-5 font-black">
                  Phone
                </th>

                <th className="text-left px-6 py-5 font-black">
                  Joined
                </th>

                <th className="text-center px-6 py-5 font-black">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-[#f4e5d8]"
                >
                  <td className="px-6 py-5 font-semibold">
                    {user.name}
                  </td>

                  <td className="px-6 py-5 text-[#6d4d3b]">
                    {user.email}
                  </td>

                  <td className="px-6 py-5 text-[#6d4d3b]">
                    {user.phone || "—"}
                  </td>

                  <td className="px-6 py-5 text-[#6d4d3b]">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() =>
                        handleDelete(user._id)
                      }
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center mx-auto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!users.length && (
            <div className="p-10 text-center text-[#7a6255]">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;