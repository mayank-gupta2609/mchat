import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 

const firebaseConfig = {
    apiKey: "AIzaSyDYCrC7obHkVqCv7XOKYiKPKr2sJzew7Uk",
    authDomain: "mchat-c97fc.firebaseapp.com",
    projectId: "mchat-c97fc",
    storageBucket: "mchat-c97fc.appspot.com",
    messagingSenderId: "680359751762",
    appId: "1:680359751762:web:e10b0421ee15d8a59d2f8b"
}
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { db, auth, provider }