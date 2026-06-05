import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtVHlBwqQ-qmpoCde1_b_NQ3nNijbwvBA",
  authDomain: "ecommerce-backend-design-ca106.firebaseapp.com",
  projectId: "ecommerce-backend-design-ca106",
  storageBucket: "ecommerce-backend-design-ca106.firebasestorage.app",
  messagingSenderId: "327933923447",
  appId: "1:327933923447:web:7054267278de9d8b0a3672"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;