// FILE: admin/AdminEditTutor.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import AdminLayout from "./AdminLayout";

const AdminEditTutor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    qualification: "",
    bio: "",
    profile_picture: "",
  });
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const { data, error } = await supabase
          .from("tutors")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching tutor:", error);
          setStatus("❌ Error fetching tutor details.");
        } else {
          // Populate form with existing data
          setForm({
            name: data.name || "",
            qualification: data.qualification || "",
            bio: data.bio || "",
            profile_picture: data.profile_picture || "",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setStatus("❌ Error fetching tutor details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTutor();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setStatus("❌ File size must be less than 5MB.");
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setStatus("❌ Please upload a valid image file (JPEG, PNG, or WebP).");
        return;
      }
      
      setPhoto(file);
      setStatus(""); // Clear any previous error
    }
  };

  const uploadPhoto = async (file) => {
    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop().toLowerCase();
      const fileName = `tutor_${id}_${Date.now()}.${fileExt}`;
      
      // Upload new photo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("tutor-photos")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Photo upload failed");
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("tutor-photos")
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Photo upload error:", error);
      throw error;
    }
  };

  const removeOldPhoto = async (oldPhotoUrl) => {
    if (!oldPhotoUrl) return;
    
    try {
      // Extract filename from URL
      const urlParts = oldPhotoUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      
      // Only attempt to remove if it looks like a valid filename
      if (fileName && fileName.includes('.')) {
        const { error } = await supabase.storage
          .from("tutor-photos")
          .remove([fileName]);
        
        if (error) {
          console.warn("Could not remove old photo:", error);
          // Don't throw error here as it's not critical
        }
      }
    } catch (error) {
      console.warn("Error removing old photo:", error);
      // Don't throw error here as it's not critical
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      let profilePictureUrl = form.profile_picture;

      // Handle photo upload if a new photo is selected
      if (photo) {
        // Upload new photo first
        profilePictureUrl = await uploadPhoto(photo);
        
        // Remove old photo after successful upload
        if (form.profile_picture && form.profile_picture !== profilePictureUrl) {
          await removeOldPhoto(form.profile_picture);
        }
      }

      // Update tutor record
      const { error: updateError } = await supabase
        .from("tutors")
        .update({
          name: form.name.trim(),
          qualification: form.qualification.trim(),
          bio: form.bio.trim(),
          profile_picture: profilePictureUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (updateError) {
        console.error("Update error:", updateError);
        setStatus("❌ Failed to update tutor details.");
        return;
      }

      // Success - redirect to tutors list
      navigate("/admin/tutors", { 
        state: { message: "✅ Tutor updated successfully!" }
      });

    } catch (error) {
      console.error("Submit error:", error);
      setStatus("❌ An error occurred while updating the tutor.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400 text-center">Loading tutor details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/tutors")}
            className="text-slate-400 hover:text-white mb-4 flex items-center gap-2 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tutors
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Edit Tutor</h2>
          <p className="text-slate-400">Update tutor information and profile</p>
        </div>

        {/* Form */}
        <div className="bg-slate-900 bg-opacity-80 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Profile Picture */}
            {form.profile_picture && (
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={form.profile_picture}
                    alt="Current profile"
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-slate-700 shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center">
                    <span className="text-white opacity-0 hover:opacity-100 text-sm font-medium">Current Photo</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-2">Current Profile Picture</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-slate-300 font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Qualification */}
            <div>
              <label htmlFor="qualification" className="block text-slate-300 font-medium mb-2">
                Qualification *
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g., Bachelor's in Mathematics, PhD in Physics"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-slate-300 font-medium mb-2">
                Biography *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Brief description of experience, teaching style, and expertise..."
                rows={4}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
              />
              <p className="text-slate-500 text-sm mt-1">
                {form.bio.length}/500 characters
              </p>
            </div>

            {/* Photo Upload */}
            <div>
              <label htmlFor="photo" className="block text-slate-300 font-medium mb-2">
                Profile Picture
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  id="photo"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="w-full bg-slate-800 text-white border border-slate-700 px-4 py-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer transition-all duration-200"
                />
                <p className="text-slate-500 text-sm">
                  {photo ? `Selected: ${photo.name}` : "Choose a new image to replace current photo"}
                </p>
                <p className="text-slate-500 text-xs">
                  Supported formats: JPEG, PNG, WebP. Max size: 5MB
                </p>
              </div>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`p-4 rounded-lg text-center ${
                status.includes('❌') 
                  ? 'bg-red-600 bg-opacity-20 text-red-400 border border-red-600 border-opacity-30' 
                  : 'bg-green-600 bg-opacity-20 text-green-400 border border-green-600 border-opacity-30'
              }`}>
                {status}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/tutors")}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Tutor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditTutor;