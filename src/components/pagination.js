export class Pagination {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      currentPage: 1,
      totalPages: 1,
      maxVisiblePages: 4,
      showFirstLast: true,
      showPreviousNext: true,
      onPageChange: () => {},
      ...options
    };
    
    this._render();
    this._bindEvents();
  }

  update(options) {
    this.options = { ...this.options, ...options };
    this._render();
    this._bindEvents();
  }

  _render() {
    const { currentPage, totalPages, maxVisiblePages, showFirstLast, showPreviousNext } = this.options;
    
    if (totalPages <= 1) {
      this.container.innerHTML = '';
      return;
    }

    let paginationHTML = '';
    
    if (showPreviousNext) {
      paginationHTML += `
        <button type="button" class="btn btn-outline-secondary btn-sm pagination-btn pagination-prev" 
                ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
          Previous
        </button>`;
    }

    let startPage, endPage;
    
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 2;
      }
    }

    if (showFirstLast && startPage > 1) {
      paginationHTML += `<button type="button" class="btn btn-outline-secondary btn-sm pagination-btn pagination-number" data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage;
      paginationHTML += `
        <button type="button" class="btn ${isActive ? 'btn-primary' : 'btn-outline-secondary'} btn-sm pagination-btn pagination-number" 
                data-page="${i}">${i}</button>`;
    }

    if (showFirstLast && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
      paginationHTML += `<button type="button" class="btn btn-outline-secondary btn-sm pagination-btn pagination-number" data-page="${totalPages}">${totalPages}</button>`;
    }

    if (showPreviousNext) {
      paginationHTML += `
        <button type="button" class="btn btn-outline-secondary btn-sm pagination-btn pagination-next" 
                ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
          Next
        </button>`;
    }

    this.container.innerHTML = paginationHTML;
  }

  _bindEvents() {
    this.container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(e.target.getAttribute('data-page'));
        const { currentPage, totalPages, onPageChange } = this.options;
        
        if (page >= 1 && page <= totalPages && page !== currentPage) {
          onPageChange(page);
        }
      });
    });
  }

  setCurrentPage(page) {
    if (page >= 1 && page <= this.options.totalPages) {
      this.update({ currentPage: page });
    }
  }

  setTotalPages(pages) {
    this.update({ totalPages: pages });
  }

  getCurrentPage() {
    return this.options.currentPage;
  }

  getTotalPages() {
    return this.options.totalPages;
  }
}
