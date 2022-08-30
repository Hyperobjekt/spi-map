import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebase = initializeApp({
  apiKey: 'AIzaSyBev3DymCj11FvaNPiH5fbzsyUPGnD160g',
  authDomain: 'spi-map-5fc21.firebaseapp.com',
  projectId: 'spi-map-5fc21',
  storageBucket: 'spi-map-5fc21.appspot.com',
  messagingSenderId: '54606573448',
  appId: '1:54606573448:web:09fa7f82355f05cfc4143d',
  measurementId: 'G-MP8HGDHKHJ',
});

export const auth = getAuth(firebase);
