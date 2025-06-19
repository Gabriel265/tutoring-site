import React from "react";

const TutorModal = ({ tutor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white p-6 rounded-xl w-[90%] max-w-md relative shadow-2xl border border-slate-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Tutor Image */}
        <img
          src={tutor.profile_picture}
          alt={tutor.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-700 shadow-md object-cover"
        />

        {/* Tutor Details */}
        <h2 className="text-xl font-bold text-center">{tutor.name}</h2>
        <p className="text-sm text-center text-gray-400 mb-2">
          {tutor.qualification}
        </p>
        <p className="text-gray-300 text-sm whitespace-pre-line">
          {tutor.bio}
        </p>
      </div>
    </div>
  );
};

export default TutorModal;
