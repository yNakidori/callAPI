// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const auth = getAuth(app);

export { auth };
