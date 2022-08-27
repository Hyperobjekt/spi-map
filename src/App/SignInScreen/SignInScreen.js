import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as yup from 'yup';
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { Formik } from 'formik';
import { values } from 'lodash';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

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

initializeApp(config);

const SignInScreen = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState();

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {showRegistrationForm ? (
          <RegistrationForm setShowRegistrationForm={setShowRegistrationForm} />
        ) : (
          <LoginForm setShowRegistrationForm={setShowRegistrationForm} />
        )}
      </Container>
    </div>
  );
};

export default SignInScreen;
