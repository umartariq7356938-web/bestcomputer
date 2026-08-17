const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const libre = require('libreoffice-convert');
// Allow setting libreoffice path if needed, usually it's in PATH.
// libreoffice-convert uses 'soffice' by default.
libre.convertAsync = require('util').promisify(libre.convert);

// Ensure temp directory exists
const tempDir = path.join(__dirname, '..', 'temp_tools');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Set up multer for secure temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Sanitize filename, just use UUID + extension
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'upload-' + uniqueSuffix + ext);
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max limit to protect server
  fileFilter: fileFilter
});

// Helper to auto-delete file
const cleanupFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to cleanup file:', filePath, err);
    });
  }
};

// 1. WORD TO PDF (Using LibreOffice)
router.post('/word-to-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  
  const inputPath = req.file.path;
  const ext = '.pdf';

  try {
    const inputBuffer = fs.readFileSync(inputPath);
    
    // Process with libreoffice
    const pdfBuffer = await libre.convertAsync(inputBuffer, ext, undefined);
    
    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="Converted_BestComputer.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Failed to convert document. Please ensure LibreOffice is installed on the server.' });
  } finally {
    // Always cleanup the uploaded file
    cleanupFile(inputPath);
  }
});

// 2. PDF TO WORD (Using LibreOffice)
router.post('/pdf-to-word', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  
  const inputPath = req.file.path;
  const ext = '.docx'; // Target format

  try {
    const inputBuffer = fs.readFileSync(inputPath);
    
    // Note: LibreOffice PDF to DOCX is somewhat limited, it relies on Draw.
    // It's the best free solution without external paid APIs.
    const docxBuffer = await libre.convertAsync(inputBuffer, ext, undefined);
    
    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="Converted_BestComputer.docx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(docxBuffer);

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Failed to convert document. Please ensure LibreOffice is installed on the server.' });
  } finally {
    // Always cleanup the uploaded file
    cleanupFile(inputPath);
  }
});

module.exports = router;
