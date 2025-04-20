const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { sql } = require('../config/db');

// Get all orders (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const orders = await sql`
            SELECT * FROM orders 
            ORDER BY created_at DESC
        `;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await sql`
            SELECT * FROM orders 
            WHERE buyer_email = ${req.user.email}
            ORDER BY created_at DESC
        `;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
        const [order] = await sql`
            UPDATE orders 
            SET status = ${status} 
            WHERE id = ${id} 
            RETURNING *
        `;
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new order
router.post('/', auth, async (req, res) => {
    const { buyer_name, buyer_email, buyer_phone, delivery_address, total_amount, items } = req.body;
    
    try {
        const [order] = await sql`
            INSERT INTO orders (
                buyer_name, buyer_email, buyer_phone, 
                delivery_address, total_amount
            ) VALUES (
                ${buyer_name}, ${buyer_email}, ${buyer_phone}, 
                ${delivery_address}, ${total_amount}
            ) RETURNING *
        `;

        for (const item of items) {
            await sql`
                INSERT INTO order_items (
                    order_id, product_id, quantity, 
                    unit_price, total_price
                ) VALUES (
                    ${order.id}, ${item.product_id}, 
                    ${item.quantity}, ${item.unit_price},
                    ${item.quantity * item.unit_price}
                )
            `;
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await sql`
            SELECT o.*,
                   json_agg(
                       json_build_object(
                           'id', oi.id,
                           'product_id', oi.product_id,
                           'quantity', oi.quantity,
                           'unit_price', oi.unit_price,
                           'total_price', oi.total_price,
                           'product_name', p.name
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.buyer_email = ${req.user.email}
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;