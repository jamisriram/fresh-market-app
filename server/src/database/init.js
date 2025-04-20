const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sql } = require('../config/db');

async function initializeDatabase() {
    try {
        // Drop existing tables if they exist
        await sql`DROP TABLE IF EXISTS order_items CASCADE`;
        await sql`DROP TABLE IF EXISTS orders CASCADE`;
        await sql`DROP TABLE IF EXISTS products CASCADE`;
        await sql`DROP TABLE IF EXISTS users CASCADE`;

        // Create users table
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                role VARCHAR(20) DEFAULT 'buyer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create products table with category column
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                stock_quantity INTEGER NOT NULL,
                unit VARCHAR(20) NOT NULL,
                category VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create orders table
        await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                buyer_name VARCHAR(100) NOT NULL,
                buyer_email VARCHAR(100) NOT NULL,
                buyer_phone VARCHAR(20),
                delivery_address TEXT NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create order_items table
        await sql`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id),
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                unit_price DECIMAL(10,2) NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

async function seedDatabase() {
    try {
        const adminPassword = await bcrypt.hash('admin123', 10);
        // Insert admin user
        await sql`
            INSERT INTO users (name, email, password, role)
            VALUES ('Admin', 'admin@example.com', ${adminPassword}, 'admin')
            ON CONFLICT (email) DO NOTHING
        `;
        // First, clear existing data
        await sql`TRUNCATE products CASCADE`;
        
        // Insert sample products
        await sql`
            INSERT INTO products (name, description, price, stock_quantity, unit, category) 
            VALUES 
            ('Tomatoes', 'Fresh red tomatoes', 2.99, 100, 'kg', 'Vegetables'),
            ('Potatoes', 'Farm fresh potatoes', 1.99, 200, 'kg', 'Vegetables'),
            ('Carrots', 'Organic carrots', 1.49, 150, 'kg', 'Vegetables'),
            ('Apples', 'Red delicious apples', 3.99, 100, 'kg', 'Fruits'),
            ('Bananas', 'Sweet ripe bananas', 2.49, 150, 'kg', 'Fruits'),
            ('Oranges', 'Juicy Valencia oranges', 4.99, 100, 'kg', 'Fruits'),
            ('Spinach', 'Fresh baby spinach', 3.49, 80, 'bunch', 'Vegetables'),
            ('Broccoli', 'Fresh broccoli heads', 2.99, 120, 'piece', 'Vegetables'),
            ('Strawberries', 'Sweet strawberries', 5.99, 80, 'box', 'Fruits'),
            ('Basil', 'Fresh organic basil', 1.99, 50, 'bunch', 'Herbs'),
            ('Mint', 'Fresh mint leaves', 1.49, 60, 'bunch', 'Herbs'),
            ('Cilantro', 'Fresh cilantro', 1.29, 70, 'bunch', 'Herbs'),
            ('Bell Peppers', 'Colorful bell peppers', 3.99, 90, 'kg', 'Vegetables'),
            ('Mushrooms', 'Fresh button mushrooms', 4.99, 70, 'kg', 'Vegetables'),
            ('Grapes', 'Sweet seedless grapes', 6.99, 85, 'kg', 'Fruits'),
            ('Cucumber', 'Fresh cucumbers', 1.99, 110, 'kg', 'Vegetables'),
            ('Lettuce', 'Crisp iceberg lettuce', 2.49, 95, 'head', 'Vegetables'),
            ('Mango', 'Sweet ripe mangoes', 7.99, 60, 'kg', 'Fruits'),
            ('Rosemary', 'Fresh rosemary sprigs', 2.49, 40, 'bunch', 'Herbs'),
            ('Thyme', 'Fresh thyme', 1.99, 45, 'bunch', 'Herbs'),
            ('Blueberries', 'Fresh blueberries', 8.99, 50, 'box', 'Fruits'),
            ('Zucchini', 'Fresh green zucchini', 2.99, 80, 'kg', 'Vegetables'),
            ('Cauliflower', 'Fresh cauliflower', 3.99, 70, 'piece', 'Vegetables'),
            ('Pineapple', 'Sweet ripe pineapple', 5.99, 40, 'piece', 'Fruits'),
            ('Kale', 'Fresh organic kale', 3.99, 75, 'bunch', 'Vegetables'),
            ('Sage', 'Fresh sage leaves', 2.29, 35, 'bunch', 'Herbs'),
            ('Raspberries', 'Fresh raspberries', 9.99, 45, 'box', 'Fruits'),
            ('Green Onions', 'Fresh scallions', 1.49, 100, 'bunch', 'Vegetables'),
            ('Garlic', 'Fresh garlic bulbs', 1.99, 120, 'piece', 'Vegetables'),
            ('Lemon', 'Fresh lemons', 0.99, 150, 'piece', 'Fruits')
        `;
        console.log('Sample data inserted successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

// Execute both functions
const setup = async () => {
    try {
        await initializeDatabase();
        await seedDatabase();
        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Database setup failed:', error);
    } finally {
        process.exit();
    }
};

// Run setup if this file is executed directly
if (require.main === module) {
    setup();
}

module.exports = {
    initializeDatabase,
    seedDatabase
};