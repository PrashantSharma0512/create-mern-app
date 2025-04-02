
# Create MERN Latest 🚀

A CLI tool to quickly set up a full-stack MERN (MongoDB, Express, React, Node.js) project with modern tooling and best practices.

## Features ✨

- **Frontend Setup**: Choose between Vite or Webpack as your bundler
- **CSS Frameworks**: Option to add Tailwind CSS or Bootstrap
- **Backend Options**: Select your preferred ORM (Mongoose for MongoDB or Sequelize for SQL)
- **Testing**: Add Mocha/Jest for testing
- **Modern Tooling**: Includes essential packages like dotenv, cors, nodemon
- **Zero Configuration**: Gets you started quickly with sensible defaults

## Installation 📦

```bash
npx create-mern-app@latest
```

Or install globally:

```bash
npm install -g create-mern-latest
create-mern-latest
```

## Usage 🛠️

After running the command, you'll be guided through an interactive setup:

1. **Project Name**: Enter your project name (will create a directory with this name)
2. **Frontend Bundler**: Choose between Vite (recommended) or Webpack
3. **CSS Framework**: Select Tailwind, Bootstrap, or None
4. **Backend ORM**: 
   - Mongoose for MongoDB
   - Sequelize for SQL databases
   - None if you want to set up your own database layer
5. **Testing**: Option to add Mocha/Jest testing framework

The tool will then:
- Create a project structure with separate `client` and `backend` folders
- Install all necessary dependencies
- Set up basic configuration files

## Project Structure 📂

Your new project will have this structure:

```
your-project-name/
├── client/            # Frontend React application
│   ├── public/        # Static files
│   ├── src/           # React source files
│   ├── package.json   # Frontend dependencies
│   └── ...            # Other frontend config files
│
└── backend/           # Node.js/Express server
    ├── models/        # Database models
    ├── routes/        # API routes
    ├── package.json   # Backend dependencies
    └── ...            # Other backend config files
```

## Getting Started 🏁

After setup:

1. Navigate to your project directory:
   ```bash
   cd your-project-name
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

3. Start the backend server (in a separate terminal):
   ```bash
   cd backend
   npm start
   ```

## Configuration ⚙️

### Environment Variables

The project comes pre-configured to use environment variables:

1. Create a `.env` file in both `client` and `backend` directories
2. Add your environment variables (database connection strings, API keys, etc.)

Example `.env` in backend:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=your_secret_key
```

### Database Setup

Depending on your ORM choice:

**For Mongoose (MongoDB):**
1. Make sure MongoDB is installed and running
2. Update the connection string in your backend `.env` file

**For Sequelize (SQL):**
1. Install your preferred SQL database (PostgreSQL, MySQL, etc.)
2. Update the connection configuration in `backend/config/database.js`

## Available Scripts 📜

### Frontend (in `client` directory)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run test` - Run tests (if testing was selected)

### Backend (in `backend` directory)

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if testing was selected)

## Customization 🎨

### Adding Tailwind CSS

If you selected Tailwind during setup:
1. The basic configuration is already set up
2. Edit `tailwind.config.js` to customize your design system
3. Import Tailwind in your main CSS file:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Adding Bootstrap

If you selected Bootstrap:
1. Bootstrap is already imported in your main JavaScript file
2. You can customize Bootstrap by editing `client/src/main.jsx` (or `index.js`)

## Testing 🧪

If you opted to include testing:

### Frontend Testing
- Uses Jest by default
- Test files should be named `*.test.js` or `*.test.jsx`

### Backend Testing
- Uses Mocha by default
- Test files should be in `backend/test/` directory

Run tests with:
```bash
cd backend
npm test
```

## Deployment 🚀

### Frontend Deployment
1. Build your React app:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your preferred hosting (Vercel, Netlify, etc.)

### Backend Deployment
1. Make sure to set production environment variables
2. Consider using:
   - Heroku
   - AWS Elastic Beanstalk
   - DigitalOcean App Platform
   - Or any Node.js hosting provider

## Troubleshooting ⚠️

**Common Issues:**

1. **Installation fails**:
   - Try running with `--legacy-peer-deps` flag
   - Make sure you have Node.js v16+ installed
   - Clear npm cache with `npm cache clean --force`

2. **Frontend not connecting to backend**:
   - Make sure CORS is properly configured
   - Check your proxy settings in `client/vite.config.js` (or webpack config)
   - Ensure backend server is running

3. **Database connection issues**:
   - Verify your database is running
   - Check connection strings in `.env` file
   - For MongoDB, make sure MongoDB service is started

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a PR for any improvements.

## License 📄

This project is licensed under the MIT License.
```

This README provides:
1. Clear installation instructions
2. Detailed feature overview
3. Usage guide
4. Project structure explanation
5. Configuration options
6. Deployment instructions
7. Troubleshooting tips
8. Contribution guidelines

You can customize it further with:
- Badges (version, license, build status)
- Screenshots
- More detailed database configuration examples
- Specific deployment guides for different platforms
