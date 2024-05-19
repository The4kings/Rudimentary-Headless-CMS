# Project Setup

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (https://nodejs.org/)
- npm (https://www.npmjs.com/)
- MySQL (https://www.mysql.com/)

## Backend Setup

1. **Navigate to the backend directory:**

    
    cd backend
    

2. **Install dependencies:**

    
    npm install
    

3. **Configure MySQL:**

    DB_HOST=localhost
    DB_USER=cms_user
    DB_PASSWORD=password
    DB_NAME=rudimentary_cms


    Make sure you have a MySQL server running and create a database for your project. Update the database configuration in your project if needed (e.g., in the `index.js` file).

4. **Start the backend server:**

    
    npm start
    

    This will start the backend server using nodemon, which will watch for any changes and restart the server automatically.

## Frontend Setup

1. **Navigate to the frontend directory:**

    
    cd frontend
    

2. **Install dependencies:**

    
    npm install
    

3. **Start the frontend development server:**

    
    npm run dev
    

    This will start the frontend development server using Vite. You can access the frontend application in your browser at the URL provided by Vite (usually `http://localhost:3000`).
--

By following these steps, you should be able to set up and run both the frontend and backend of your project.