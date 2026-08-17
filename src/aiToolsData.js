export const AI_CATEGORIES = [
  { id: 'photo-enhancement', name: 'Photo Enhancement' },
  { id: 'quality', name: 'Quality' },
  { id: 'background', name: 'Background' },
  { id: 'editing', name: 'Editing' },
  { id: 'restoration', name: 'Restoration' },
  { id: 'document-photos', name: 'Document Photos' },
  { id: 'utility', name: 'Utility' }
];

export const AI_TOOLS = [
  {
    id: 'ai-enhancer',
    name: 'AI Photo Enhancer',
    description: 'Instantly improve lighting, color, and sharpness with AI.',
    category: 'photo-enhancement',
    icon: '✨',
    processingMode: 'server'
  },
  {
    id: 'ai-upscaler',
    name: 'AI Upscaler',
    description: 'Enlarge images without losing quality using AI.',
    category: 'quality',
    icon: '🔍',
    processingMode: 'server'
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Automatically isolate subjects and remove backgrounds.',
    category: 'background',
    icon: '✂️',
    processingMode: 'hybrid' // Can be browser or server
  },
  {
    id: 'background-blur',
    name: 'Background Blur',
    description: 'Add a professional DSLR-like blur (bokeh) to the background.',
    category: 'background',
    icon: '🌫️',
    processingMode: 'browser'
  },
  {
    id: 'object-remover',
    name: 'Object Remover',
    description: 'Erase unwanted people, text, or objects from your photo.',
    category: 'editing',
    icon: '🧹',
    processingMode: 'server'
  },
  {
    id: 'color-enhancer',
    name: 'Color Enhancer',
    description: 'Vibrant color correction and grading.',
    category: 'editing',
    icon: '🎨',
    processingMode: 'browser'
  },
  {
    id: 'photo-restoration',
    name: 'Old Photo Restoration',
    description: 'Fix scratches, tears, and restore old faces.',
    category: 'restoration',
    icon: '🖼️',
    processingMode: 'server'
  },
  {
    id: 'photo-colorizer',
    name: 'Photo Colorizer',
    description: 'Add realistic colors to black and white photos.',
    category: 'restoration',
    icon: '🌈',
    processingMode: 'server'
  },
  {
    id: 'passport-photo',
    name: 'Passport Photo Maker',
    description: 'Create perfect 1.35x1.85" passport print sheets.',
    category: 'document-photos',
    icon: '🪪',
    processingMode: 'browser'
  },
  {
    id: 'cnic-photo',
    name: 'CNIC Photo Maker',
    description: 'Create perfect 1.5x2.0" CNIC print sheets.',
    category: 'document-photos',
    icon: '🪪',
    processingMode: 'browser'
  },
  {
    id: 'image-resize',
    name: 'Image Resize',
    description: 'Resize dimensions and compress photos.',
    category: 'utility',
    icon: '📐',
    processingMode: 'browser'
  }
];

export const getAiToolById = (id) => AI_TOOLS.find(t => t.id === id);
