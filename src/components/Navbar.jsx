import React, { useState } from "react";
import "./Navbarcss.css";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const tabs = [
    { name: "Home", icon: "home-outline" },
    { name: "Curriculum", icon: "book-outline" },
    { name: "Writing", icon: "document-text-outline" },
    { name: "Tutors", icon: "people-outline" },
    { name: "Contact", icon: "chatbubble-outline" },
  ];

  return (
    <nav className="relative bg-gradient-to-b from-[#30525C] via-[#0A1A24] to-[#30525C] py-4">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Logo on the left */}
        <div className="flex items-center space-x-4">
  {/* Logo on the left */}
  <div className="flex-shrink-0">
    <img 
      src="/kayce-logo.png" 
      alt="Kayce Logo" 
      className="h-12 w-auto object-contain"
    />
  </div>
  
  {/* Text on the right */}
  <div className="hidden md:block">
    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F6C992] to-[#D396A6]">
      Kaycee Tutoring
    </span>
  </div>
</div>

        {/* Navigation pill */}
        <div className="flex-1 flex justify-center">
          <div className="relative bg-[#30525C]/80 backdrop-blur-sm text-white px-2 py-2 rounded-full shadow-lg flex">
            <div className="navigation-container">
              <ul className="flex relative">
                {tabs.map((tab, index) => (
                  <li
                    key={index}
                    className={`list ${activeTab === tab.name ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    <a
                      href={`#${tab.name.toLowerCase()}`}
                      className="relative flex flex-col items-center justify-center w-full h-full px-4"
                    >
                      <span className="icon">
                        <ion-icon name={tab.icon}></ion-icon>
                      </span>
                      <span className="text-xs mt-1">{tab.name}</span>
                    </a>
                  </li>
                ))}
                <div
                  className="indicator"
                  style={{
                    transform: `translateX(calc(${tabs.findIndex(
                      (t) => t.name === activeTab
                    ) * 80}px))`,
                  }}
                ></div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;