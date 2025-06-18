import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import AdminLayout from "./AdminLayout";

const AdminEditCurriculum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setIsLoading(true);
        
        // First try to get data from navigation state (passed from the list page)
        if (location.state?.curriculum) {
          const curriculum = location.state.curriculum;
          const curriculumData = {
            name: curriculum.name || "",
            description: curriculum.description || "",
            price: curriculum.price ? curriculum.price.toString() : ""
          };
          setFormData(curriculumData);
          setOriginalData(curriculum);
          setIsLoading(false);
          return;
        }
        
        // If no state data, fetch from database
        const { data, error } = await supabase
          .from("curriculums")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) {
          console.error("Error fetching curriculum:", error);
          setErrors({ fetch: "Failed to load curriculum data" });
          return;
        }
        
        if (data) {
          const curriculumData = {
            name: data.name || "",
            description: data.description || "",
            price: data.price ? data.price.toString() : ""
          };
          setFormData(curriculumData);
          setOriginalData(data);
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({ fetch: "An unexpected error occurred" });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCurriculum();
    }
  }, [id, location.state]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Curriculum name is required";
    }
    
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = "Price must be a valid number";
    }
    
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = "Price cannot be negative";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: formData.price ? parseFloat(formData.price) : 0,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from("curriculums")
        .update(updateData)
        .eq("id", id);
      
      if (error) {
        console.error("Error updating curriculum:", error);
        setErrors({ submit: "Failed to update curriculum. Please try again." });
      } else {
        // Success - navigate back to curriculums list
        navigate("/admin/curriculums");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/curriculums");
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    return (
      formData.name !== (originalData.name || "") ||
      formData.description !== (originalData.description || "") ||
      formData.price !== (originalData.price ? originalData.price.toString() : "")
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400 text-center">Loading curriculum...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (errors.fetch) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 max-w-md">
            <div className="text-center">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Error Loading Curriculum</h3>
              <p className="text-slate-400 mb-6">{errors.fetch}</p>
              <button
                onClick={handleCancel}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Back to Curriculums
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleCancel}
              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 border border-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Edit Curriculum</h2>
              <p className="text-slate-400">
                {originalData?.name ? `Editing "${originalData.name}"` : "Update curriculum information"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <form onSubmit={handleUpdate} className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Changes Indicator */}
            {hasChanges() && (
              <div className="mb-6 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-yellow-400 text-sm">You have unsaved changes</p>
                </div>
              </div>
            )}

            {/* Curriculum Name */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">
                Curriculum Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter curriculum name"
                className={`w-full bg-slate-800 border text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.name 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-slate-700 focus:ring-purple-500 focus:border-transparent"
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Provide a detailed description of the curriculum..."
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-vertical"
                disabled={isSubmitting}
              />
              <p className="text-slate-500 text-sm mt-2">Optional: Add a description to help users understand what this curriculum covers</p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3">
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-lg">K</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className={`w-full bg-slate-800 border text-white placeholder-slate-400 pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.price 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-slate-700 focus:ring-purple-500 focus:border-transparent"
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.price && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.price}
                </p>
              )}
              <p className="text-slate-500 text-sm mt-2">Leave empty or set to 0 for free curriculum</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Curriculum
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white rounded-lg font-semibold transition-all duration-200 border border-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Preview Card */}
          {(formData.name || formData.description || formData.price) && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Preview</h3>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 bg-opacity-90 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl">
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center text-white text-2xl border-2 border-purple-500/30 flex-shrink-0 shadow-lg">
                    📚
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h4 className="font-bold text-xl text-white truncate flex-1">
                        {formData.name || "Curriculum Name"}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold self-start ${
                        !formData.price || parseFloat(formData.price) === 0
                          ? "bg-green-600/20 text-green-400 border border-green-500/30" 
                          : "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      }`}>
                        {!formData.price || parseFloat(formData.price) === 0 
                          ? "FREE" 
                          : `K${parseFloat(formData.price || 0).toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${originalData?.archived ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                      <span className="text-slate-400 text-sm font-medium">
                        {originalData?.archived ? "Archived" : "Active"}
                      </span>
                    </div>
                    
                    {formData.description && (
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {formData.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditCurriculum;