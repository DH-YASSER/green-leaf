import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore, hasFirebaseConfig } from './firebaseClient';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const ensureGoogleUserProfile = async (firebaseUser) => {
  const userRef = doc(firestore, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }

  const user = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'Google user',
    email: firebaseUser.email,
    avatar_url: firebaseUser.photoURL || '',
    role: 'restaurant',
    company_name: firebaseUser.displayName || 'Restaurant GreenLeaf',
    city: 'casablanca',
    provider: 'google',
    created_at: new Date().toISOString(),
    created_server_at: serverTimestamp(),
  };
  await setDoc(userRef, user, { merge: true });
  return user;
};

const assertFirebaseAuthReady = () => {
  if (!hasFirebaseConfig || !firebaseAuth || !firestore) {
    throw new Error('Firebase is not configured.');
  }
};

export const startGoogleSignIn = async () => {
  assertFirebaseAuthReady();
  await signInWithRedirect(firebaseAuth, googleProvider);
};

export const completeGoogleSignIn = async () => {
  assertFirebaseAuthReady();
  const credential = await getRedirectResult(firebaseAuth);
  if (!credential?.user) {
    return null;
  }

  const user = await ensureGoogleUserProfile(credential.user);
  const token = await credential.user.getIdToken();
  return { user, token };
};
