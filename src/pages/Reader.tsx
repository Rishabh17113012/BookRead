import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Maximize, Minimize } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const Reader = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showTwoPages, setShowTwoPages] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Get selected PDF from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const file = queryParams.get("file");

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

  // Toggle Fullscreen Mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Listen for Fullscreen Exit
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  // Handle Swipe Gestures (Mobile & Tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;

    if (deltaX > 50 && currentPage < (numPages || 0)) {
      // Swipe Left - Next Page
      setCurrentPage((prev) => Math.min(prev + (showTwoPages ? 2 : 1), numPages || 0));
    } else if (deltaX < -50 && currentPage > 1) {
      // Swipe Right - Previous Page
      setCurrentPage((prev) => Math.max(prev - (showTwoPages ? 2 : 1), 1));
    }

    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Navbar - Hidden in Fullscreen Mode */}
      {!isFullScreen && (
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

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullScreen}
            className="text-white bg-[#4cc9f0] hover:bg-[#4361ee] px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Maximize size={20} />
            Fullscreen
          </button>
        </nav>
      )}

      {/* Small Exit Fullscreen Button */}
      {isFullScreen && (
        <button
          onClick={toggleFullScreen}
          className="fixed top-4 right-4 bg-[#f72585] text-white p-2 rounded-full shadow-lg hover:bg-[#ff006e] z-50"
        >
          <Minimize size={24} />
        </button>
      )}

      {/* PDF Viewer - Prevents Sliding Above Navbar */}
      <main
        className={`container mx-auto px-4 ${isFullScreen ? "pt-4 pb-4" : "pt-20 pb-12"} flex-grow flex flex-col items-center`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ marginTop: isFullScreen ? 0 : "4rem" }} // Keeps content below navbar
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
              height={isMobile && isFullScreen ? window.innerHeight - 50 : undefined}
            />

            {/* Second Page (Only in Two-Page View Mode) */}
            {showTwoPages && currentPage + 1 <= (numPages || 0) && (
              <Page
                pageNumber={currentPage + 1}
                className="shadow-lg bg-white rounded-lg"
                width={isMobile ? window.innerWidth - 20 : 600}
                height={isMobile && isFullScreen ? window.innerHeight - 50 : undefined}
              />
            )}
          </Document>
        </div>
      </main>
    </div>
  );
};

export default Reader;
