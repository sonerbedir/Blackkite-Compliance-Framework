export class TextArea {
  constructor(rootEl, {
    id,
    name,
    label = '',
    labelPosition = 'top',
    placeholder = '',
    defaultValue = '',
    rows = 4,
    fullWidth = true,
    disabled = false,
    className = '',
    onChange
  }) {
    this.root = rootEl;
    this.props = { id, name, label, labelPosition, placeholder, defaultValue, rows, fullWidth, disabled, className, onChange };
    this._mount();
  }

  _mount(){
    const { id, name, label, labelPosition, placeholder, defaultValue, rows, fullWidth, disabled, className } = this.props;
    const layoutClass = labelPosition === 'left' ? 'bk-textarea--label-left' : 'bk-textarea--label-top';
    const widthStyle = fullWidth ? 'style="width:100%;"' : '';

    this.root.innerHTML = `
      <div class="bk-textarea ${layoutClass} ${className}">
        ${label ? `<label class="bk-textarea__label" for="${id ?? ''}">${label}</label>` : ''}
        <textarea ${widthStyle}
          ${id ? `id="${id}"` : ''}
          ${name ? `name="${name}"` : ''}
          class="bk-textarea__control"
          placeholder="${placeholder}"
          rows="${rows}"
          ${disabled ? 'disabled' : ''}
        >${this._escapeContent(defaultValue)}</textarea>
      </div>
    `;

    const ta = this.root.querySelector('.bk-textarea__control');
    if (this.props.onChange) {
      ta.addEventListener('input', (e)=>{
        this.props.onChange(e.target.value, e);
      });
    }
  }

  setValue(value){
    const ta = this.root.querySelector('.bk-textarea__control');
    if (ta) ta.value = value ?? '';
  }

  getValue(){
    const ta = this.root.querySelector('.bk-textarea__control');
    return ta ? ta.value : '';
  }

  _escapeContent(v){
    return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}


