import $ from 'jquery';
import './styles/main.scss';

import { HeaderDropdown } from './modules/headerDropdown.js';
import { CustomFrameworkModal } from './modules/customFrameworkModal.js';
import { FrameworkCards } from './modules/frameworkCards.js';
import { EmptyState } from './modules/emptyState.js';

class App {
  constructor() {
    this.tableRoot = document.getElementById('table-wrap');
    this.sidebarRoot = document.querySelector('.shell__sidebar');
    this.addCustomFrameWork = document.getElementById('add-custom-framework');
    this.addCustomFrameWorkMobile = document.getElementById('add-custom-framework-mobile');
    
    this.modules = {};
    
    this.init();
  }

  init() {
    if (!this.tableRoot) {
      console.error('Table root element not found');
      return;
    }

    this.initializeModules();
    this.bindEvents();
  }

  initializeModules() {
    this.modules.headerDropdown = new HeaderDropdown();
    
    this.modules.customFrameworkModal = new CustomFrameworkModal();
    
    this.modules.frameworkCards = new FrameworkCards(this.sidebarRoot, this.tableRoot);
    
    this.modules.emptyState = new EmptyState(this.tableRoot, () => {
      this.modules.customFrameworkModal.show();
    });
  }

  bindEvents() {
    if (this.addCustomFrameWork) {
      this.addCustomFrameWork.addEventListener('click', () => {
        this.modules.customFrameworkModal.show();
      });
    }
    
    if (this.addCustomFrameWorkMobile) {
      this.addCustomFrameWorkMobile.addEventListener('click', () => {
        this.modules.customFrameworkModal.show();
      });
    }
  }
}

$(function () {
  new App();
});