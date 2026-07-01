/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuration imported directly or set as constants for reliability
const firebaseConfig = {
  apiKey: "AIzaSyC5cASDGFRL6H_v5QC4EGG1Sp6ygcd8RWU",
  authDomain: "applied-acronym-m8t0d.firebaseapp.com",
  projectId: "applied-acronym-m8t0d",
  storageBucket: "applied-acronym-m8t0d.firebasestorage.app",
  messagingSenderId: "619711977121",
  appId: "1:619711977121:web:9489490b72278b93bd82e0"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom databaseId provided in configuration
const databaseId = "ai-studio-aatsaiacademicte-e981b548-caa2-4ba1-b2df-edea1ca3b354";
export const db = getFirestore(app, databaseId);
