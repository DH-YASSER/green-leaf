# Green Leaf - B2B Moroccan Food Marketplace

**Laravel/MySQL frontend demo:** https://dh-yasser.github.io/green-leaf/

**Firebase version demo:** https://greenleaf-46120.web.app/

Green Leaf is a modern B2B marketplace platform designed to connect restaurants directly with verified agricultural suppliers and food producers in Morocco.

This repository contains both the React + Vite frontend and the Laravel backend codebases.

There are two versions:

- `main`: original Laravel + MySQL version.
- `firebase-version`: no-Laravel version using Firebase Auth, Firestore, Firebase Hosting, and Cloudinary for image uploads.

---

## Key Features

- Supplier directory with search, filters, categories, ratings, and city-based discovery.
- Role-based dashboards for restaurants, suppliers, and admins.
- Restaurant ordering flow with cart, order tracking, and notifications.
- Supplier shop setup, product management, media handling, and review status.
- Admin panel for users, suppliers, products, orders, categories, settings, and logs.
- Light/dark theme and bilingual-friendly UI structure.

---

## Project Structure

```text
green-leaf/
├── frontend/   # React + Vite + Zustand
└── backend/    # Laravel REST API
```

---

## Run Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/green-leaf/`.

### Backend

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## Demo Accounts

- Restaurant: `restaurant@demo.com` / `demo123`
- Supplier: `fournisseur@demo.com` / `demo123`
- Admin: `admin@demo.com` / `admin123`

---

## GitHub Pages Deployment

```bash
cd frontend
npm run deploy
```

Live site:
https://dh-yasser.github.io/green-leaf/

Note: GitHub Pages hosts the frontend only. Laravel/MySQL must be deployed separately for full backend/database functionality online.

---

## Firebase Version

Firebase live site:
https://greenleaf-46120.web.app/

Branch:
https://github.com/DH-YASSER/green-leaf/tree/firebase-version

This version does not require Laravel or MySQL online. It uses Firebase for hosting/auth/database and Cloudinary for image uploads.
