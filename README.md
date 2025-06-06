# Blog Writing Website Backend

A robust backend API for a blog writing platform similar to Medium. This RESTful API provides all the necessary endpoints to create, manage, and interact with blog content.

## Features

- **User Authentication**: Secure signup and login with JWT
- **Blog Management**: Create, read, update, and delete blog posts
- **Comments & Replies**: Nested comment system for blog posts
- **User Profiles**: User management with different roles (user, admin)
- **Content Categorization**: Tag and categorize blog posts
- **Media Storage**: AWS S3 integration for image uploads
- **SEO Optimization**: Metadata management for blog posts
- **Analytics**: Track view counts and reading time

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **AWS SDK** - S3 integration for media storage
- **bcrypt** - Password hashing

## API Endpoints

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Blog Routes
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get a specific blog
- `POST /api/blogs` - Create a new blog (auth required)
- `PUT /api/blogs/:id` - Update a blog (auth required)
- `DELETE /api/blogs/:id` - Delete a blog (auth required)
- `POST /api/blogs/:id/like` - Like/unlike a blog (auth required)

### Comment Routes
- `GET /api/blogs/:blogId/comments` - Get all comments for a blog
- `POST /api/blogs/:blogId/comments` - Add a comment (auth required)
- `PUT /api/comments/:id` - Update a comment (auth required)
- `DELETE /api/comments/:id` - Delete a comment (auth required)

### Reply Routes
- `POST /api/comments/:commentId/replies` - Add a reply to a comment (auth required)
- `PUT /api/replies/:id` - Update a reply (auth required)
- `DELETE /api/replies/:id` - Delete a reply (auth required)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- AWS account (for S3 storage)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/nish340/blog-backend.git
   cd blogs-backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   ```

4. Start the server
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

## Project Structure

```
blogs-backend/
├── controllers/       # Request handlers
├── middleware/        # Custom middleware functions
├── models/            # Database models
├── routes/            # API routes
├── services/          # External service integrations
├── .env               # Environment variables
├── server.js          # Entry point
└── package.json       # Project dependencies
```

## Data Models

### User
- name
- email
- password (hashed)
- role (user, admin)
- profile information

### Blog
- title
- slug
- content
- excerpt
- coverImage
- author (reference to User)
- category
- tags
- status (draft, published, archived)
- seoMetadata
- readingTime
- viewCount
- likes

### Comment
- content
- author (reference to User)
- blog (reference to Blog)

### Reply
- content
- author (reference to User)
- comment (reference to Comment)

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

Nishchay Sharma

---

© 2024 Nishchay Sharma. All Rights Reserved.
