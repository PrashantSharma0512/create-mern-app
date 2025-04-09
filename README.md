# Create MERN CLI 🚀

A powerful CLI tool to scaffold full-stack MERN (MongoDB, Express, React, Node.js) applications with robust error handling and automatic cleanup.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue) 
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## Features ✨

- **Interactive Setup**: Guided CLI prompts for project configuration
- **Automatic Error Recovery**: Comprehensive cleanup on setup failures
- **Modern Frontend**: Choose between Vite or Webpack
- **Backend Options**: Mongoose (MongoDB) or Sequelize (SQL) support
- **Testing Ready**: Optional Jest/Mocha testing setup
- **Production-Ready**: Includes essential middleware and security best practices

## Installation 📦

```bash
npx create-mern-cli@latest
```

For global installation:
```bash
npm install -g create-mern-cli
create-mern-cli
```

## What's New in v2.0 🆕

- **Automatic Cleanup**: If setup fails, all created files are removed
- **Enhanced Error Handling**: Detailed error messages with recovery suggestions
- **Optimized Dependencies**: Faster installation with only essential packages
- **Windows Support**: Improved compatibility for Windows systems

## Usage 🛠️

Run the CLI and follow the interactive prompts:

```bash
npx create-mern-cli
```

You'll be asked to configure:
1. Project name
2. Frontend bundler (Vite/Webpack)
3. CSS framework (Tailwind/Bootstrap/None)
4. Backend ORM (Mongoose/Sequelize/None)
5. Testing setup (Jest/Mocha)

## Project Structure 📂

Your new project will include:

```
project-name/
├── client/            # React frontend
│   ├── public/        # Static assets
│   ├── src/           # Application code
│   └── package.json   # Frontend dependencies
│
└── backend/           # Node.js backend
    ├── controllers/   # Business logic
    ├── routes/        # API endpoints  
    ├── models/        # Database models
    ├── .env           # Environment variables
    ├── index.js       # Server entry point
    └── package.json   # Backend dependencies
```

## Error Recovery System ⚠️

The CLI features robust error handling:

- **Automatic Rollback**: If any step fails, all created files are deleted
- **Detailed Logging**: Clear error messages with cleanup status
- **Safe Retry**: Clean state allows restarting the setup

Example error scenario:
```bash
Error: Failed to install dependencies
🧹 Cleaning up created files and directories...
  - Deleted file: /projects/test-mern/backend/package.json
  - Deleted directory: /projects/test-mern/backend
⚠️ Setup failed. All created files have been removed.
```

## Getting Started 🏁

1. Start development servers:
```bash
cd your-project-name
cd client && npm run dev  # Frontend
cd backend && npm run dev # Backend
```

2. Access your app at `http://localhost:3000`

## Configuration ⚙️

### Essential Environment Variables

Backend `.env` template:
```env
PORT=5000
NODE_ENV=development

# MongoDB (if using Mongoose)
MONGO_URI=mongodb://localhost:27017/yourdb

# SQL (if using Sequelize)
DB_NAME=yourdb
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
```

### Customizing the Backend

The generated backend includes:
- Express server with CORS and JSON middleware
- Example CRUD routes/controllers
- Error handling middleware
- Nodemon for development

## Deployment 🚀

### Frontend
```bash
cd client
npm run build  # Outputs to /dist
```

### Backend
```bash
cd backend
npm start     # Production mode
```

Recommended hosting:
- **Frontend**: Vercel, Netlify, AWS S3
- **Backend**: Railway, Heroku, AWS EC2

## FAQ ❓

**Q: What if installation gets interrupted?**  
A: The cleanup system will remove all partial files automatically.

**Q: How do I add more backend routes?**  
A: Create new files in:
- `backend/routes/` for endpoints
- `backend/controllers/` for business logic

**Q: Can I use TypeScript?**  
A: Yes! Select TypeScript when prompted during Vite setup.

## Support 🛟

For issues, please:
1. Check error messages carefully
2. Clear node_modules and try again
3. Open a GitHub issue with:
   - Node.js version (`node -v`)
   - Exact error message
   - Steps to reproduce

## Contributing 🤝

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License 📄

MIT © Prashant Sharma And Vikas Tiwari

## Thank You
