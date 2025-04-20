const { sql } = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const products = await sql`SELECT * FROM products`;
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProduct = async (req, res) => {
    const { name, description, price, stock_quantity, unit } = req.body;
    try {
        const result = await sql`
            INSERT INTO products (name, description, price, stock_quantity, unit)
            VALUES (${name}, ${description}, ${price}, ${stock_quantity}, ${unit})
            RETURNING *
        `;
        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProducts,
    addProduct
};