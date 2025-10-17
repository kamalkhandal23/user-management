import { useState, useCallback } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import toast from "react-hot-toast";

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    image_url: "",
  });

  const [preview, setPreview] = useState("");
  const [cropMode, setCropMode] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
    if (!form.image_url) {
      toast.error("Please upload and crop an image first!");
      return;
    }
    await API.post("/users", form);
    toast.success("User added successfully!");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New User</h2>

      {/* If cropping active, show cropper */}
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

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />
        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />

        {/* Image Upload */}
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
              alt="preview"
              className="w-32 h-32 rounded-full object-cover mt-2 shadow-md border-2 border-blue-200"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
