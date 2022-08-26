// Import FirebaseAuth and firebase.
import React, { useEffect, useRef } from 'react';

import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './firebaseui.css';
import { useTheme } from '@emotion/react';

// Configure Firebase.
const config = {
  apiKey: 'AIzaSyBev3DymCj11FvaNPiH5fbzsyUPGnD160g',
  authDomain: 'spi-map-5fc21.firebaseapp.com',
  projectId: 'spi-map-5fc21',
  storageBucket: 'spi-map-5fc21.appspot.com',
  messagingSenderId: '54606573448',
  appId: '1:54606573448:web:09fa7f82355f05cfc4143d',
  measurementId: 'G-MP8HGDHKHJ',
};
firebase.initializeApp(config);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/signedIn',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

const SignInScreen = () => {
  const theme = useTheme();
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    const { contained, outlined } = theme.components.MuiButton.styleOverrides;

    if (container) {
      container.style.setProperty('--button-contained-border-radius', contained.borderRadius);
      container.style.setProperty('--button-outlined-border-radius', outlined.borderRadius);

      container.style.setProperty('--btn-contained-box-shadow', contained.boxShadow);
      container.style.setProperty('--btn-outlined-box-shadow', outlined.boxShadow);

      const { main, light, dark } = theme.palette.primary;
      container.style.setProperty('--palette-primary-main', main);
      container.style.setProperty('--palette-primary-light', light);
      container.style.setProperty('--palette-primary-dark', dark);
    }
  }, [theme]);
  return (
    <div ref={containerRef}>
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};

export default SignInScreen;
