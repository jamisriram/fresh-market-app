# Fresh Market - Online Grocery Store

A modern full-stack e-commerce application for fresh produce, built with React, Node.js, Express, and PostgreSQL.

## Features

### User Features
- User authentication (Buyer/Admin roles)
- Product browsing with search and filtering
- Shopping cart management
- Order placement and tracking
- Profile management
- Order history
- Favorites functionality

### Admin Features
- Dashboard with sales analytics
- User management
- Product management (CRUD operations)
- Order management
- Inventory tracking
- Category management

### Technical Features
- Responsive design
- Role-based access control
- Secure authentication with JWT
- Real-time cart updates
- Image handling
- Form validation
- Error handling
- Loading states

## Technology Stack

### Frontend
- React.js
- Material-UI
- React Router
- Axios
- Context API for state management

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon)
- JWT for authentication
- Bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database (or Neon account)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fresh-market-app.git
cd fresh-market-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Database Setup

1. Create a database in Neon or your local PostgreSQL instance

2. Initialize the database:
```bash
cd server
npm run init-db
```

This will:
- Create required tables
- Add sample products
- Create admin user

Default admin credentials:
- Email: admin@example.com
- Password: admin123

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend application:
```bash
cd client
npm start
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Auth Routes
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Product Routes
- GET /api/products - Get all products
- POST /api/products - Add new product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Order Routes
- GET /api/orders - Get all orders (admin)
- GET /api/orders/my-orders - Get user's orders
- POST /api/orders - Create new order
- PUT /api/orders/:id - Update order status (admin)

### User Routes
- GET /api/users - Get all users (admin)
- PUT /api/users/:id/role - Update user role (admin)

## Project Structure

```
fresh-market-app/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── context/       # Context providers
│       └── utils/         # Utility functions
└── server/                # Backend Node.js application
    ├── src/
    │   ├── config/       # Configuration files
    │   ├── controllers/  # Route controllers
    │   ├── database/    # Database setup and migrations
    │   ├── middleware/  # Custom middleware
    │   └── routes/     # API routes
    └── .env            # Environment variables
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Material-UI for the component library
- Neon for the PostgreSQL database service
- Unsplash for product images