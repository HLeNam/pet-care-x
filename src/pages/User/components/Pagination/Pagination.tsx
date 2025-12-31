import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex w-fit items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-2 shadow-md'>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white'
      >
        <ChevronLeft className='h-5 w-5' />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className='flex h-10 w-10 items-center justify-center text-gray-500'>
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border font-semibold transition-colors ${
              isActive
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white'
      >
        <ChevronRight className='h-5 w-5' />
      </button>
    </div>
  );
};

export default Pagination;
