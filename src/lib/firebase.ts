import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1ngJ1SWVo2sWr9AtK0RS_D_TxHPzR8X8",
  authDomain: "proposalautomation-4a1a7.firebaseapp.com",
  projectId: "proposalautomation-4a1a7",
  storageBucket: "proposalautomation-4a1a7.firebasestorage.app",
  messagingSenderId: "373413307744",
  appId: "1:373413307744:web:758f2f4b86516c7a4b2a05"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
