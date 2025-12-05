const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { pool, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'), false);
        }
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all images
app.get('/api/images', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, image_name, image_type, file_size, placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5, created_at FROM images ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Get specific image
app.get('/api/images/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute(
            'SELECT image_data, image_name, image_type FROM images WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }
        
        const image = rows[0];
        res.set({
            'Content-Type': image.image_type,
            'Content-Length': image.image_data.length
        });
        res.send(image.image_data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

// Upload new image
app.post('/api/images', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const { placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5 } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO images (image_data, image_name, image_type, file_size, placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype,
                req.file.size,
                placeholder_1 || null,
                placeholder_2 || null,
                placeholder_3 || null,
                placeholder_4 || null,
                placeholder_5 === 'true' || placeholder_5 === true
            ]
        );

        res.json({ 
            id: result.insertId, 
            message: 'Image uploaded successfully',
            image_name: req.file.originalname
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Update image metadata
app.put('/api/images/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5 } = req.body;
        
        const [result] = await pool.execute(
            'UPDATE images SET placeholder_1 = ?, placeholder_2 = ?, placeholder_3 = ?, placeholder_4 = ?, placeholder_5 = ? WHERE id = ?',
            [placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({ message: 'Image metadata updated successfully' });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ error: 'Failed to update image' });
    }
});

// Delete image
app.delete('/api/images/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await pool.execute(
            'DELETE FROM images WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    res.status(500).json({ error: error.message });
});

// Start server
const startServer = async () => {
    await testConnection();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📁 Upload images at http://localhost:${PORT}`);
    });
};

startServer();

