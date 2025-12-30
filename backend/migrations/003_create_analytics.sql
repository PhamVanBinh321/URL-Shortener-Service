-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    url_id BIGINT UNSIGNED NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referer VARCHAR(255),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE,
    INDEX idx_url_id (url_id),
    INDEX idx_clicked_at (clicked_at),
    INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
