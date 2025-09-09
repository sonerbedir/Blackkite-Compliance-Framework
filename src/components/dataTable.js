import { Pagination } from './pagination.js';
import { Input } from './input.js';

export class DataTable {
  constructor(rootEl, {
    withPageSize = true,
    withPagination = true,
    columns,
    pageSizeOptions = [10, 20, 50],
    initialPageSize = 10,
    searchable = true,
    filters = [],
    fetchData,
    idPrefix = 'dt',
    tableHeight = '73vh',
    disablePaginationOnMobile = true 
  }) {
    this.root = rootEl;
    this.columns = columns;
    this.idPrefix = idPrefix;
    this.tableHeight = tableHeight;
    this.pageSizeOptions = pageSizeOptions;
    this.state = { page: 1, pageSize: initialPageSize, q: '', sort: null, dir: 'asc', total: 0, filters: {} };
    this.searchable = searchable;
    this.filters = filters;
    this.fetchData = fetchData;
    this.pagination = null;
    this.withPagination = withPagination;
    this.withPageSize = withPageSize;
    this.disablePaginationOnMobile = disablePaginationOnMobile;
    this.isMobile = false;
    this._mount();
    this.reload();
    this._bindResize();
  }

  _checkMobile() {
    this.isMobile = window.innerWidth <= 992;
    this.isSmallScreen = window.innerWidth <= 1120;
  }

  _mount() {
    this._checkMobile();
    
    const searchHTML = this.searchable ? `
        <div id="${this.idPrefix}-q-wrap" style="max-width: 360px;"></div>` : '';

    const pageOptionHtml = this.pageSizeOptions.map(v => `<option ${v === this.state.pageSize ? 'selected' : ''}>${v}</option>`).join('');


    const shouldShowPageSize = this.withPageSize && (!this.disablePaginationOnMobile || !this.isMobile) && !this.isSmallScreen;

    const pageSizeHtml = shouldShowPageSize ? `
        <div class="d-flex align-items-center justify-content-between mt-3 table-footer">
          <div class="d-flex align-items-center gap-2">
            <label class="form-label m-0 table-page-size-info-text">Show</label>
            <select id="${this.idPrefix}-pageSize" class="form-select form-select-sm" style="width: 70px;">
              ${pageOptionHtml}
            </select>
            <span class="table-page-size-info-text">entries</span>
          </div>

          <div id="${this.idPrefix}-range" class="table-paginate-info-text"></div>

          <div class="pagination-container"></div>
        </div>
      ` : '';

    this.root.innerHTML = `
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center gap-2">
            ${searchHTML}
          </div>
        </div>
  
        <div id="${this.idPrefix}-area" class="table-area" style="max-height: ${this.tableHeight}; overflow:auto;">
          <div class="p-3 text-muted">Loading...</div>
        </div>
  
        ${pageSizeHtml}
      `;

    if (this.searchable) {
      const wrap = this.root.querySelector(`#${this.idPrefix}-q-wrap`);
      if (wrap) {
        new Input(wrap, {
          id: 'dt-q',
          name: 'search',
          label: 'Search',
          labelPosition: 'left',
          placeholder: 'Type to filter...',
          size: 'small',
          defaultValue: this.state.q,
          onChange: this._debounce((value) => {
            this.state.q = String(value || '').trim();
            this.state.page = 1;
            this.reload();
          }, 300)
        });
      }
    }
    

    this.root.querySelectorAll('[data-filter]').forEach(sel => {
      sel.addEventListener('change', e => {
        const key = e.target.getAttribute('data-filter');
        this.state.filters[key] = e.target.value;
        this.state.page = 1;
        this.reload();
      });
    });

    this.root.addEventListener('change', (e) => {
      const sel = e.target.closest(`#${this.idPrefix}-pageSize`);
      if (!sel) return;
      if (!this.withPageSize) return;
      this.state.pageSize = Number(sel.value);
      this.state.page = 1;
      this.reload();
    });

  }

  async reload() {
    this._checkMobile();
    
    const area = this.root.querySelector(`#${this.idPrefix}-area`);
    area.innerHTML = `<div class="p-3 text-muted">Loading...</div>`;

    try {

      const fetchParams = (this.isMobile && this.disablePaginationOnMobile) || this.isSmallScreen ? {
        page: 1, 
        pageSize: 1000,
        q: this.state.q,
        sort: this.state.sort, 
        dir: this.state.dir, 
        filters: this.state.filters, 
        withPageSize: false
      } : {
        page: this.state.page, 
        pageSize: this.state.pageSize, 
        q: this.state.q,
        sort: this.state.sort, 
        dir: this.state.dir, 
        filters: this.state.filters, 
        withPageSize: this.withPageSize
      };

      const { rows, total } = await this.fetchData(fetchParams);

      this.state.total = total || 0;

      if (!rows?.length) {
        area.innerHTML = `<div class="p-3 text-muted">No results</div>`;
      } else {
        area.innerHTML = this._renderTable(rows);
        this._bindSort(area);
      }

      const start = (this.state.page - 1) * this.state.pageSize + 1;
      const end = Math.min(this.state.page * this.state.pageSize, this.state.total);

      if (this.withPageSize && (!this.disablePaginationOnMobile || !this.isMobile) && !this.isSmallScreen) {
        this.root.querySelector(`#${this.idPrefix}-range`).textContent =
          this.state.total ? `Showing ${start} to ${end} of ${this.state.total} entries` : '';
      }

      if (this.withPagination && (!this.disablePaginationOnMobile || !this.isMobile) && !this.isSmallScreen) {
        this._updatePagination();
      }
    } catch (e) {
      area.innerHTML = `<div class="p-3 text-danger">Failed to load</div>`;
    }
  }

  _renderTable(rows) {
    const thead = `
        <thead class="table-light sticky-top">
          <tr>
            ${this.columns.map(c => `<th scope="col" ${c.width ? `style="width:${c.width}"` : ''} ${c.sortable ? 'data-sort="' + c.key + '"' : ''}>${c.label}</th>`).join('')}
          </tr>
        </thead>`;
    const tbody = rows.map((r, index) => `
        <tr>
          ${this.columns.map(c => `<td>${r[c.key] ?? ''}</td>`).join('')}
        </tr>
      `).join('');

    const tableView = `<table class="table table-sm align-middle mb-0">${thead}<tbody>${tbody}</tbody></table>`;
    
    const cardView = `
      <div class="data-cards">
        ${rows.map((row, index) => this._renderCard(row, index)).join('')}
      </div>
    `;
    
    return `
      <div class="data-table-desktop">
        ${tableView}
      </div>
      <div class="data-table-mobile">
        ${cardView}
      </div>
    `;
  }

  _renderCard(row, index) {
    const cardId = `card-${this.idPrefix}-${index}`;
    
    return `
      <div class="data-card" data-card-id="${cardId}">
        <div class="data-card-content">
          ${this.columns.map(col => {
            return `<div class="card-field">
              <span class="card-label">${col.label}:</span>
              <span class="card-value">${row[col.key] ?? ''}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  _bindSort(area) {
    area.querySelectorAll('th[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const key = th.getAttribute('data-sort');
        if (this.state.sort === key) { this.state.dir = this.state.dir === 'asc' ? 'desc' : 'asc'; }
        else { this.state.sort = key; this.state.dir = 'asc'; }
        this.state.page = 1;
        this.reload();
      });
    });
  }

  _bindResize() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = this.isMobile;
        const wasSmallScreen = this.isSmallScreen;
        this._checkMobile();

        if (wasMobile !== this.isMobile || wasSmallScreen !== this.isSmallScreen) {
          this._mount();
          this.reload();
        }
      }, 250);
    });
  }

  _updatePagination() {
    const totalPages = Math.max(1, Math.ceil(this.state.total / this.state.pageSize));
    const paginationContainer = this.root.querySelector('.pagination-container');

    if (!this.pagination) {
      this.pagination = new Pagination(paginationContainer, {
        currentPage: this.state.page,
        totalPages: totalPages,
        maxVisiblePages: 4,
        showFirstLast: true,
        showPreviousNext: true,
        onPageChange: (page) => {
          this.state.page = page;
          this.reload();
        }
      });
    } else {
      this.pagination.update({
        currentPage: this.state.page,
        totalPages: totalPages
      });
    }
  }

  _debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
}