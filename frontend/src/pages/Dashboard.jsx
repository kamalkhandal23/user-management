import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users!");
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      toast.success("User deleted!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user!");
    }
  };

  // 🔹 Helper function to calculate age
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 py-10"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        All Users
      </h2>

      {/* ✅ Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {users.map((u) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.04,
              y: -5,
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
          >
            {/* ✅ Image */}
            <img
              src={
                u.image_url ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={u.name}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/300x200?text=Image+Not+Found")
              }
              className="w-full h-52 object-cover object-center rounded-t-2xl transition-all duration-300 hover:brightness-105"
            />

            {/* ✅ Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {u.name}
              </h3>
              <p className="text-gray-600 text-sm mb-1">{u.email}</p>
              <p className="text-gray-500 text-sm mb-1">📞 {u.phone}</p>
              <p className="text-gray-500 text-sm mb-1">
                🎂 Age: {calculateAge(u.dob)} years
              </p>
              <p className="text-gray-500 text-sm mb-3">
                👥 Followers: {u.followersCount || 0} | Following:{" "}
                {u.followingCount || 0}
              </p>

              {/* ✅ Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/edit/${u.id}`}
                  className="flex-1 text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="flex-1 text-center bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
