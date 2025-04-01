#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

async function setupProject() {
    console.log("Welcome to Create MERN App!\n");
    console.log("\n🚀 Setting up your MERN project...\n");

    try {
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

        const projectRoot = path.resolve(answers.projectName);
        
        // Create project directories
        try {
            fs.mkdirSync(projectRoot, { recursive: true });
            fs.mkdirSync(path.join(projectRoot, 'client'), { recursive: true });
            fs.mkdirSync(path.join(projectRoot, 'backend'), { recursive: true });
        } catch (err) {
            throw new Error(`Failed to create directories: ${err.message}`);
        }

        console.log("\n📦 Installing dependencies...\n");

        // Setup frontend
        console.log("\n🛠️ Setting up frontend...");
        try {
            const viteOrWebpack = answers.bundler.toLowerCase();
            execSync(`cd ${path.join(projectRoot, 'client')} && npx create-${viteOrWebpack}@latest .`, { 
                stdio: 'inherit',
                shell: true 
            });
            
            execSync(`cd ${path.join(projectRoot, 'client')} && npm install dotenv`, { 
                stdio: 'inherit',
                shell: true 
            });
            
            if (answers.css === 'Tailwind') {
                console.log("\n🌊 Installing Tailwind CSS...");
                execSync(`cd ${path.join(projectRoot, 'client')} && npm install -D tailwindcss postcss autoprefixer`, { 
                    stdio: 'inherit',
                    shell: true 
                });
                // You might want to add tailwind.config.js setup here
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
                
                try {
                    // First try with default registry
                    execSync(`cd ${path.join(projectRoot, 'backend')} && npm install --save-dev mocha jest`, { 
                        stdio: 'inherit',
                        shell: true,
                        timeout: 120000 // 2 minute timeout
                    });
                } catch (error) {
                    console.log("\n⚠️ First attempt failed. Trying with different options...");
                    
                    try {
                        // Fallback 1: Try with legacy peer deps
                        execSync(`cd ${path.join(projectRoot, 'backend')} && npm install --save-dev mocha jest --legacy-peer-deps`, { 
                            stdio: 'inherit',
                            shell: true
                        });
                    } catch (error) {
                        console.log("\n⚠️ Second attempt failed. Trying with yarn...");
                        
                        try {
                            // Fallback 2: Try using yarn instead
                            execSync(`cd ${path.join(projectRoot, 'backend')} && yarn add mocha jest --dev`, { 
                                stdio: 'inherit',
                                shell: true
                            });
                        } catch (error) {
                            console.log("\n⚠️ Could not install testing libraries automatically. You can install them manually later with:");
                            console.log(`cd ${path.join(projectRoot, 'backend')}`);
                            console.log("npm install --save-dev mocha jest");
                            console.log("OR if that fails, try:");
                            console.log("npm install --save-dev mocha jest --legacy-peer-deps");
                        }
                    }
                }
            }
        } catch (err) {
            throw new Error(`Backend setup failed: ${err.message}`);
        }

        console.log(`\n✅ MERN project '${answers.projectName}' setup complete! Happy coding!\n`);
        console.log(`To get started:
  cd ${answers.projectName}
  Start frontend: cd client && npm run dev
  Start backend: cd backend && npm start
        `);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

setupProject().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});