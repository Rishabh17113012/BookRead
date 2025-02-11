import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import Navbar from "./Navbar";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const Reader = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showTwoPages, setShowTwoPages] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [showSwipeAlert, setShowSwipeAlert] = useState(isMobile);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const file = queryParams.get("file");

  const calculatePageDimensions = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const navbarHeight = 64;
    const padding = 32;
    const availableHeight = screenHeight - navbarHeight - padding;
    const standardPDFRatio = 1.414;

    if (screenWidth < 768) {
      const maxWidth = screenWidth - padding * 2;
      const calculatedHeight = maxWidth * standardPDFRatio * 1.4;
      
      setPageDimensions({
        width: maxWidth,
        height: calculatedHeight
      });
    } else {
      const maxWidth = showTwoPages 
        ? (screenWidth - padding * 3) / 2
        : screenWidth - padding * 2;
      const maxHeight = availableHeight;

      if (maxWidth / standardPDFRatio > maxHeight) {
        setPageDimensions({
          height: maxHeight,
          width: maxHeight * (1 / standardPDFRatio)
        });
      } else {
        setPageDimensions({
          width: maxWidth,
          height: maxWidth * standardPDFRatio
        });
      }
    }
  }, [showTwoPages]);

  const changePage = useCallback((direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    setFlipDirection(direction);
    setIsFlipping(true);
    
    setTimeout(() => {
      if (direction === 'next' && currentPage < (numPages || 0)) {
        setCurrentPage(prev => Math.min(prev + (showTwoPages ? 2 : 1), numPages || 0));
      } else if (direction === 'prev' && currentPage > 1) {
        setCurrentPage(prev => Math.max(prev - (showTwoPages ? 2 : 1), 1));
      }
      
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 400);
    }, 200);
  }, [isFlipping, currentPage, numPages, showTwoPages]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setShowTwoPages(width >= 1024);
      setIsMobile(width < 768);
      calculatePageDimensions();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculatePageDimensions]);

  useEffect(() => {
    const savedPage = localStorage.getItem(`pdf_progress_${file}`);
    if (savedPage) setCurrentPage(parseInt(savedPage, 10));

    const savedBookmarks = localStorage.getItem(`pdf_bookmarks_${file}`);
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, [file]);

  useEffect(() => {
    if (file) localStorage.setItem(`pdf_progress_${file}`, currentPage.toString());
  }, [currentPage, file]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === "ArrowRight" && currentPage < (numPages || 0)) {
        e.preventDefault();
        changePage('next');
      } else if (e.key === "ArrowLeft" && currentPage > 1) {
        e.preventDefault();
        changePage('prev');
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [changePage, currentPage, numPages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchDiff = touchStartX - touchEndX;

    if (touchDiff > 50 && currentPage < (numPages || 0)) {
      changePage('next');
    } else if (touchDiff < -50 && currentPage > 1) {
      changePage('prev');
    }

    setTouchStartX(null);
  };

  const toggleBookmark = () => {
    setBookmarks((prev) => {
      const updatedBookmarks = prev.includes(currentPage)
        ? prev.filter((page) => page !== currentPage)
        : [...prev, currentPage];

      localStorage.setItem(`pdf_bookmarks_${file}`, JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-hidden">
      {isMobile && showSwipeAlert && (
        <div
          className="fixed top-0 left-0 w-full bg-black text-white text-sm px-4 py-2 text-center shadow-md z-50 cursor-pointer"
          onClick={() => setShowSwipeAlert(false)}
        >
          Swipe left or right to turn pages!
        </div>
      )}

      <Navbar
        currentPage={currentPage}
        numPages={numPages}
        isFlipping={isFlipping}
        bookmarks={bookmarks}
        onPageChange={changePage}
        onToggleBookmark={toggleBookmark}
      />

      <main
        id="pdf-container"
        className="container mx-auto px-4 pt-20 pb-12 flex-grow flex flex-col items-center justify-center perspective"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`flex justify-center ${showTwoPages ? 'items-start book-shadow' : ''} 
            ${isFlipping ? 'flipping' : ''} 
            ${flipDirection === 'next' ? 'flip-next' : ''} 
            ${flipDirection === 'prev' ? 'flip-prev' : ''}`}
        >
          <Document
            file={`/${file}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className={`flex justify-center ${showTwoPages ? 'book-spread' : ''}`}
            loading={
              <div className="flex items-center justify-center w-full h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              className={`bg-white ${
                showTwoPages 
                  ? 'rounded-l-lg rounded-r-none border-r border-gray-300' 
                  : 'rounded-lg shadow-lg'
              }`}
              width={pageDimensions.width}
              height={pageDimensions.height}
              loading={
                <div className="flex items-center justify-center w-full h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              }
            />

            {showTwoPages && currentPage + 1 <= (numPages || 0) && (
              <Page
                pageNumber={currentPage + 1}
                className="bg-white rounded-r-lg rounded-l-none"
                width={pageDimensions.width}
                height={pageDimensions.height}
                loading={
                  <div className="flex items-center justify-center w-full h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                }
              />
            )}
          </Document>
        </div>
      </main>

      <style>{`
        .perspective {
          perspective: 2000px;
          perspective-origin: 50% 50%;
        }

        .book-spread {
          display: flex;
          background: white;
          border-radius: 8px;
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
          position: relative;
          transform-origin: center left;
        }

        .book-spread .react-pdf__Page {
          margin: 0 !important;
          backface-visibility: hidden;
        }

        .book-spread::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05));
          transform: translateX(-50%);
        }

        .flipping {
          transition: transform 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .flip-next {
          animation: flipNextRealistic 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .flip-prev {
          animation: flipPrevRealistic 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        @keyframes flipNextRealistic {
          0% {
            transform: rotateY(0) translateZ(0);
            box-shadow: -5px 5px 5px rgba(0,0,0,0.1);
          }
          50% {
            transform: rotateY(-35deg) translateZ(50px);
            box-shadow: -20px 10px 15px rgba(0,0,0,0.15);
          }
          100% {
            transform: rotateY(0) translateZ(0);
            box-shadow: -5px 5px 5px rgba(0,0,0,0.1);
          }
        }

        @keyframes flipPrevRealistic {
          0% {
            transform: rotateY(0) translateZ(0);
            box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
          }
          50% {
            transform: rotateY(35deg) translateZ(50px);
            box-shadow: 20px 10px 15px rgba(0,0,0,0.15);
          }
          100% {
            transform: rotateY(0) translateZ(0);
            box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
          }
        }

        .book-shadow {
          position: relative;
        }

        .book-shadow::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -20px;
          height: 20px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.12), transparent);
          filter: blur(8px);
          transform-origin: center;
          transform: perspective(100px) rotateX(40deg);
          opacity: 0.8;
        }

        .book-spread::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 3px;
          left: -3px;
          background: linear-gradient(to right,
            rgba(0,0,0,0.05),
            rgba(0,0,0,0.02) 50%,
            rgba(255,255,255,0.05) 100%
          );
          border-radius: 2px 0 0 2px;
          transform: translateZ(-1px);
        }

        .book-spread:hover {
          transform: translateZ(5px);
          box-shadow: 
            -5px 5px 10px rgba(0,0,0,0.1),
            -1px 1px 2px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .flip-next, .flip-prev {
            animation-duration: 0.35s;
          }
          
          .perspective {
            perspective: 1500px;
          }
        }
      `}</style>
    </div>
  );
};

export default Reader;