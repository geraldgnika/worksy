# Worksy

Worksy is a modern job exploration and recruitment platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a full-featured system for job seekers and employers to interact, from searching and applying to jobs, to creating and managing job postings with role-based authentication.

## Table of Contents
- [Worksy](#worksy)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
  - [Technical Requirements](#technical-requirements)
  - [Getting Started and Running the Application](#getting-started-and-running-the-application)
  - [Environment Variables](#environment-variables)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Key Features
- **Job Exploration**: Search jobs by title, keywords, and location.
- **Role-Based Authentication**: Secure login system with role separation between job seekers and employers.
- **Job Applications**: Apply to jobs directly through the platform and view all submitted applications.
- **Profile Management**: Create and update personal user profiles.
- **Employer Tools**:
  - Create, update, and delete jobs.
  - Close or activate jobs as needed.
  - View all applicants for each job posting.
  - Update company profile.
- **User Tools**:
  - Track all jobs applied for.
  - View all jobs created (if employer role).
- **Responsive UI**: Optimized for desktop and mobile using TailwindCSS.

## Technical Requirements
### Backend
- **Node.js Version**: ^18.0.0  
- **Express.js Version**: ^5.1.0  
- **Mongoose Version**: ^8.16.4  
- **MongoDB Version**: ^5.0  

### Frontend
- **React Version**: ^19.1.0  
- **TailwindCSS Version**: ^4.1.11  
- **Vite Version**: ^7.0.4  
- **Node.js Version**: ^18.0.0  
- **Npm Version**: ^9.0.0  

## Getting Started and Running the Application
To get a local copy up and running, follow these steps:

### Backend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a new MongoDB Project and Cluster.
3. Add your IP address for access (or select **Allow Access from Anywhere**).
4. Choose the **Drivers** connection method and copy the connection string.
5. Paste it into your `.env` file as `MONGODB_URL`, replacing `<db_password>` with your database user’s password.
6. Generate a JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output into your `.env` file as `JWT_SECRET`.
7. Run the backend:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the frontend:
   ```bash
   npm run dev
   ```

## Environment Variables
Your `.env` file should look like this:
```env
MONGODB_URL=mongodb+srv://<username>:<db_password>@cluster0.mongodb.net/worksy
JWT_SECRET=<your_generated_secret>
PORT=5000
```
You should replace <username> and <db_password> with your own username and database password respectively.

## Testing
1. To run backend tests:
   ```bash
   npm test
   ```
2. To run frontend tests:
   ```bash
   npm run test
   ```

## Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

## License
MIT License. Copyright (c) Gerald Nika
