import $ from 'jquery';
import { DataTable } from '../components/dataTable';

export class FrameworkCards {
  constructor(sidebarRoot, tableRoot) {
    this.sidebarRoot = sidebarRoot;
    this.tableRoot = tableRoot;
    this.selectedFramework = null;
    
    this.init();
  }

  init() {
    if (!this.sidebarRoot) {
      console.warn('Sidebar root element not found');
      return;
    }

    this.loadFrameworkCards();
  }

  loadFrameworkCards() {
    $.ajax({
      url: 'http://localhost:3000/frameworks',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        this.renderFrameworkCards(data);
      },
      error: (xhr, status, error) => {
        console.error('Framework kartları yüklenirken hata:', error);
        this.showErrorState();
      }
    });
  }

  renderFrameworkCards(frameworks) {
    if (!this.sidebarRoot) return;

    if (!frameworks || frameworks.length === 0) {
      this.sidebarRoot.innerHTML = '<div class="text-center p-4 text-muted">No frameworks found</div>';
      return;
    }

    const cardsHTML = frameworks.map((framework, index) => `
      <div class="framework-card-container" data-framework-id="${framework.id || index}">
        <div class="framework-card-logo">
          ${framework?.logo ? `<img src="${framework.logo}" height="80" width="80" alt="${framework?.name}">` : ''}
        </div>
        <div class="framework-card-content">
          <div class="framework-card-title">${framework?.title}</div>
          <div class="framework-card-name">${framework?.name}</div>
          <div class="framework-card-description">${framework?.description}</div>
        </div>
      </div>
    `).join('');

    this.sidebarRoot.innerHTML = cardsHTML;
    this.addFrameworkCardListeners();
  }

  addFrameworkCardListeners() {
    const cards = this.sidebarRoot.querySelectorAll('.framework-card-container');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        this.selectFramework(card);
      });
    });
  }

  selectFramework(card) {
    this.sidebarRoot.querySelectorAll('.framework-card-container').forEach(c => {
      c.classList.remove('selected');
    });
    
    card.classList.add('selected');
    
    this.selectedFramework = card.dataset.frameworkId;
    
    this.loadControlsTable();
  }

  loadControlsTable() {
    $.ajax({
      url: 'http://localhost:3000/controls',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        this.renderControlsTable(data);
      },
      error: (xhr, status, error) => {
        console.error('Controls yüklenirken hata:', error);
      }
    });
  }

  renderControlsTable(controls) {
    const columns = [
      { key: 'controlId', label: 'Control ID', width: '140px', sortable: true },
      { key: 'category', label: 'Control Category', width: '240px', sortable: true },
      { key: 'description', label: 'Control Description', sortable: false },
    ];

    const fetchData = async ({ page, pageSize, q, sort, dir, filters, withPageSize }) => {
      let rows = controls;
      
      if (filters?.category) rows = rows.filter(r => r.categoryKey === filters.category);
      if (q) {
        const qq = q.toLowerCase();
        rows = rows.filter(r =>
          r.controlId.toLowerCase().includes(qq) ||
          r.category.toLowerCase().includes(qq) ||
          r.description.toLowerCase().includes(qq)
        );
      }
      if (sort) {
        rows = rows.slice().sort((a, b) => {
          const A = (a[sort] ?? '').toString().toLowerCase();
          const B = (b[sort] ?? '').toString().toLowerCase();
          return dir === 'asc' ? (A > B ? 1 : A < B ? -1 : 0) : (A < B ? 1 : A > B ? -1 : 0);
        });
      }
      const total = rows.length;
      const start = (page - 1) * pageSize;
      return { rows: rows.slice(start, withPageSize ? start + pageSize : total), total };
    };

    const filters = [
      {
        key: 'category', label: 'Category', options: [
          { value: '', label: 'All' },
          { value: 'bci', label: 'Business Contact Information' },
          { value: 'tom', label: 'Technical & Org. Measures' }
        ]
      }
    ];

    new DataTable(this.tableRoot, {
      withPageSize: true,
      withPagination: true,
      columns,
      filters,
      searchable: true,
      initialPageSize: 10,
      fetchData
    });
  }

  showErrorState() {
    if (this.sidebarRoot) {
      this.sidebarRoot.innerHTML = '<div class="text-center p-4 text-danger">Error loading frameworks</div>';
    }
  }
}
