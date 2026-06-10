# Green Leaf — B2B Moroccan Food Marketplace

**Green Leaf** is a modern B2B marketplace platform designed to connect restaurants directly with verified agricultural suppliers and food producers in Morocco (Casablanca, Rabat, Marrakech, Fes, Tanger, Agadir). 

This repository contains both the **React + Vite Frontend** and the **Laravel Backend** codebases.

---

## 🌟 Key Features

*   **Supplier Directory & Filters:** Browse and filter ingredients by category, price range, city, and ratings.
*   **Role-Based Access Control:** Distinct dashboard views for **Restaurants**, **Suppliers (Fournisseurs)**, and **Admins**.
*   **Interactive Demo Mode:** The frontend comes with a fully integrated mock database in `localStorage` enabling a zero-backend interactive experience for prototyping and demonstration.
*   **Moroccan-Inspired Design:** Beautiful glassmorphic UI utilizing authentic color accents and zellige patterns.
*   **Bilingual Adaptability:** Unified support for French and English culinary terminology.

---

## 🛠️ Project Structure

```
green-leaf/
├── frontend/         # React 18 + Vite + Tailwind CSS v4 + Zustand
└── backend/          # Laravel REST API (PHP)
```

---

## 🚀 How to Run Locally

### 1. Frontend (React)

Make sure you have [Node.js](https://nodejs.org/) installed:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

#### 🔑 Demo Accounts (Pre-seeded in Local Storage)
*   **Restaurant:** `restaurant@demo.com` / `demo123`
*   **Supplier (Fournisseur):** `fournisseur@demo.com` / `demo123`
*   **Admin:** `admin@demo.com` / `admin123`

### 2. Backend (Laravel)

Make sure you have [PHP 8.2+](https://www.php.net/) and [Composer](https://getcomposer.org/) installed:

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## 📦 How to Push & Deploy to GitHub Pages

Since background processes cannot open the interactive browser login for GitHub, you just need to run the following commands in your own terminal (VS Code Terminal, Command Prompt, or PowerShell) to push the code and publish the site.

### Step 1: Push the Code to your GitHub

Open your terminal at `C:\Users\HP\Desktop\markeat` and run:

```bash
# Push the codebase to your new repository
git push -u origin main
```
*(A window will pop up allowing you to log in to GitHub securely in one click.)*

### Step 2: Publish to GitHub Pages

Once the code is pushed, deploy the React site:

```bash
cd frontend
npm run deploy
```

Your B2B marketplace will be live at:  
👉 **`https://DH-YASSER.github.io/green-leaf/`**
