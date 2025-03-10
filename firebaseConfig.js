import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDNHCxqUiNiVi2SWd14u3D4Kc3lzzBBl30",
    authDomain: "shop-53650.firebaseapp.com",
    projectId: "shop-53650",
    storageBucket: "shop-53650.firebasestorage.app",
    messagingSenderId: "546525830311",
    appId: "1:546525830311:web:31be33e6d1e21a2d000f82"  
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };