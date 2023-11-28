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
- [Authentication](https://github.com/FS-30/03-BE-Eduliterate-Express.git#authentication)
- [Error Handling](https://github.com/FS-30/03-BE-Eduliterate-Express.git#error-handling)
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

### 3. Authentication <a name="authentication"></a>
The API uses **JWT (JSON Web Token)** for user authentication. To access protected routes, include the token in the Authorization header of your requests.
```
Authorization: Bearer YOUR_JWT_TOKEN
```

<br>

### 4. Error Handling <a name="error-handling"></a>
The API provides standard HTTP status codes for responses. In case of an error, the response will include a JSON object with a message property describing the error.
**Example:**
```
{
  "message": "Unauthorized"
}
```

<br>

### 5. Entity Relationship Diagram <a name="erd"></a>
<p align="center">
  <img src="https://imgur.com/ztaCH4G.png" height="580"/>
</p>
<p align="center">
Postman Documentation Available here: https://documenter.getpostman.com/view/31106938/2s9YeG5Asr
</p>
