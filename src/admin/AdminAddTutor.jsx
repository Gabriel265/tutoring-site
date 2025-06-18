// FILE: admin/AdminAddTutor.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import AdminLayout from "./AdminLayout";

const AdminAddTutor = () => {
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    bio: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let profile_picture = "";

    if (photo) {
      const ext = photo.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("tutor-photos")
        .upload(fileName, photo);

      if (uploadError) {
        alert("Photo upload failed.");
        setIsSubmitting(false);
        return;
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from("tutor-photos")
        .getPublicUrl(fileName);

      if (urlError || !urlData) {
        alert("Failed to get public URL");
        setIsSubmitting(false);
        return;
      }

      profile_picture = urlData.publicUrl;
    }

    const { data: insertData, error: insertError } = await supabase.from("tutors").insert({
      name: formData.name,
      qualification: formData.qualification,
      bio: formData.bio,
      profile_picture,
    });

    if (insertError) {
      console.error("Insert Error:", insertError);
      alert("Error adding tutor.");
      setIsSubmitting(false);
      return;
    }

    console.log("Inserted Tutor:", insertData);
    alert("Tutor added successfully!");
    navigate("/admin/tutors");
  };

  

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-slate-800 rounded-full opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/6 w-24 h-24 bg-slate-700 rounded-full opacity-40"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="bg-slate-900 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-800">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Add New Tutor</h2>
              <p className="text-slate-400">Expand your tutoring team</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter tutor's full name"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  placeholder="e.g., BSc in Computer Science"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Write a short bio for the tutor..."
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full bg-slate-800 text-white file:bg-blue-600 file:text-white file:rounded-md file:px-4 file:py-2 file:mr-4"
                />

                {photoPreview && (
                  <div className="flex justify-center mt-4">
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-full border-4 border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/tutors")}
                  className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-white text-slate-900 font-semibold py-3 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding Tutor..." : "Add Tutor ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddTutor;
