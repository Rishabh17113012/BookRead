import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-t from-[#12002b] via-[#240046]/80 to-transparent text-white text-center py-8 mt-12 border-t border-[#7209b7]/50 shadow-inner shadow-[#7209b7]/30">
      <div className="container mx-auto">
        <p className="text-lg font-semibold text-[#f8f9fa] drop-shadow-lg">Thank you for visiting!</p>
        <p className="text-sm text-[#dad8f7]">Stay connected :)</p>
        
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://www.linkedin.com/in/rishabh-dev-mani-tripathi-92a8b724a/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#4cc9f0] transition text-[#f8f9fa] drop-shadow-lg"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/rishabhtripathiii_?igsh=YnNxdmF1Z3VveTFs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition text-[#f8f9fa] drop-shadow-lg"
          >
            Instagram
          </a>
          <a
            href="https://github.com/Rishabh17113012"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0969DA] transition text-[#f8f9fa] drop-shadow-lg"
          >
            GitHub
          </a>
          <a
            href="https://www.bvuniversity.edu.in/coepune/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition text-[#f8f9fa] drop-shadow-lg"
          >
            Bharati Vidyapeeth College
          </a>
        </div>

        <p className="text-xs mt-6 text-[#dad8f7] opacity-90">
          &copy; {new Date().getFullYear()} Genre Magazine. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
