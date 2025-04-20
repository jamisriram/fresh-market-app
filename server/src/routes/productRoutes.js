const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { sql } = require('../config/db');

// Get all products
router.get('/', auth, async (req, res) => {
    try {
        const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create product (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    const { name, description, price, stock_quantity, unit } = req.body;
    try {
        const [product] = await sql`
            INSERT INTO products (name, description, price, stock_quantity, unit)
            VALUES (${name}, ${description}, ${price}, ${stock_quantity}, ${unit})
            RETURNING *
        `;
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock_quantity, unit } = req.body;
    try {
        const [product] = await sql`
            UPDATE products 
            SET name = ${name}, 
                description = ${description}, 
                price = ${price}, 
                stock_quantity = ${stock_quantity}, 
                unit = ${unit},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await sql`DELETE FROM products WHERE id = ${id}`;
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;