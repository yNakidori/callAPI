import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDI7RMv_Tl1otgJUHzlGwg7Gw_KjoV6Ixc",
  authDomain: "callapi-d7664.firebaseapp.com",
  projectId: "callapi-d7664",
  storageBucket: "callapi-d7664.appspot.com",
  messagingSenderId: "385566603859",
  appId: "1:385566603859:web:1137866027fa82e1e564a6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, storage };
