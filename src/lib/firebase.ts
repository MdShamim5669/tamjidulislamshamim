import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyALMpgBLO6J_7ewh7fonTyPsSbTtwRhFIs",
  authDomain: "tamjidulislamshamim-b6175.firebaseapp.com",
  projectId: "tamjidulislamshamim-b6175",
  storageBucket: "tamjidulislamshamim-b6175.firebasestorage.app",
  messagingSenderId: "810902546592",
  appId: "1:810902546592:web:1665cd7c7ab89b077641c5",
  measurementId: "G-9DQ0L4X977"
};

// Initialize Firebase safely (avoid multi-initialization in SSR)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics conditionally only in browser
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
