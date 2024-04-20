import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

// Copy this file, then rename it to firebase-env.ts
// Replace with your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "yourApiKey",
  authDomain: "authDomain",
  databaseURL: "databaseUrl",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "1234567890",
  appId: "1234567890"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app)

export default database
