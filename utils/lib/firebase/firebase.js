import firebase from 'firebase/app';
import 'firebase/storage';

//creating firebase bucket credentials and etc here
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
// };

const firebaseConfig = {
  apiKey: 'AIzaSyC6rTCgMnGyhkA4dBIBCi2lobd7G1ZY5M0',
  authDomain: 'next-social-picture.firebaseapp.com',
  projectId: 'next-social-picture',
  storageBucket: 'next-social-picture.appspot.com',
  messagingSenderId: '813558001513',
  appId: '1:813558001513:web:fdec643e13e7b5aa9d17f8',
  measurementId: 'G-TJZY22Z0X4'
};
// let firebaseApp = null;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();
export default storage;
