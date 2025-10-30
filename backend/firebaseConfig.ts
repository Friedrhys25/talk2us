// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBZ5PXYdtJY9bpXkC35ZyoIVcid0kP1nk",
  authDomain: "talk2kap-f73a0.firebaseapp.com",
  databaseURL: "https://talk2kap-f73a0-default-rtdb.firebaseio.com",
  projectId: "talk2kap-f73a0",
  storageBucket: "talk2kap-f73a0.appspot.com", // ✅ FIXED: should be .appspot.com
  messagingSenderId: "897405877837",
  appId: "1:897405877837:web:75088eeb2343fab5c86604",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
