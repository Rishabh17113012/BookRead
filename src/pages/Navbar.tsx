import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  currentPage: number;
  numPages: number | null;
  isFlipping: boolean;
  onPageChange: (direction: "next" | "prev") => void;
  onGoToPage: (page: number) => void;
}

const Navbar = ({
  currentPage,
  numPages,
  isFlipping,
  onPageChange,
  onGoToPage,
}: NavbarProps) => {
  const [inputPage, setInputPage] = useState("");

  const handleGoToPage = () => {
    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum) && numPages && pageNum >= 1 && pageNum <= numPages) {
      onGoToPage(pageNum);
    }
    setInputPage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-card backdrop-blur-lg text-white py-2 px-4 flex items-center justify-between shadow-md z-40">
      <Link to="/">
        <button className="cybr-btn">
          <Home size={20} />
        </button>
      </Link>

      <div className="flex items-center gap-4">
        <button
          className="cybr-btn"
          onClick={() => onPageChange("prev")}
          disabled={currentPage <= 1 || isFlipping}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-m text-black">
          Page {currentPage} of {numPages}
        </span>
        <button
          className="cybr-btn"
          onClick={() => onPageChange("next")}
          disabled={currentPage >= (numPages || 0) || isFlipping}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Go To Page Input */}
      <div className="flex items-center text-black gap-2">
        <input
          type="number"
          min="1"
          max={numPages || 1}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Page"
          className="bg-transparent border border-black-400 rounded px-2 py-1 text-black placeholder-black-400 focus:outline-none focus:border-black"
        />
        <button onClick={handleGoToPage} className="cybr-btn text-black px-2 py-1 text-sm">
          Go
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
