#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

async function setupProject() {
    let projectRoot = '';
    let createdDirs = [];
    let installedDeps = false;
    let createdFiles = [];

    // Cleanup function to remove created files/dirs on error
    const cleanup = async (error) => {
        console.error('\n❌ Error occurred during setup:', error.message);
        console.log('\n🧹 Cleaning up created files and directories...');

        // Delete created files in reverse order
        for (const file of createdFiles.reverse()) {
            try {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                    console.log(`  - Deleted file: ${file}`);
                }
            } catch (err) {
                console.error(`  - Failed to delete file ${file}:`, err.message);
            }
        }

        // Delete created directories in reverse order
        for (const dir of createdDirs.reverse()) {
            try {
                if (fs.existsSync(dir)) {
                    fs.rmSync(dir, { recursive: true, force: true });
                    console.log(`  - Deleted directory: ${dir}`);
                }
            } catch (err) {
                console.error(`  - Failed to delete directory ${dir}:`, err.message);
            }
        }

        // If we installed dependencies, remove node_modules
        if (installedDeps && projectRoot) {
            const nodeModulesPaths = [
                path.join(projectRoot, 'client', 'node_modules'),
                path.join(projectRoot, 'backend', 'node_modules')
            ];

            for (const nmPath of nodeModulesPaths) {
                try {
                    if (fs.existsSync(nmPath)) {
                        fs.rmSync(nmPath, { recursive: true, force: true });
                        console.log(`  - Deleted node_modules: ${nmPath}`);
                    }
                } catch (err) {
                    console.error(`  - Failed to delete node_modules ${nmPath}:`, err.message);
                }
            }
        }

        console.log('\n⚠️ Setup failed. All created files and directories have been removed.');
        process.exit(1);
    };

    try {
        console.log("Welcome to Create MERN App!\n");
        console.log("\n🚀 Setting up your MERN project...\n");

        const answers = await inquirer.prompt([
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

        projectRoot = path.resolve(answers.projectName);

        // Create project directories
        try {
            fs.mkdirSync(projectRoot, { recursive: true });
            createdDirs.push(projectRoot);
            console.log(`✅ Created project directory: ${projectRoot}`);

            fs.mkdirSync(path.join(projectRoot, 'client'), { recursive: true });
            createdDirs.push(path.join(projectRoot, 'client'));
            console.log(`✅ Created client directory`);

            fs.mkdirSync(path.join(projectRoot, 'backend'), { recursive: true });
            createdDirs.push(path.join(projectRoot, 'backend'));
            console.log(`✅ Created backend directory`);

            // Create backend subdirectories
            fs.mkdirSync(path.join(projectRoot, 'backend', 'controllers'), { recursive: true });
            createdDirs.push(path.join(projectRoot, 'backend', 'controllers'));
            console.log(`✅ Created controllers directory`);

            fs.mkdirSync(path.join(projectRoot, 'backend', 'routes'), { recursive: true });
            createdDirs.push(path.join(projectRoot, 'backend', 'routes'));
            console.log(`✅ Created routes directory`);

            fs.mkdirSync(path.join(projectRoot, 'backend', 'models'), { recursive: true });
            createdDirs.push(path.join(projectRoot, 'backend', 'models'));
            console.log(`✅ Created models directory`);
        } catch (err) {
            throw new Error(`Failed to create directories: ${err.message}`);
        }

        console.log("\n📦 Installing dependencies...\n");
        installedDeps = true;

        // Setup frontend (simplified for example)
        try {
            console.log("\n🛠️ Setting up frontend...");
            const viteOrWebpack = answers.bundler.toLowerCase();
            execSync(`cd ${path.join(projectRoot, 'client')} && npx create-${viteOrWebpack}@latest .`, {
                stdio: 'inherit',
                shell: true
            });

            // Track created frontend files (simplified)
            createdFiles.push(path.join(projectRoot, 'client', 'package.json'));
            createdFiles.push(path.join(projectRoot, 'client', 'package-lock.json'));

            if (answers.css === 'Tailwind') {
                console.log("\n🌊 Installing Tailwind CSS...");
                execSync(`cd ${path.join(projectRoot, 'client')} && npm install -D tailwindcss postcss autoprefixer`, {
                    stdio: 'inherit',
                    shell: true
                });
            }

            if (answers.css === 'Bootstrap') {
                console.log("\n🎨 Installing Bootstrap...");
                execSync(`cd ${path.join(projectRoot, 'client')} && npm install bootstrap`, {
                    stdio: 'inherit',
                    shell: true
                });
            }
        } catch (err) {
            throw new Error(`Frontend setup failed: ${err.message}`);
        }

        // Setup backend
        console.log("\n⚙️ Setting up backend...");
        try {
            execSync(`cd ${path.join(projectRoot, 'backend')} && npm init -y`, {
                stdio: 'inherit',
                shell: true
            });

            // Track created backend files
            createdFiles.push(path.join(projectRoot, 'backend', 'package.json'));
            createdFiles.push(path.join(projectRoot, 'backend', 'package-lock.json'));

            execSync(`cd ${path.join(projectRoot, 'backend')} && npm install express dotenv cors`, {
                stdio: 'inherit',
                shell: true
            });

            execSync(`cd ${path.join(projectRoot, 'backend')} && npm install --save-dev nodemon`, {
                stdio: 'inherit',
                shell: true
            });

            if (answers.orm.includes('Mongoose')) {
                console.log("\n🍃 Installing Mongoose...");
                execSync(`cd ${path.join(projectRoot, 'backend')} && npm install mongoose`, {
                    stdio: 'inherit',
                    shell: true
                });
            }

            if (answers.orm.includes('Sequelize')) {
                console.log("\n📊 Installing Sequelize...");
                execSync(`cd ${path.join(projectRoot, 'backend')} && npm install sequelize pg pg-hstore`, {
                    stdio: 'inherit',
                    shell: true
                });
            }

            if (answers.testing) {
                console.log("\n🧪 Installing testing libraries...");
                execSync(`cd ${path.join(projectRoot, 'backend')} && npm install --save-dev mocha jest`, {
                    stdio: 'inherit',
                    shell: true
                });
            }

            // Create backend files with basic setup
            console.log("\n📝 Creating backend files...");

            // Function to create and track files
            const createBackendFile = (filePath, content) => {
                fs.writeFileSync(filePath, content);
                createdFiles.push(filePath);
                console.log(`✅ Created file: ${path.relative(projectRoot, filePath)}`);
            };

            // Create index.js
            createBackendFile(
                path.join(projectRoot, 'backend', 'index.js'),
                `require('dotenv').config();
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
});`
            );

            // Create exampleRoutes.js
            createBackendFile(
                path.join(projectRoot, 'backend', 'routes', 'exampleRoutes.js'),
                `const express = require('express');
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

module.exports = router;`
            );

            // Create exampleController.js
            createBackendFile(
                path.join(projectRoot, 'backend', 'controllers', 'exampleController.js'),
                `// Example in-memory database (replace with real database in production)
let examples = [
  { id: 1, name: 'Example 1', description: 'First example' },
  { id: 2, name: 'Example 2', description: 'Second example' }
];

// @desc    Get all examples
// @route   GET /api/examples
// @access  Public
const getExamples = (req, res) => {
  res.status(200).json(examples);
};

// @desc    Get single example
// @route   GET /api/examples/:id
// @access  Public
const getExampleById = (req, res) => {
  const example = examples.find(e => e.id === parseInt(req.params.id));
  
  if (example) {
    res.status(200).json(example);
  } else {
    res.status(404).json({ message: 'Example not found' });
  }
};

// @desc    Create example
// @route   POST /api/examples
// @access  Public
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

// @desc    Update example
// @route   PUT /api/examples/:id
// @access  Public
const updateExample = (req, res) => {
  const example = examples.find(e => e.id === parseInt(req.params.id));
  
  if (!example) {
    return res.status(404).json({ message: 'Example not found' });
  }
  
  example.name = req.body.name || example.name;
  example.description = req.body.description || example.description;
  
  res.status(200).json(example);
};

// @desc    Delete example
// @route   DELETE /api/examples/:id
// @access  Public
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
};`
            );

            // Create .env file
            createBackendFile(
                path.join(projectRoot, 'backend', '.env'),
                `PORT=5000
NODE_ENV=development
${answers.orm.includes('Mongoose') ? 'MONGO_URI=mongodb://localhost:27017/' + answers.projectName + '\n' : ''}
${answers.orm.includes('Sequelize') ? `DB_NAME=${answers.projectName}
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost\n` : ''}`
            );

            // Update package.json scripts
            const packageJsonPath = path.join(projectRoot, 'backend', 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            packageJson.scripts = {
                "start": "node index.js",
                "dev": "nodemon index.js",
                "test": answers.testing ? "jest" : "echo \"Error: no test specified\" && exit 1"
            };
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log("✅ Updated package.json scripts");

        } catch (err) {
            throw new Error(`Backend setup failed: ${err.message}`);
        }

        console.log(`\n✅ MERN project '${answers.projectName}' setup complete! Happy coding!\n`);
        console.log(`To get started:
  cd ${answers.projectName}
  Start frontend: cd client && npm run dev
  Start backend: cd backend && npm run dev
        `);

    } catch (error) {
        await cleanup(error);
    }
}

setupProject().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
