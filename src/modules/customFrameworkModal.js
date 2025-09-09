import Modal from 'bootstrap/js/dist/modal';
import { Stepper } from '../components/stepper';
import { Input } from '../components/input';
import { TextArea } from '../components/textarea';
import { DataTable } from '../components/dataTable';

export class CustomFrameworkModal {
  constructor() {
    this.modalEl = document.getElementById('customFrameworkModal');
    this.modal = new Modal(this.modalEl);
    this.stepper = null;
    this.isFormValid = false;
    
    this.init();
  }

  init() {
    if (!this.modalEl) {
      console.warn('Custom framework modal element not found');
      return;
    }

    this.bindEvents();
    this.initializeForm();
  }

  bindEvents() {
    this.modalEl.addEventListener('shown.bs.modal', () => {
      this.stepper.setCurrentStep(1);
      this.showStepContent(1);
      
      setTimeout(() => {
        this.addFormValidationListeners();
        this.updateNextButtonState();
      }, 100);
    });

    this.modalEl.addEventListener('hidden.bs.modal', () => {
      this.resetModal();
    });

    document.getElementById('f-next')?.addEventListener('click', () => {
      if (this.isFormValid) {
        this.stepper.setCurrentStep(2);
      }
    });

    document.getElementById('f-previous')?.addEventListener('click', () => {
      this.stepper.setCurrentStep(1);
      this.updateNextButtonState();
    });

    document.getElementById('f-add-control')?.addEventListener('click', () => {
      console.log('Add Control Items clicked');
    });

    document.getElementById('f-save')?.addEventListener('click', () => {
      console.log('Save clicked');
    });
  }

  initializeForm() {
    this.stepper = new Stepper(document.getElementById('stepper-container'), {
      steps: [
        { label: 'Framework Details' },
        { label: 'Control Items' },
      ],
      currentStep: 1,
      onStepChange: (step) => {
        this.showStepContent(step);
      }
    });

    new Input(document.getElementById('f-name'), {
      id: 'frameworkName',
      label: 'Name',
      labelPosition: 'top',
      placeholder: 'Enter name',
      size: 'small',
      onChange: (val) => { console.log(val) }
    });

    new Input(document.getElementById('f-shortname'), {
      id: 'frameworkShortName',
      label: 'Short Name',
      labelPosition: 'top',
      placeholder: 'Enter short name',
      size: 'small',
      onChange: () => { }
    });

    new TextArea(document.getElementById('f-desc'), {
      id: 'frameworkDesc',
      label: 'Description',
      placeholder: 'Please add description',
      rows: 5,
      onChange: () => { }
    });
  }

  showStepContent(step) {
    document.querySelectorAll('.step-content').forEach(content => {
      content.style.display = 'none';
    });

    document.querySelectorAll('.step-footer').forEach(footer => {
      footer.style.display = 'none';
    });

    const currentStepContent = document.getElementById(`step-${step}-content`);
    if (currentStepContent) {
      currentStepContent.style.display = 'block';
    }

    const currentStepFooter = document.getElementById(`step-${step}-footer`);
    if (currentStepFooter) {
      currentStepFooter.style.display = 'flex';
    }

    const stepIndicator = document.getElementById('modal-step-indicator');
    if (stepIndicator) {
      const totalSteps = this.stepper.steps.length;
      stepIndicator.textContent = `${step}/${totalSteps}`;
    }

    if (step === 2) {
      this.initializeModalTable();
      const alertContainer = document.getElementById('alert-container');
      if (alertContainer) {
        alertContainer.style.display = 'none';
      }
    }

    this.updateNextButtonState();
    
    if (step === 1) {
      setTimeout(() => {
        this.addFormValidationListeners();
      }, 50);
    }
  }

  initializeModalTable() {
    const tableContainer = document.getElementById('modal-table-container');
    if (tableContainer && !tableContainer.querySelector('.table-wrap')) {
      const columns = [
        { key: 'controlId', label: 'Control ID', width: '140px', sortable: true },
        { key: 'category', label: 'Control Category', width: '240px', sortable: true },
        { key: 'description', label: 'Control Description', sortable: false },
      ];

      const dummy = Array.from({ length: 83 }, (_, i) => ({
        controlId: `Article ${i + 1}`,
        category: i % 2 ? 'Business Contact Information' : 'Technical & Org. Measures',
        categoryKey: i % 2 ? 'bci' : 'tom',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      }));

      const fetchData = async ({ page, pageSize, q, sort, dir, filters, withPageSize }) => {
        let rows = dummy;
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

      new DataTable(tableContainer, {
        withPageSize: false,
        withPagination: false,
        columns,
        filters,
        searchable: false,
        initialPageSize: 10,
        fetchData,
        idPrefix: 'modal-dt',
        tableHeight: '570px'
      });
    }
  }

  validateForm() {
    const nameInput = document.getElementById('f-name')?.querySelector('input');
    const shortNameInput = document.getElementById('f-shortname')?.querySelector('input');
    const descTextarea = document.getElementById('f-desc')?.querySelector('textarea');
    
    const isNameValid = nameInput && nameInput.value.trim() !== '';
    const isShortNameValid = shortNameInput && shortNameInput.value.trim() !== '';
    const isDescValid = descTextarea && descTextarea.value.trim() !== '';
    
    return isNameValid && isShortNameValid && isDescValid;
  }

  updateNextButtonState() {
    const nextButton = document.getElementById('f-next');
    if (nextButton) {
      this.isFormValid = this.validateForm();
      nextButton.disabled = !this.isFormValid;
      
      if (this.isFormValid) {
        nextButton.classList.remove('btn-secondary');
        nextButton.classList.add('btn-success');
      } else {
        nextButton.classList.remove('btn-success');
        nextButton.classList.add('btn-secondary');
      }
    }
  }

  addFormValidationListeners() {
    const nameInput = document.getElementById('f-name')?.querySelector('input');
    const shortNameInput = document.getElementById('f-shortname')?.querySelector('input');
    const descTextarea = document.getElementById('f-desc')?.querySelector('textarea');
    
    [nameInput, shortNameInput, descTextarea].forEach(input => {
      if (input) {
        input.removeEventListener('input', this.updateNextButtonState.bind(this));
        input.addEventListener('input', this.updateNextButtonState.bind(this));
      }
    });
  }

  resetModal() {
    const tableContainer = document.getElementById('modal-table-container');
    if (tableContainer) {
      tableContainer.innerHTML = '';
    }

    this.clearFormInputs();

    this.isFormValid = false;
    
    this.stepper.setCurrentStep(1);
    this.showStepContent(1);
  }

  clearFormInputs() {
    const nameInput = document.getElementById('f-name')?.querySelector('input');
    if (nameInput) {
      nameInput.value = '';
    }

    const shortNameInput = document.getElementById('f-shortname')?.querySelector('input');
    if (shortNameInput) {
      shortNameInput.value = '';
    }

    const descTextarea = document.getElementById('f-desc')?.querySelector('textarea');
    if (descTextarea) {
      descTextarea.value = '';
    }

    const fileInput = document.getElementById('f-template');
    if (fileInput) {
      fileInput.value = '';
    }

    const logoCheckbox = document.getElementById('f-logo');
    if (logoCheckbox) {
      logoCheckbox.checked = false;
    }

    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      alertContainer.style.display = 'flex';
    }
  }

  show() {
    this.clearFormInputs();
    this.isFormValid = false;
    
    this.modal.show();
  }
}
