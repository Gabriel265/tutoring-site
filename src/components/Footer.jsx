import React from "react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-to-t from-[#30525C] to-[#0A1A24] text-white pt-12 pb-8 px-4 -mt-1">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Branding */}
          <div className="flex items-center mb-6 md:mb-0">
            <img 
              src="/kayce-logo.png" 
              alt="Kaycee Tutoring" 
              className="h-10 w-auto mr-3"
            />
            <div>
              <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F6C992] to-[#D396A6]">
                Kaycee Tutoring
              </h3>
              <p className="text-xs text-[#ACCOD3]">Academic Excellence</p>
            </div>
          </div>

          {/* Contact Links */}
          <div className="flex flex-wrap justify-center gap-6"> 
            <a 
              href="https://twitter.com/KayceTutoring" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-[#F6C992] transition-colors"
            >
              <ion-icon name="logo-twitter" className="text-xl mr-2"></ion-icon>
              <span>@KayceTutoring</span>
            </a>
            
            <a 
              href="mailto:contact@kaycetutoring@gmail.com" 
              className="flex items-center hover:text-[#F6C992] transition-colors"
            >
              <ion-icon name="mail-outline" className="text-xl mr-2"></ion-icon>
              <span>kaycetutoring@gmail.com</span>
            </a>
            
            <a 
              href="https://wa.me/995375405" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-[#F6C992] transition-colors"
            >
              <ion-icon name="logo-whatsapp" className="text-xl mr-2"></ion-icon>
              <span>(+265) 99 53 75 405</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[#5484A4]/30 text-center text-sm text-[#ACCOD3]">
          © {new Date().getFullYear()} Kaycee Tutoring. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;