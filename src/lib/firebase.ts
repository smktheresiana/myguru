/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjEErYpmmogCrC3iwqtU_3rHgyQ4XiQH4",
  authDomain: "myguru-7ae8a.firebaseapp.com",
  projectId: "myguru-7ae8a",
  storageBucket: "myguru-7ae8a.firebasestorage.app",
  messagingSenderId: "381327609118",
  appId: "1:381327609118:web:058a133465ae686a2fcd0f",
  measurementId: "G-PJ3EG6W5JG", // boleh tetap ada atau dihapus
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;
