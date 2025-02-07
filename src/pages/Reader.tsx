import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Bookmark, BookmarkCheck } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const Reader = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showTwoPages, setShowTwoPages] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Get selected PDF from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const file = queryParams.get("file");

  // Load Saved Progress & Bookmarks
  useEffect(() => {
    const savedPage = localStorage.getItem(`pdf_progress_${file}`);
    if (savedPage) setCurrentPage(parseInt(savedPage, 10));

    const savedBookmarks = localStorage.getItem(`pdf_bookmarks_${file}`);
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, [file]);

  // Save Progress when Page Changes
  useEffect(() => {
    if (file) localStorage.setItem(`pdf_progress_${file}`, currentPage.toString());
  }, [currentPage, file]);

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      setShowTwoPages(window.innerWidth >= 1024);
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentPage < (numPages || 0)) {
        setCurrentPage((prev) => Math.min(prev + (showTwoPages ? 2 : 1), numPages || 0));
      } else if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prev) => Math.max(prev - (showTwoPages ? 2 : 1), 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, numPages, showTwoPages]);

  // Handle Bookmark Toggle
  const toggleBookmark = () => {
    setBookmarks((prev) => {
      const updatedBookmarks = prev.includes(currentPage)
        ? prev.filter((page) => page !== currentPage)
        : [...prev, currentPage];

      localStorage.setItem(`pdf_bookmarks_${file}`, JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };

  // Go to Bookmarked Page with Smooth Scroll
  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById("pdf-container")?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle Touch Start (Swipe Detection)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // Handle Touch End (Detect Swipe Direction)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchDiff = touchStartX - touchEndX;

    if (touchDiff > 50 && currentPage < (numPages || 0)) {
      // Swipe Left (Next Page)
      setCurrentPage((prev) => Math.min(prev + 1, numPages || 0));
    } else if (touchDiff < -50 && currentPage > 1) {
      // Swipe Right (Previous Page)
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }

    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#09001a] text-white py-2 px-4 flex items-center justify-between shadow-md z-50">
        {/* Home Button */}
        <Link to="/">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            <Home size={20} />
          </Button>
        </Link>

        {/* Navigation & Page Number */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-300 hover:border-white hover:text-white"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="text-sm text-gray-300">
            Page {currentPage} of {numPages}
          </span>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-300 hover:border-white hover:text-white"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages || 0))}
            disabled={currentPage >= (numPages || 0)}
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Bookmark Button */}
        <Button
          onClick={toggleBookmark}
          variant="ghost"
          className="text-white hover:text-yellow-400"
        >
          {bookmarks.includes(currentPage) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </Button>
      </nav>

      {/* PDF Viewer */}
      <main
        id="pdf-container"
        className="container mx-auto px-4 pt-20 pb-12 flex-grow flex flex-col items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center">
          <Document
            file={`/${file}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="flex justify-center gap-1 lg:gap-2"
          >
            {/* First Page */}
            <Page
              pageNumber={currentPage}
              className="shadow-lg bg-white rounded-lg"
              width={isMobile ? window.innerWidth - 20 : 600}
            />

            {/* Second Page (Only in Two-Page View Mode) */}
            {showTwoPages && currentPage + 1 <= (numPages || 0) && (
              <Page
                pageNumber={currentPage + 1}
                className="shadow-lg bg-white rounded-lg"
                width={isMobile ? window.innerWidth - 20 : 600}
              />
            )}
          </Document>
        </div>
      </main>
    </div>
  );
};

export default Reader;
