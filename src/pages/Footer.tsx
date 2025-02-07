import React from "react";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-t from-[#12002b] via-[#240046]/80 to-transparent text-white py-4 md:py-6 mt-12 border-t border-[#7209b7]/50 shadow-inner shadow-[#7209b7]/30">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6">

        <div className="text-center md:text-left md:w-1/3">
          <p className="text-xs md:text-sm text-[#dad8f7]">Designed & Developed by</p>
          <p className="text-base md:text-lg font-semibold text-[#f8f9fa] drop-shadow-lg">
            Rishabh Dev Tripathi
          </p>

          <div className="flex justify-center md:justify-start space-x-3 mt-1">
            <a
              href="https://www.linkedin.com/in/rishabh-dev-mani-tripathi-92a8b724a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f8f9fa] hover:text-[#4cc9f0] transition"
            >
              <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a
              href="https://www.instagram.com/rishabhtripathiii_?igsh=YnNxdmF1Z3VveTFs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f8f9fa] hover:text-pink-400 transition"
            >
              <FaInstagram className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a
              href="https://github.com/Rishabh17113012"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f8f9fa] hover:text-gray-400 transition"
            >
              <FaGithub className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>

          <p className="text-xs mt-1 text-[#dad8f7] opacity-90">
            Passionate about crafting digital experiences!
          </p>
        </div>

        {/* Divider (Hidden on Mobile) */}
        <div className="hidden md:block h-12 w-[1px] bg-[#7209b7]/50"></div>

        {/* Client Section (Right for Desktop, Below for Mobile) */}
        <div className="mt-4 md:mt-0 md:w-2/3 text-center">
          <p className="text-base md:text-lg font-semibold text-[#f8f9fa] drop-shadow-lg">
            Thank you for visiting!
          </p>
          <p className="text-xs md:text-sm text-[#dad8f7]">Stay connected :)</p>

          {/* Client Links */}
          <div className="flex justify-center space-x-4 mt-1">
            <a
              href="https://www.linkedin.com/school/bvpcoe/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4cc9f0] transition text-[#f8f9fa] drop-shadow-lg text-xs md:text-sm"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/bharatiyam_official?igsh=MWhkZDd2anRzcm53ZA=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition text-[#f8f9fa] drop-shadow-lg text-xs md:text-sm"
            >
              Instagram
            </a>
            <a
              href="https://www.bvuniversity.edu.in/coepune/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition text-[#f8f9fa] drop-shadow-lg text-xs md:text-sm"
            >
              Bharati Vidyapeeth College
            </a>
          </div>
        </div>
      </div>

      
      <p className="text-xs mt-4 text-[#dad8f7] opacity-90 text-center">
        &copy; {new Date().getFullYear()} Genre Magazine. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
