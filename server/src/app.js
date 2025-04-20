const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sql } = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const { auth, isAdmin } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://fresh-market-app.vercel.app']
        : 'http://localhost:3000',
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/products', auth, productRoutes);
app.use('/api/orders', auth, orderRoutes);

// Admin routes
app.get('/api/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await sql`
            SELECT id, name, email, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user role (admin only)
app.put('/api/users/:id/role', auth, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    
    try {
        const [user] = await sql`
            UPDATE users 
            SET role = ${role} 
            WHERE id = ${id} 
            RETURNING id, name, email, role
        `;
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;