const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../config/db');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const [user] = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${hashedPassword})
            RETURNING id, name, email, role
        `;
        
        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const users = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login
};