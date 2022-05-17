import Alpine from "alpinejs";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

window.Alpine = Alpine;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNr45Rauj9onr0uS7r6JTwcDKwca6QMt8",
  authDomain: "hugo-auth.firebaseapp.com",
  projectId: "hugo-auth",
  storageBucket: "hugo-auth.appspot.com",
  messagingSenderId: "787501773342",
  appId: "1:787501773342:web:32f95ebb80a45a97f9f40f",
};
//👆 TODO: Change this to your firebase instance

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

Alpine.store("status", {
  loading: true,
  loaded(){
    this.loading = false;
  }
});

Alpine.store("auth", {
  currentUser: false,

  login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.currentUser = userCredential.user;
        Alpine.store("status").loaded();
        window.location = "/";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
      });
      
  },

  register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.currentUser = userCredential.user;
        Alpine.store("status").loaded();
        window.location = "/";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  },

  logout() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        this.currentUser = false;
        window.location = "/";
      })
      .catch((error) => {
        // An error happened.
      });
  },
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    Alpine.store("auth").currentUser = user;
  } else {
    // User is signed out
    // ...
  }

  Alpine.store("status").loaded();
});

// Global state to get single post
Alpine.store("post", {
  async get(url) {
    console.log(url);
    const response = await fetch(url);
    const post = await response.text();
    return JSON.parse(post);
  },
});

Alpine.start();
