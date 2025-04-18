# INFO6150_FinalProject

# EventEase

EventEase is a comprehensive event booking platform designed to make it easy for users to browse, explore, and book different types of events. Built with React, Node.js, and MongoDB, the platform provides a seamless experience with a visually appealing design powered by Bootstrap.

## Features

- **User Authentication**: Complete JWT-based authentication system with role-based access (User, Organizer, Admin)
- **Event Discovery**: Browse events with advanced filtering, searching, and sorting capabilities
- **Ticket Booking**: Book tickets for events with secure payment processing
- **User Dashboard**: Manage profile, view booked tickets, and transaction history
- **Organizer Dashboard**: Create and manage events, track ticket sales, and monitor attendance
- **Admin Panel**: Manage users, and oversee platform operations
- **Responsive Design**: Mobile-first approach for optimal experience across all devices

## Tech Stack

### Frontend

- React 18
- Bootstrap 5
- React Router v6
- Axios for API communication
- Context API for state management

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password encryption
- Multer for file uploads

## Project Structure

The project is structured as follows:

```
├── README.md
├── package.json
├── public/
│   ├── images/
│   └── index.html
└── src/
    ├── App.js
    ├── components/
    │   ├── common/
    │   ├── events/
    │   ├── forms/
    │   ├── home/
    │   ├── layout/
    │   ├── ui/
    │   └── user/
    ├── context/
    ├── hooks/
    ├── pages/
    │   ├── admin/
    │   ├── auth/
    │   ├── organizer/
    │   ├── public/
    │   └── user/
    ├── services/
    └── utils/
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/eventease.git
cd eventease
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory and add:

```
REACT_APP_API_URL=http://localhost:5001/api
```

4. Start the development server

```bash
npm start
```

5. The application will be running at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory

```bash
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file and add:

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

4. Start the backend server

```bash
npm run dev
```

5. The API will be running at `http://localhost:5001/api`

## User Roles and Flows

### User

- Register/Login
- Browse and search events
- Book tickets for events
- Make payments
- View tickets and transaction history
- Update profile information

### Organizer

- Create and manage events
- Upload event images
- Track ticket sales and attendance
- View event statistics
- Manage event details

### Admin

- Manage all users (view, edit, suspend)
- Moderate events (approve, feature, hide)
- View platform-wide statistics
- Manage transactions and refunds

## API Documentation

Comprehensive API documentation is available at `http://localhost:5001/api-docs` when running the backend in development mode.

Key endpoints include:

- `/api/users` - User management
- `/api/events` - Event management
- `/api/tickets` - Ticket booking and management
- `/api/transactions` - Payment processing and history

## Deployment

### Frontend Deployment

1. Build the production-ready code

```bash
npm run build
```

2. Deploy the contents of the `build` folder to your hosting provider (Netlify, Vercel, etc.)

### Backend Deployment

1. Prepare the backend for production

```bash
npm run build
```

2. Deploy to a Node.js hosting service (Heroku, Render, DigitalOcean, etc.)

## Future Enhancements

- Event recommendations based on user preferences
- Social sharing functionality
- Event reminders and notifications
- Reviews and ratings for events
- Recurring events support
- QR code ticket scanning

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Bootstrap](https://getbootstrap.com/)
- [React Router](https://reactrouter.com/)
