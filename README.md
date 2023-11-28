<p align="center">
  <img src="https://imgur.com/ChAicVH.png" alt="logo sahabat lansia" width="580"/>
</p>

# Eduliterate - Back End

This documentation provides an overview of the **Web Service** and **RESTful API** implemented our website **Eduliterate**, built using
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=mongodb,express,nodejs,postman" />
  </a>
</p>
 
## Table of Contents
- [Overview](https://github.com/FS-30/03-BE-Eduliterate-Express.git#overview)
- [Getting Started](https://github.com/FS-30/03-BE-Eduliterate-Express.git#getting-started)
- [Project Structure](https://github.com/FS-30/03-BE-Eduliterate-Express.git#project-structure)
- [API Endpoints](https://github.com/FS-30/03-BE-Eduliterate-Express.git#api-endpoints)
- [Entity Relationship Diagram](https://github.com/FS-30/03-BE-Eduliterate-Express.git#erd)

<br>

### 1. Overview <a name="overview"></a>
Eduliterate is a web application built with **Node.js** and **MongoDB** that facilitates book, user authentication, and subscription-based access to books. 
The application includes various endpoints for user registration, authentication, book management, and payment processing.

<br>

### 2. Getting Started <a name="getting-started"></a>
**a. Prerequisites**
- Node.js installed
- MongoDB Atlas account for database (update the .env file with your MongoDB connection URL)
- Set up environment variables in a ```.env``` file
- Cloudinary to store image

<br>

**b. Installation**
- Clone the repository to your local machine:
```
https://github.com/FS-30/03-BE-Eduliterate-Express.git
```
- Open the project directory
```
cd 03-BE-Eduliterate-Express
npm install
```
- Set Environment Variables
```
DB_URL=mongodb+srv://your_username:your_password@your_mongodb_url/Eduliterate
JWT_SECRET=YourJWTSecretKey
CLOUDINARY_CLOUD_NAME=YourCloudinaryCloudName
CLOUDINARY_API_KEY=YourCloudinaryAPIKey
CLOUDINARY_API_SECRET=YourCloudinaryAPISecret
```
- Run it
```
npm start
```
The server will be running on `http://localhost:3000`

<br>

### 3. Project Structure <a name="project-structure"></a>
The project follows a modular structure:
- ```index.js```: Entry point of the application, establishes server connection and defines middleware.
- ```config/```: Contains database configuration.
- ```middlewares/```: Holds authentication middleware for authorization checks.
- ```models/```: Contains Mongoose models for users, books, and payments.
- ```routes/```: Includes routes for authentication and data handling.

<br>

### 4. API Endpoints <a name="api-endpoints"></a>
**Authentication**
- ```POST /auth/register```: Register a new user.
- ```POST /auth/login```: Log in an existing user.

<br>

**Data Handling**<br>
**a. Users**
- ```POST /data/users```: Create a new user (admin-only).
- ```GET /data/users```: Get all users (admin-only).
- ```PUT /data/users/:id```: Update a user by ID (admin-only).
- ```DELETE /data/users/:id```: Delete a user by ID (admin-only).

**b. Books**
- ```POST /data/books```: Create a new book (admin-only).
- ```GET /data/books```: Get all books (accessible to all users).
- ```GET /data/books/:id```: Get details of a book by ID.
- ```PUT /data/books/:id```: Update a book by ID (admin-only).
- ```DELETE /data/books/:id```: Delete a book by ID (admin-only).

**c. Payments**
- ```POST /data/payment/upload```: Upload payment image.

<br>

**Postman Documentation Available here**: https://documenter.getpostman.com/view/31106938/2s9YeG5Asr

<br>

### 5. Entity Relationship Diagram <a name="erd"></a>
<p align="center">
  <img src="https://imgur.com/ztaCH4G.png" height="580"/>
</p>
