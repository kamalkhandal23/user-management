import { useEffect, useState, useCallback } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage"; // same helper from CreateUser

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    image_url: "",
  });
  const [preview, setPreview] = useState("");
  const [users, setUsers] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  
  const [cropMode, setCropMode] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchAllUsers();
  }, []);

  const fetchUser = async () => {
    const res = await API.get("/users");
    const user = res.data.find((u) => u.id === Number(id));
    if (user) {
      setForm(user);
      setPreview(user.image_url);
      setFollowingList(user.following || []);
    }
  };

  const fetchAllUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data.filter((u) => u.id !== Number(id)));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropMode(true);
    };
    reader.readAsDataURL(file);
  };

  
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  
  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setPreview(croppedImage);
      setForm({ ...form, image_url: croppedImage });
      setCropMode(false);
      toast.success("Image cropped successfully!");
    } catch (err) {
      toast.error("Crop failed!");
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/users/${id}`, form);
    toast.success("User updated successfully!");
    navigate("/");
  };

  
  const toggleFollow = async (targetId) => {
    const alreadyFollowing = followingList.includes(targetId);
    await API.post("/users/follow", {
      follower_id: Number(id),
      following_id: targetId,
    });

    if (alreadyFollowing) {
      setFollowingList(followingList.filter((f) => f !== targetId));
      toast("Unfollowed successfully 👋", { icon: "❌" });
    } else {
      setFollowingList([...followingList, targetId]);
      toast("Followed successfully 🎯", { icon: "✅" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Edit User</h2>

      
      {cropMode && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-center items-center">
          <div className="relative w-72 h-72 bg-gray-900">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCropSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              ✅ Crop & Save
            </button>
            <button
              onClick={() => setCropMode(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Image upload */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full border p-2 rounded-md mb-2"
          />
          {preview && (
            <img
              src={preview}
              alt="User"
              className="w-32 h-32 rounded-full object-cover mt-2 shadow-md border-2 border-blue-200"
            />
          )}
        </div>

        
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded-md"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded-md"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2 rounded-md"
        />
        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 hover:shadow-lg transition-all"
        >
          Save Changes
        </button>
      </form>

     
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Follow / Unfollow Users</h3>
        <div className="grid grid-cols-2 gap-4">
          {users.map((u) => {
            const isFollowing = followingList.includes(u.id);
            return (
              <motion.div
                key={u.id}
                whileHover={{ scale: 1.03 }}
                className="border p-3 rounded-xl flex justify-between items-center bg-white hover:bg-blue-50 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <button
                  onClick={() => toggleFollow(u.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                    isFollowing
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
