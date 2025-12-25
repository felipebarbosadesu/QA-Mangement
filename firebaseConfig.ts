import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBqP8Kp4vVxh8YxMZxYxZxYxZxYxZxYxZx",
  authDomain: "quality-hub-demo.firebaseapp.com",
  projectId: "quality-hub-demo",
  storageBucket: "quality-hub-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop",
  databaseURL: "https://quality-hub-demo-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const appId = 'quality-hub-fastshop';
