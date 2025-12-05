-- HairFlow Database Setup
-- MySQL database schema for storing images and related data

-- Create database (uncomment if you need to create the database)
-- CREATE DATABASE IF NOT EXISTS hairflow_db;
-- USE hairflow_db;

-- Create images table with image storage and 5 placeholder columns
CREATE TABLE IF NOT EXISTS images (
    -- Primary key
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Image storage column (using LONGBLOB for large images)
    image_data LONGBLOB NOT NULL,
    
    -- Image metadata
    image_name VARCHAR(255),
    image_type VARCHAR(100),
    file_size INT,
    
    -- 5 placeholder columns for image-related data
    placeholder_1 VARCHAR(255),  -- Could be: hair_type, style_category, etc.
    placeholder_2 TEXT,          -- Could be: description, notes, etc.
    placeholder_3 DECIMAL(10,2),  -- Could be: price, rating, etc.
    placeholder_4 DATE,          -- Could be: creation_date, appointment_date, etc.
    placeholder_5 BOOLEAN,       -- Could be: featured, active, etc.
    
    -- Additional useful columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_image_name (image_name),
    INDEX idx_created_at (created_at),
    INDEX idx_placeholder_1 (placeholder_1)
);

-- Optional: Create a separate table for image metadata if you prefer normalization
CREATE TABLE IF NOT EXISTS image_metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_id INT NOT NULL,
    metadata_key VARCHAR(100) NOT NULL,
    metadata_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    INDEX idx_image_id (image_id),
    INDEX idx_metadata_key (metadata_key)
);

-- Sample insert statement (commented out)
-- INSERT INTO images (image_data, image_name, image_type, file_size, placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5) 
-- VALUES (LOAD_FILE('/path/to/image.jpg'), 'sample_hair_style.jpg', 'image/jpeg', 1024000, 'curly', 'Beautiful curly hair style', 85.50, '2024-01-15', TRUE);

-- Useful queries for working with the images table:

-- 1. Insert an image with metadata
-- INSERT INTO images (image_data, image_name, image_type, file_size, placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5)
-- VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 2. Retrieve all images with their metadata
-- SELECT id, image_name, image_type, file_size, placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5, created_at 
-- FROM images 
-- ORDER BY created_at DESC;

-- 3. Retrieve a specific image by ID
-- SELECT image_data, image_name, image_type FROM images WHERE id = ?;

-- 4. Update image metadata
-- UPDATE images 
-- SET placeholder_1 = ?, placeholder_2 = ?, placeholder_3 = ?, placeholder_4 = ?, placeholder_5 = ?
-- WHERE id = ?;

-- 5. Delete an image
-- DELETE FROM images WHERE id = ?;

