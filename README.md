# Store Rating Platform

A full-stack web application where users can view stores and submit ratings from 1 to 5.

The application has three types of users:

- Admin
- Normal User
- Store Owner

## Tech Stack

- Frontend: React.js, Vite, Axios, React Router
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT
- Password Hashing: bcrypt
- Validation: Zod

## Features

### Admin

- Login
- Dashboard with total users, stores and ratings
- Add users
- Add store owners
- Add admin users
- Add stores
- View users and stores
- Search and filter users/stores
- Sort listings
- View user details
- View store owner ratings
- Logout

### Normal User

- Register
- Login
- View all stores
- Search stores by name and address
- Sort stores
- Submit a rating from 1 to 5
- Update an existing rating
- Change password
- Logout

### Store Owner

- Login
- View store dashboard
- View average store rating
- View total ratings
- View users who rated the store
- View submitted ratings
- Change password
- Logout

## Validation

The following validations are implemented:

- Name: 20 to 60 characters
- Address: maximum 400 characters
- Password: 8 to 16 characters
- Password must contain an uppercase letter
- Password must contain a special character
- Email must be valid
- Rating must be between 1 and 5

## Project Structure

```text
store-rating-platform/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
