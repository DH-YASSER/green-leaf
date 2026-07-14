# Green Leaf Firebase Version

This branch is the no-Laravel version of Green Leaf.

The original Laravel + MySQL version stays on `main`.

Live Firebase Hosting URL: https://greenleaf-46120.web.app

## What changes here

- React talks directly to Firebase.
- Firebase Auth replaces Laravel auth.
- Firestore replaces MySQL.
- Firebase Storage replaces Laravel public uploads.
- Laravel does not need to be running when `VITE_DATA_MODE=firebase`.

## Local setup

1. Create a Firebase project.
2. Enable Authentication with Email/Password.
3. Enable Firestore.
4. Enable Storage.
5. Copy `frontend/.env.firebase.example` to `frontend/.env.local`.
6. Fill in your Firebase config values.
7. Run:

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

If Storage is not enabled yet in Firebase Console, deploy hosting only:

```bash
firebase deploy --only hosting
```

## Notes

This branch keeps the same UI but swaps the data layer. Some complex flows still need hardening before production, especially admin actions, payment logic, and advanced notification delivery.
