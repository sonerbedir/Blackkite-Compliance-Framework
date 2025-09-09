
export class HeaderDropdown {
  constructor() {
    this.hamburgerBtn = document.getElementById('hamburger-toggle');
    this.headerDropdown = document.getElementById('header-dropdown');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    if (!this.hamburgerBtn || !this.headerDropdown) {
      console.warn('Header dropdown elements not found');
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    this.hamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
    
    document.addEventListener('click', (e) => {
      if (!this.hamburgerBtn.contains(e.target) && !this.headerDropdown.contains(e.target)) {
        this.close();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.headerDropdown.classList.add('show');
    this.hamburgerBtn.classList.add('active');
    this.isOpen = true;
  }

  close() {
    this.headerDropdown.classList.remove('show');
    this.hamburgerBtn.classList.remove('active');
    this.isOpen = false;
  }
}
