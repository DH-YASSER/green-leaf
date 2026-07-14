# Green Leaf Firebase Version

This branch is the no-Laravel version of Green Leaf.

The original Laravel + MySQL version stays on `main`.

Live Firebase Hosting URL: https://greenleaf-46120.web.app

## What changes here

- React talks directly to Firebase.
- Firebase Auth replaces Laravel auth.
- Firestore replaces MySQL.
- Cloudinary unsigned uploads replace Laravel public uploads and Firebase Storage.
- Laravel does not need to be running when `VITE_DATA_MODE=firebase`.

## Local setup

1. Create a Firebase project.
2. Enable Authentication with Email/Password.
3. Enable Firestore.
4. Create a free Cloudinary account.
5. In Cloudinary, create an unsigned upload preset.
6. Copy `frontend/.env.firebase.example` to `frontend/.env.local`.
7. Fill in your Firebase config and Cloudinary values.
8. Run:

```bash
cd frontend
npm install
npm run dev
```

## Deploy frontend to Firebase Hosting

```bash
cd frontend
npm run build
cd ..
firebase deploy
```

Firebase Storage is intentionally not required, so this can stay on Firebase Spark/free plan.

## Notes

This branch keeps the same UI but swaps the data layer. Some complex flows still need hardening before production, especially admin actions, payment logic, and advanced notification delivery.

If Cloudinary env values are missing, image uploads fall back to compressed Base64 strings. That fallback is useful for tiny demo images only; Cloudinary is recommended for real product and shop images.
