import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Bookmark, BookmarkCheck } from "lucide-react";

interface NavbarProps {
  currentPage: number;
  numPages: number | null;
  isFlipping: boolean;
  bookmarks: number[];
  onPageChange: (direction: 'next' | 'prev') => void;
  onToggleBookmark: () => void;
}

const Navbar = ({ currentPage, numPages, isFlipping, bookmarks, onPageChange, onToggleBookmark }: NavbarProps) => {
  return (
    <nav className="fixed top-0 w-full bg-[#09001a] text-white py-2 px-4 flex items-center justify-between shadow-md z-40">
      <Link to="/">
        <Button variant="ghost" className="text-white hover:text-gray-300">
          <Home size={20} />
        </Button>
      </Link>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="border-gray-300 text-gray-300 hover:border-white hover:text-white"
          onClick={() => onPageChange('prev')}
          disabled={currentPage <= 1 || isFlipping}
        >
          <ChevronLeft size={20} />
        </Button>
        <span className="text-sm text-gray-300">
          Page {currentPage} of {numPages}
        </span>
        <Button
          variant="outline"
          className="border-gray-300 text-gray-300 hover:border-white hover:text-white"
          onClick={() => onPageChange('next')}
          disabled={currentPage >= (numPages || 0) || isFlipping}
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      <Button
        onClick={onToggleBookmark}
        variant="ghost"
        className="text-white hover:text-yellow-400"
        disabled={isFlipping}
      >
        {bookmarks.includes(currentPage) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
      </Button>
    </nav>
  );
};

export default Navbar;