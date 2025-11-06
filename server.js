const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Serve static files: pages at /pages, images at /images, and root files at /
app.use('/pages', express.static('pages'));
app.use('/images', express.static('images'));
app.use(express.static('.')); // Serve other static files from root (e.g., styles.css)

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Redirect root to index page
app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// POST endpoint to save labels
app.post('/api/labels', (req, res) => {
  try {
    const record = req.body;
    
    // Validate required fields
    if (!record.image_id || !record.labeler_id || !record.measurements) {
      return res.status(400).json({ 
        error: 'Missing required fields: image_id, labeler_id, and measurements are required' 
      });
    }

    // Ensure created_at is set
    if (!record.created_at) {
      record.created_at = new Date().toISOString();
    }

    // Ensure flags structure exists
    if (!record.flags) {
      record.flags = {};
    }
    
    // Set default review_status if not provided
    if (!record.flags.review_status) {
      record.flags.review_status = 'pending';
    }

    // Append to JSONL file (one JSON object per line)
    const labelsFile = path.join(dataDir, 'labels.jsonl');
    const jsonLine = JSON.stringify(record) + '\n';
    
    fs.appendFileSync(labelsFile, jsonLine, 'utf8');
    
    res.json({ 
      status: 'success', 
      message: 'Label saved successfully',
      record: record
    });
  } catch (error) {
    console.error('Error saving label:', error);
    res.status(500).json({ 
      error: 'Failed to save label',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

