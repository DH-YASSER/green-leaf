import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore, hasFirebaseConfig } from './firebaseClient';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
  if (!hasFirebaseConfig || !firebaseAuth || !firestore) {
    throw new Error('Firebase is not configured.');
  }

  const credential = await signInWithPopup(firebaseAuth, googleProvider);
  const firebaseUser = credential.user;
  const userRef = doc(firestore, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  let user;
  if (userSnap.exists()) {
    user = { id: userSnap.id, ...userSnap.data() };
  } else {
    user = {
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
  }

  const token = await firebaseUser.getIdToken();
  return { user, token };
};
