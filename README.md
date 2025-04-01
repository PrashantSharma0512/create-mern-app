# 📦 create-mern-app – MERN Project Setup Tool

🚀 **create-mern-app** is a simple and interactive command-line tool to quickly set up a **MERN (MongoDB, Express, React, Node.js) stack** project with customizable configurations.

---

## ✨ Features
- 📁 **Auto-creates project structure** (`client` & `backend` folders).
- ⚡ **Frontend choices**: Select `Vite` or `Webpack` as your bundler.
- 🎨 **CSS Frameworks**: Choose `Tailwind CSS`, `Bootstrap`, or `None`.
- 🗄️ **Database ORM**: Use `Mongoose (MongoDB)`, `Sequelize (SQL)`, or skip ORM.
- 🧪 **Testing Support**: Optionally add `Mocha` or `Jest`.
- 🔧 **Preconfigured Backend**: Installs `Express.js`, `dotenv`, and `cors`.
- 📦 **Automated Dependency Installation**: Saves time by installing everything for you.

---

## 🚀 Installation
You can install it globally:
```sh
npm install -g create-mern-app
```
Or use it without installation via `npx`:
```sh
npx create-mern-app
```

---

## 📖 Usage
Simply run:
```sh
create-mern
```
Follow the prompts and let the CLI set up your project.

---

## 🛠️ Example
```
? Enter project name: my-mern-app
? Choose frontend bundler: Vite
? Choose a CSS framework: Tailwind
? Choose a backend ORM: Mongoose (MongoDB)
? Do you want to add a testing library? (Mocha/Jest) Yes
```
This will create a project named `my-mern-app` with:
- `Vite` for frontend
- `Tailwind CSS` for styling
- `Mongoose` for MongoDB
- `Mocha/Jest` for testing

---

## 📜 License
MIT License.