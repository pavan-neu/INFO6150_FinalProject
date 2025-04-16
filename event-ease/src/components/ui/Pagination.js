// src/components/ui/Pagination.js
import { Pagination as BootstrapPagination } from "react-bootstrap";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  size = "md",
  maxPagesDisplayed = 5,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];

    // Calculate start and end pages to display
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPagesDisplayed / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPagesDisplayed - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesDisplayed) {
      startPage = Math.max(1, endPage - maxPagesDisplayed + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <BootstrapPagination size={size} className="justify-content-center mt-4">
      {/* First page */}
      <BootstrapPagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />

      {/* Previous page */}
      <BootstrapPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {/* Page numbers */}
      {getPageNumbers().map((page) => (
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </BootstrapPagination.Item>
      ))}

      {/* Next page */}
      <BootstrapPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />

      {/* Last page */}
      <BootstrapPagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </BootstrapPagination>
  );
};

export default Pagination;
