// Central tool metadata registry
export const TOOLS = [
  // ─── DOCUMENT TOOLS ──────────────────────────────────
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert one or multiple images into a single PDF file instantly.',
    category: 'document',
    emoji: '🖼️',
    route: 'jpg-to-pdf',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    acceptAttr: '.jpg,.jpeg,.png,.webp',
    maxSizeMB: 20,
    processingType: 'browser',
    outputFormat: '.pdf',
    status: 'active',
    displayOrder: 1,
    seo: { title: 'JPG to PDF Converter | Best Computer', description: 'Convert JPG, PNG images to PDF instantly online. Free, no signup.' }
  },
  {
    id: 'pdf-merge',
    name: 'PDF Merge',
    description: 'Combine multiple PDF files into one single PDF document.',
    category: 'document',
    emoji: '📎',
    route: 'pdf-merge',
    acceptedTypes: ['application/pdf'],
    acceptAttr: '.pdf',
    maxSizeMB: 50,
    processingType: 'browser',
    outputFormat: '.pdf',
    status: 'active',
    displayOrder: 2,
    seo: { title: 'PDF Merge Tool | Best Computer', description: 'Merge multiple PDF files into one. Free online PDF merger.' }
  },
  {
    id: 'pdf-compress',
    name: 'PDF Compress',
    description: 'Reduce the file size of your PDF without losing quality.',
    category: 'document',
    emoji: '🗜️',
    route: 'pdf-compress',
    acceptedTypes: ['application/pdf'],
    acceptAttr: '.pdf',
    maxSizeMB: 50,
    processingType: 'browser',
    outputFormat: '.pdf',
    status: 'active',
    displayOrder: 3,
    seo: { title: 'PDF Compress | Best Computer', description: 'Compress PDF files to reduce size. Free online PDF compressor.' }
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Word (.docx) documents to PDF easily.',
    category: 'document',
    emoji: '📝',
    route: 'word-to-pdf',
    acceptedTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    acceptAttr: '.docx',
    maxSizeMB: 10,
    processingType: 'browser',
    outputFormat: '.pdf',
    status: 'active',
    displayOrder: 4,
    seo: { title: 'Word to PDF Converter | Best Computer', description: 'Convert Word documents to PDF online for free.' }
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents.',
    category: 'document',
    emoji: '📄',
    route: 'pdf-to-word',
    acceptedTypes: ['application/pdf'],
    acceptAttr: '.pdf',
    maxSizeMB: 10,
    processingType: 'browser',
    outputFormat: '.docx',
    status: 'coming-soon',
    displayOrder: 5,
    seo: { title: 'PDF to Word Converter | Best Computer', description: 'Convert PDF to editable Word documents online.' }
  },

  // ─── IMAGE TOOLS ─────────────────────────────────────
  {
    id: 'image-resize',
    name: 'Image Resize',
    description: 'Resize any image to exact dimensions or a percentage.',
    category: 'image',
    emoji: '📐',
    route: 'image-resize',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    acceptAttr: '.jpg,.jpeg,.png,.webp',
    maxSizeMB: 15,
    processingType: 'browser',
    outputFormat: '.jpg / .png',
    status: 'active',
    displayOrder: 6,
    seo: { title: 'Image Resize Tool | Best Computer', description: 'Resize images online for free. Change dimensions or percentage easily.' }
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Automatically remove the background from any photo.',
    category: 'image',
    emoji: '✂️',
    route: 'background-remover',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    acceptAttr: '.jpg,.jpeg,.png,.webp',
    maxSizeMB: 10,
    processingType: 'browser',
    outputFormat: '.png',
    status: 'coming-soon',
    displayOrder: 7,
    seo: { title: 'Background Remover | Best Computer', description: 'Remove photo backgrounds automatically. Free online tool.' }
  },

  // ─── PHOTO TOOLS ─────────────────────────────────────
  {
    id: 'passport-photo',
    name: 'Passport Photo Maker',
    description: 'Create standard passport-size photos (2x2 inch) ready to print.',
    category: 'photo',
    emoji: '🛂',
    route: 'passport-photo',
    acceptedTypes: ['image/jpeg', 'image/png'],
    acceptAttr: '.jpg,.jpeg,.png',
    maxSizeMB: 10,
    processingType: 'browser',
    outputFormat: '.jpg',
    status: 'active',
    displayOrder: 8,
    seo: { title: 'Passport Photo Maker | Best Computer', description: 'Make standard passport size photos online for free.' }
  },
  {
    id: 'cnic-photo',
    name: 'CNIC Photo Maker',
    description: 'Prepare CNIC-size photos in the correct format for Pakistani NADRA requirements.',
    category: 'photo',
    emoji: '🪪',
    route: 'cnic-photo',
    acceptedTypes: ['image/jpeg', 'image/png'],
    acceptAttr: '.jpg,.jpeg,.png',
    maxSizeMB: 10,
    processingType: 'browser',
    outputFormat: '.jpg',
    status: 'active',
    displayOrder: 9,
    seo: { title: 'CNIC Photo Maker | Best Computer', description: 'Create CNIC size photos online for NADRA requirements.' }
  },

  // ─── TYPING TOOLS ────────────────────────────────────
  {
    id: 'online-typing',
    name: 'Online Typing',
    description: 'Type, format and print documents directly in your browser. No software needed.',
    category: 'typing',
    emoji: '⌨️',
    route: 'online-typing',
    acceptedTypes: [],
    acceptAttr: '',
    maxSizeMB: 0,
    processingType: 'browser',
    outputFormat: '.pdf / print',
    status: 'active',
    displayOrder: 10,
    seo: { title: 'Online Typing Tool | Best Computer', description: 'Type and print documents online without any software.' }
  }
];

export const CATEGORIES = [
  { id: 'all',      label: 'All Tools',      emoji: '🔧' },
  { id: 'document', label: 'Document Tools', emoji: '📄' },
  { id: 'image',    label: 'Image Tools',    emoji: '🖼️' },
  { id: 'photo',    label: 'Photo Tools',    emoji: '📸' },
  { id: 'typing',   label: 'Typing Tools',   emoji: '⌨️' },
];

export const getToolById = (id) => TOOLS.find(t => t.id === id);
export const getToolsByCategory = (cat) => cat === 'all' ? TOOLS : TOOLS.filter(t => t.category === cat);
