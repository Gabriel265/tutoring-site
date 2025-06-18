import React from "react";

const TutorModal = ({ tutor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 text-white p-6 rounded-xl w-[90%] max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-purple-200 hover:text-red-500 text-xl"
        >
          &times;
        </button>
        <img
          src={tutor.profile_picture}
          alt={tutor.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-400 shadow-md"
        />
        <h2 className="text-xl font-bold text-center">{tutor.name}</h2>
        <p className="text-sm text-center text-purple-200 mb-2">{tutor.qualification}</p>
        <p className="text-purple-100 text-sm">{tutor.bio}</p>
      </div>
    </div>
  );
};

export default TutorModal;
