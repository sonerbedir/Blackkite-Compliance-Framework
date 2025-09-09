
export class EmptyState {
  constructor(tableRoot, onAddFrameworkClick) {
    this.tableRoot = tableRoot;
    this.onAddFrameworkClick = onAddFrameworkClick;
    
    this.init();
  }

  init() {
    if (!this.tableRoot) {
      console.warn('Table root element not found');
      return;
    }

    this.show();
  }

  show() {
    if (this.tableRoot) {
      this.tableRoot.innerHTML = `
        <div class="empty-state-container">
          <div class="empty-state-icon">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 56H28.8V84.8H0M67.2 27.2H38.4V36.8H67.2M0 36.8H28.8V8H0M38.4 8V17.6H96V8M38.4 84.8H67.2V75.2H38.4M38.4 65.6H96V56H38.4" fill="#212529"/>
            </svg>
          </div>
          <div class="empty-state-content">
            <h3 class="empty-state-title">Please select framework from list in left side</h3>
            <p class="empty-state-description">or <span href="#" id="add-new-framework-link" class="empty-state-link">click here</span> to add new framework</p>
          </div>
        </div>
      `;

      this.bindEvents();
    }
  }

  bindEvents() {
    const addNewFrameworkLink = document.getElementById('add-new-framework-link');
    if (addNewFrameworkLink) {
      addNewFrameworkLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.onAddFrameworkClick();
      });
    }
  }

  hide() {
    if (this.tableRoot) {
      this.tableRoot.innerHTML = '';
    }
  }
}
