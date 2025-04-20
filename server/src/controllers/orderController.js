const { sql } = require('../config/db');

const createOrder = async (req, res) => {
    const { buyer_name, buyer_email, buyer_phone, delivery_address, total_amount, items } = req.body;
    
    try {
        const order = await sql.begin(async (sql) => {
            // Create order
            const [newOrder] = await sql`
                INSERT INTO orders (buyer_name, buyer_email, buyer_phone, delivery_address, total_amount)
                VALUES (${buyer_name}, ${buyer_email}, ${buyer_phone}, ${delivery_address}, ${total_amount})
                RETURNING *
            `;
            
            // Create order items
            for (const item of items) {
                await sql`
                    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
                    VALUES (
                        ${newOrder.id},
                        ${item.product_id},
                        ${item.quantity},
                        ${item.unit_price},
                        ${item.quantity * item.unit_price}
                    )
                `;
            }
            
            return newOrder;
        });
        
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders
};