import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const NavbarHome : React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.hash]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 15 }}
      className="fixed top-0 w-full bg-card/90 backdrop-blur-lg border-b border-primary/30 z-50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      
        <Link to="/#art-of-reading" className="nav-link text-2xl font-bold">
          Genre Magazine 2025
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/#art-of-reading" className="nav-link hover:text-[#4cc9f0] transition">
            Home
          </Link>
          <a
            href="https://bhartiyambvp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link hover:text-[#4cc9f0] transition"
          >
            Bhartiyam
          </a>
          <Link to="/#contact" className="nav-link hover:text-[#4cc9f0] transition">
            Contact
          </Link>
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 left-0 w-full bg-card/90 backdrop-blur-lg border-b border-primary/30"
          >
            <div className="flex flex-col space-y-2 p-4">
              <Link
                onClick={() => setIsMenuOpen(false)}
                to="/#art-of-reading"
                className="nav-link hover:text-[#4cc9f0] transition"
              >
                Home
              </Link>
              <a
                onClick={() => setIsMenuOpen(false)}
                href="https://bhartiyambvp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link hover:text-[#4cc9f0] transition"
              >
                Bhartiyam
              </a>
              <Link
                onClick={() => setIsMenuOpen(false)}
                to="/#contact"
                className="nav-link hover:text-[#4cc9f0] transition"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavbarHome;
