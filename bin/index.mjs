#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

// Global variables for cleanup tracking
let projectRoot = '';
let createdDirs = [];
let installedDeps = false;
let createdFiles = [];

// Windows-compatible path joiner
function joinPaths(...paths) {
  return path.join(...paths).replace(/\\/g, '/');
}

// Main setup function
async function setupProject() {
  try {
    console.log("Welcome to Create MERN App!\n");
    console.log("\n🚀 Setting up your MERN project...\n");

    const answers = await getProjectConfiguration();
    projectRoot = path.resolve(answers.projectName);

    await createProjectStructure(answers.projectName);
    await installDependencies(answers);
    await setupFrontend(answers);
    await setupBackend(answers);

    displaySuccessMessage(answers.projectName);
  } catch (error) {
    await cleanup(error);
  }
}

// Configuration collection
async function getProjectConfiguration() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      validate: input => input.trim() ? true : 'Project name cannot be empty'
    },
    {
      type: 'list',
      name: 'bundler',
      message: 'Choose frontend bundler:',
      choices: ['Vite', 'Webpack']
    },
    {
      type: 'list',
      name: 'css',
      message: 'Choose a CSS framework:',
      choices: ['Tailwind', 'Bootstrap', 'None']
    },
    {
      type: 'list',
      name: 'orm',
      message: 'Choose a backend ORM:',
      choices: ['Mongoose (MongoDB)', 'Sequelize (SQL)', 'None']
    },
    {
      type: 'confirm',
      name: 'testing',
      message: 'Do you want to add a testing library? (Mocha/Jest)'
    }
  ]);
}

// Project structure creation
async function createProjectStructure(projectName) {
  console.log("📂 Creating project structure...");

  const directories = [
    '',
    'client',
    'backend',
    'backend/controllers',
    'backend/routes',
    'backend/models'
  ];

  for (const dir of directories) {
    const dirPath = joinPaths(projectRoot, dir);
    fs.mkdirSync(dirPath, { recursive: true });
    createdDirs.push(dirPath);
    console.log(`✅ Created directory: ${dir || 'root'}`);
  }
}

// Dependency installation
async function installDependencies(answers) {
  console.log("\n📦 Installing dependencies...");
  installedDeps = true;
}

// Frontend setup
async function setupFrontend(answers) {
  console.log("\n🛠️ Setting up frontend...");
  const clientPath = joinPaths(projectRoot, 'client');

  if (answers.bundler === 'Vite') {
    await setupViteFrontend(clientPath);
  } else {
    await setupWebpackFrontend(clientPath);
  }

  if (answers.css === 'Tailwind') {
    await setupTailwind(clientPath, answers.bundler);
  } else if (answers.css === 'Bootstrap') {
    await setupBootstrap(clientPath);
  }

  createdFiles.push(
    joinPaths(clientPath, 'package.json'),
    joinPaths(clientPath, 'package-lock.json')
  );
}

async function setupViteFrontend(clientPath) {
  await executeCommand(clientPath, 'npx create-vite@latest . ');
}

async function setupWebpackFrontend(clientPath) {
  await executeCommand(clientPath, 'npm init -y');
  await executeCommand(clientPath, 'npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin @babel/core babel-loader @babel/preset-env @babel/preset-react css-loader style-loader');
  await executeCommand(clientPath, 'npm install react react-dom');

  writeFileAndTrack(
    joinPaths(clientPath, 'webpack.config.js'),
    generateWebpackConfig()
  );

  // Create basic React files
  const srcPath = joinPaths(clientPath, 'src');
  const publicPath = joinPaths(clientPath, 'public');
  fs.mkdirSync(srcPath, { recursive: true });
  fs.mkdirSync(publicPath, { recursive: true });

  writeFileAndTrack(
    joinPaths(srcPath, 'index.js'),
    generateReactIndexJS()
  );
  writeFileAndTrack(
    joinPaths(srcPath, 'App.js'),
    generateReactAppJS()
  );
  writeFileAndTrack(
    joinPaths(publicPath, 'index.html'),
    generateIndexHTML()
  );

  // Update package.json scripts
  updatePackageScripts(clientPath, {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  });
}

// Tailwind CSS setup
async function setupTailwind(clientPath, bundler) {
  console.log("\n🌊 Setting up Tailwind CSS...");

  try {
    if (bundler === 'Vite') {
      // Vite-specific Tailwind v4 setup
      await executeCommand(clientPath, 'npm install -D tailwindcss @tailwindcss/vite');

      // Create Tailwind config (ESM)
      writeFileAndTrack(
        joinPaths(clientPath, 'vite.config.js'),
        `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

})
`
      );
      const cssPath = joinPaths(clientPath, 'src', 'index.css');
      writeFileAndTrack(cssPath, `@import "tailwindcss";
`);

      console.log("ℹ️ Remember to add '@tailwindcss/vite' in your vite.config.js plugins.");
    } else {
      // Webpack installation (assuming still on PostCSS for now)
      await executeCommand(clientPath, 'npm install -D tailwindcss postcss autoprefixer postcss-loader');

      writeFileAndTrack(
        joinPaths(clientPath, 'tailwind.config.cjs'),
        `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`
      );

      writeFileAndTrack(
        joinPaths(clientPath, 'postcss.config.cjs'),
        `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`
      );

      const cssPath = joinPaths(clientPath, 'src', 'index.css');
      writeFileAndTrack(cssPath, `@tailwind base;
  @tailwind components;
  @tailwind utilities;`);
    }

   

    // Update main file to import Tailwind CSS
    const mainEntryPath = joinPaths(clientPath, 'src', bundler === 'Vite' ? 'main.jsx' : 'index.js');
    updateMainEntryFile(mainEntryPath, `import './index.css';`);

    console.log("✅ Tailwind CSS setup completed successfully.");
  } catch (error) {
    console.error("❌ Tailwind CSS setup failed:", error.message);
    throw error;
  }
}




// Bootstrap setup
async function setupBootstrap(clientPath) {
  console.log("\n🎨 Installing Bootstrap...");
  await executeCommand(clientPath, 'npm install bootstrap');
}

// Backend setup
async function setupBackend(answers) {
  console.log("\n⚙️ Setting up backend...");
  const backendPath = joinPaths(projectRoot, 'backend');

  await executeCommand(backendPath, 'npm init -y');

  createdFiles.push(
    joinPaths(backendPath, 'package.json'),
    joinPaths(backendPath, 'package-lock.json')
  );

  await executeCommand(backendPath, 'npm install express dotenv cors');
  await executeCommand(backendPath, 'npm install --save-dev nodemon');

  if (answers.orm.includes('Mongoose')) {
    console.log("\n🍃 Installing Mongoose...");
    await executeCommand(backendPath, 'npm install mongoose');
  }

  if (answers.orm.includes('Sequelize')) {
    console.log("\n📊 Installing Sequelize...");
    await executeCommand(backendPath, 'npm install sequelize pg pg-hstore');
  }

  if (answers.testing) {
    console.log("\n🧪 Installing testing libraries...");
    await executeCommand(backendPath, 'npm install --save-dev mocha jest');
  }

  await createBackendFiles(backendPath, answers);
}

async function createBackendFiles(backendPath, answers) {
  console.log("\n📝 Creating backend files...");

  writeFileAndTrack(
    joinPaths(backendPath, 'index.js'),
    generateBackendIndexJS(answers)
  );

  writeFileAndTrack(
    joinPaths(backendPath, 'routes', 'exampleRoutes.js'),
    generateExampleRoutesJS()
  );

  writeFileAndTrack(
    joinPaths(backendPath, 'controllers', 'exampleController.js'),
    generateExampleControllerJS()
  );

  writeFileAndTrack(
    joinPaths(backendPath, '.env'),
    generateEnvFile(answers)
  );

  updatePackageScripts(backendPath, {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": answers.testing ? "jest" : "echo \"Error: no test specified\" && exit 1"
  });
}

// File generators
function generateWebpackConfig() {
  return `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
};`;
}

function generateReactIndexJS() {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
}

function generateReactAppJS() {
  return `import React from 'react';

function App() {
  return (
    <div>
      <h1>Welcome to My MERN App</h1>
    </div>
  );
}

export default App;`;
}

function generateIndexHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MERN App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
}


function generatePostCSSConfig() {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
}

function generateBackendIndexJS(answers) {
  return `require('dotenv').config();
const express = require('express');
const cors = require('cors');
const exampleRoutes = require('./routes/exampleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/examples', exampleRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Backend Server is Running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`;
}

function generateExampleRoutesJS() {
  return `const express = require('express');
const router = express.Router();
const {
  getExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample
} = require('../controllers/exampleController');

// GET all examples
router.get('/', getExamples);

// GET a single example
router.get('/:id', getExampleById);

// POST a new example
router.post('/', createExample);

// PUT (update) an example
router.put('/:id', updateExample);

// DELETE an example
router.delete('/:id', deleteExample);

module.exports = router;`;
}

function generateExampleControllerJS() {
  return `// Example in-memory database (replace with real database in production)
let examples = [
  { id: 1, name: 'Example 1', description: 'First example' },
  { id: 2, name: 'Example 2', description: 'Second example' }
];

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getExamples = (req, res) => {
  res.status(200).json(examples);
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getExampleById = (req, res) => {
  const example = examples.find(e => e.id === parseInt(req.params.id));
  
  if (example) {
    res.status(200).json(example);
  } else {
    res.status(404).json({ message: 'Example not found' });
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const createExample = (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ message: 'Please include name and description' });
  }
  
  const example = {
    id: examples.length + 1,
    name: req.body.name,
    description: req.body.description
  };
  
  examples.push(example);
  res.status(201).json(example);
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateExample = (req, res) => {
  const example = examples.find(e => e.id === parseInt(req.params.id));
  
  if (!example) {
    return res.status(404).json({ message: 'Example not found' });
  }
  
  example.name = req.body.name || example.name;
  example.description = req.body.description || example.description;
  
  res.status(200).json(example);
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deleteExample = (req, res) => {
  const index = examples.findIndex(e => e.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Example not found' });
  }
  
  examples.splice(index, 1);
  res.status(200).json({ message: 'Example removed' });
};

module.exports = {
  getExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample
};`;
}

function generateEnvFile(answers) {
  return `PORT=5000
NODE_ENV=development
${answers.orm.includes('Mongoose') ? 'MONGO_URI=mongodb://localhost:27017/' + answers.projectName + '\n' : ''}
${answers.orm.includes('Sequelize') ? `DB_NAME=${answers.projectName}
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost\n` : ''}`;
}

// Utility functions
function writeFileAndTrack(filePath, content) {
  fs.writeFileSync(filePath, content);
  createdFiles.push(filePath);
  console.log(`✅ Created file: ${path.relative(projectRoot, filePath)}`);
}

function updateMainEntryFile(filePath, prependContent) {
  if (fs.existsSync(filePath)) {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(filePath, `${prependContent}\n${originalContent}`);
  }
}

function updatePackageScripts(pkgPath, scripts) {
  const packageJsonPath = joinPaths(pkgPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.scripts = scripts;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("✅ Updated package.json scripts");
}

async function executeCommand(cwd, command) {
  try {
    execSync(command, {
      cwd: cwd,
      stdio: 'inherit',
      shell: true,
      windowsHide: true
    });
  } catch (error) {
    console.error(`Command failed in ${cwd}: ${command}`);
    throw error;
  }
}

function displaySuccessMessage(projectName) {
  console.log(`\n✅ MERN project '${projectName}' setup complete! Happy coding!\n`);
  console.log(`To get started:
  cd ${projectName}
  Start frontend: cd client && npm run dev
  Start backend: cd backend && npm run dev
    `);
}

// Cleanup function
async function cleanup(error) {
  console.error('\n❌ Error occurred during setup:', error.message);
  console.log('\n🧹 Cleaning up created files and directories...');

  // Add delay for Windows file handles
  await new Promise(resolve => setTimeout(resolve, 500));

  // Delete files with retry logic
  for (const file of createdFiles.reverse()) {
    await deleteWithRetry(file, 'file');
  }

  // Delete directories with retry logic
  for (const dir of createdDirs.reverse()) {
    await deleteWithRetry(dir, 'directory');
  }

  // Clean node_modules if needed
  if (installedDeps && projectRoot) {
    const nodeModulesPaths = [
      joinPaths(projectRoot, 'client', 'node_modules'),
      joinPaths(projectRoot, 'backend', 'node_modules')
    ];

    for (const nmPath of nodeModulesPaths) {
      await deleteWithRetry(nmPath, 'directory');
    }
  }

  console.log('\n⚠️ Setup failed. All created files and directories have been removed.');
  process.exit(1);
}

async function deleteWithRetry(target, type) {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      if (fs.existsSync(target)) {
        if (type === 'file') {
          fs.unlinkSync(target);
        } else {
          fs.rmSync(target, { recursive: true, force: true });
        }
        console.log(`  - Deleted ${type}: ${target}`);
        return;
      }
    } catch (err) {
      retryCount++;
      if (retryCount === maxRetries) {
        console.error(`  - Failed to delete ${type} ${target}:`, err.message);
      } else {
        await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
      }
    }
  }
}

// Start the setup process
setupProject().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});