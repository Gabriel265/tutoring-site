import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-black py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center">
          <div className="bg-gray-900 text-white px-6 py-2 rounded-full shadow-lg flex space-x-4">
            <a href="#" className="hover:text-green-400">Home</a>
            <a href="#curriculums" className="hover:text-green-400">Curriculum</a>
            <a href="#assignment" className="hover:text-green-400">Assignments</a>
            <a href="#tutors" className="hover:text-green-400">Tutors</a>
            <a href="#contact" className="hover:text-green-400">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
