import React from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaUniversity,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-t from-black via-[#1c0033] to-black text-white py-8 md:py-10 shadow-inner shadow-[#7209b7]/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Developer Section */}
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm text-[#dad8f7]">
              Designed &amp; Developed by
            </p>
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

          {/* About Section */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">About</h2>
            <p className="text-xs md:text-sm text-[#dad8f7]">
              We are delighted to present Genre 2K25, the 33rd edition of our
              college magazine. This year's theme, Synthwave Synergy, celebrates
              the fusion of futuristic innovation with timeless tradition. As we
              also honor Bharatiyam, our fest of cultural vibrancy, this edition
              stands as a testament to our rich heritage and dynamic creativity.
            </p>
          </div>

          {/* Map Section */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Map</h2>
            <div className="w-full h-40 bg-black rounded overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.5585344517353!2d73.85290027423567!3d18.458342882623203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eab918857791%3A0x51187bf7e480ef69!2sBharati%20Vidyapeeth%20College%20of%20engineering!5e0!3m2!1sen!2sin!4v1739348068498!5m2!1sen!2sin"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="College Map"
              ></iframe>
            </div>
          </div>

          {/* Client Section */}
          <div className="text-center md:text-right">
            <p className="text-base md:text-lg font-semibold text-[#f8f9fa] drop-shadow-lg">
              Bharati Vidyapeeth College of Engineering
            </p>
            <p className="text-base md:text-lg font-semibold text-[#f8f9fa] drop-shadow-lg">
              Thank you for visiting!
            </p>
            <p className="text-xs md:text-sm text-[#dad8f7]">
              Stay connected :)
            </p>
            <div className="flex justify-center md:justify-end space-x-4 mt-2">
              <a
                href="https://www.linkedin.com/school/bvpcoe/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#4cc9f0]"
              >
                <FaLinkedin className="w-6 h-6 md:w-8 md:h-8 text-[#f8f9fa] drop-shadow-lg" />
              </a>
              <a
                href="https://www.instagram.com/bharatiyam_official?igsh=MWhkZDd2anRzcm53ZA=="
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-pink-400"
              >
                <FaInstagram className="w-6 h-6 md:w-8 md:h-8 text-[#f8f9fa] drop-shadow-lg" />
              </a>
              <a
                href="https://www.bvuniversity.edu.in/coepune/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-yellow-400"
              >
                <FaUniversity className="w-6 h-6 md:w-8 md:h-8 text-[#f8f9fa] drop-shadow-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-4 text-center">
          <p className="text-xs text-[#dad8f7] opacity-90">
            &copy; {new Date().getFullYear()} Genre Magazine. All rights
            reserved. Bharati Vidyapeeth College of Engineering, Pune.
          </p>
          <p className="mt-2 text-xs text-[#dad8f7]">
            Designed &amp; Developed by Rishabh Dev Tripathi
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
