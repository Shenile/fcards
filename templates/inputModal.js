/**
 * Creates a customizable modal component
 * @param {Object} options - Configuration options for the modal
 * @param {string} options.title - Modal title
 * @param {HTMLElement|null} options.content - Modal content (or null for no content)
 * @param {Array} options.buttons - Array of button configurations
 * @param {boolean} options.closeOnOutsideClick - Whether to close when clicking outside
 * @returns {Object} - Returns modal elements and controller methods
 */
function createModal(options = {}) {
  // Default options
  const defaults = {
    title: '',
    content: null,
    buttons: [],
    closeOnOutsideClick: true
  };
  const config = { ...defaults, ...options };

  // Create modal elements
  const bgCont = document.createElement('div');
  bgCont.classList.add('modal-bg-cont');
  
  const modalCont = document.createElement('div');
  modalCont.classList.add('modal-cont');
  
  // Modal header
  const header = document.createElement('div');
  header.classList.add('modal-header');
  
  const titleEl = document.createElement('h3');
  titleEl.textContent = config.title;
  header.appendChild(titleEl);
  
  // Modal body
  const body = document.createElement('div');
  body.classList.add('modal-body');
  if (config.content) {
    body.appendChild(config.content);
  }
  
  // Modal footer
  const footer = document.createElement('div');
  footer.classList.add('modal-footer');
  
  config.buttons.forEach(btnConfig => {
    const btn = document.createElement('button');
    btn.textContent = btnConfig.text;
    btn.classList.add(btnConfig.class || '');
    btn.addEventListener('click', () => {
      if (btnConfig.action) btnConfig.action();
      if (btnConfig.closeOnClick !== false) close();
    });
    footer.appendChild(btn);
  });
  
  // Assemble modal
  modalCont.append(header, body, footer);
  bgCont.appendChild(modalCont);
  
  // Controller methods
  const open = () => {
    document.body.appendChild(bgCont);
    document.body.style.overflow = 'hidden';
  };
  
  const close = () => {
    document.body.removeChild(bgCont);
    document.body.style.overflow = '';
  };
  
  // Close modal when clicking outside
  if (config.closeOnOutsideClick) {
    bgCont.addEventListener('click', (e) => {
      if (e.target === bgCont) close();
    });
  }
  
  return {
    element: bgCont,
    container: modalCont,
    header,
    body,
    footer,
    open,
    close,
    updateContent: (newContent) => {
      body.innerHTML = '';
      if (newContent) body.appendChild(newContent);
    }
  };
}


const myModal = createModal({
  title: 'Create New Collection',
  content: document.createElement('form'), // Your form elements here
  buttons: [
    { text: 'Cancel', class: 'btn-cancel' },
    { 
      text: 'Save', 
      class: 'btn-primary',
      action: () => console.log('Saving...'),
      closeOnClick: false
    }
  ],
  closeOnOutsideClick: true
});

// Open the modal
myModal.open();

// Later you can update content
const newContent = document.createElement('div');
newContent.textContent = 'Updated content!';
myModal.updateContent(newContent);

// Close when needed
// myModal.close();