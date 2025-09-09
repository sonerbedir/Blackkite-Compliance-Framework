export class Input {
    constructor(rootEl, {
        id,
        name,
        type = 'text',
        label = '',
        labelPosition = 'top',
        placeholder = '',
        defaultValue = '',
        size = 'default',
        fullWidth = false,
        disabled = false,
        className = '',
        onChange
      }) {
      this.root = rootEl;
      this.props = { id, name, type, label, labelPosition, placeholder, defaultValue, size, fullWidth, disabled, className, onChange };
      this._mount();
    }

    _mount(){
      const { id, name, type, label, labelPosition, placeholder, defaultValue, size, fullWidth, disabled, className } = this.props;

      const sizeClass = size === 'small' ? 'bk-input--small' : size === 'large' ? 'bk-input--large' : 'bk-input--default';
      const layoutClass = labelPosition === 'left' ? 'bk-input--label-left' : 'bk-input--label-top';
      const widthStyle = fullWidth ? 'style="width:100%;"' : '';

      this.root.innerHTML = `
        <div class="bk-input ${layoutClass} ${className}">
          ${label ? `<label class="bk-input__label" for="${id ?? ''}">${label}</label>` : ''}
          <input ${widthStyle}
            ${id ? `id="${id}"` : ''}
            ${name ? `name="${name}"` : ''}
            type="${type}"
            class="bk-input__control ${sizeClass}"
            placeholder="${placeholder}"
            ${disabled ? 'disabled' : ''}
            value="${this._escapeAttr(defaultValue)}"
          />
        </div>
      `;

      const input = this.root.querySelector('.bk-input__control');
      if (this.props.onChange) {
        input.addEventListener('input', (e)=>{
          this.props.onChange(e.target.value, e);
        });
      }
    }

    setValue(value){
      const input = this.root.querySelector('.bk-input__control');
      if (input) input.value = value ?? '';
    }

    getValue(){
      const input = this.root.querySelector('.bk-input__control');
      return input ? input.value : '';
    }

    focus(){
      const input = this.root.querySelector('.bk-input__control');
      if (input) input.focus();
    }

    _escapeAttr(v){
      return String(v ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    }
}