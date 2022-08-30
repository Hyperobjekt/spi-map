import { useEffect } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import { EmailError, PasswordError } from './utils';
import { useAuthCreateUserWithEmailAndPassword } from '@react-query-firebase/auth';
import { auth } from 'App/firebase';

const RegistrationFormSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  usage: yup
    .string('Enter a value')
    .oneOf(
      [
        'policymaking',
        'resource_allocation',
        'investments',
        'advocacy',
        'academic_research',
        'personal_research',
        'csr_esg_strategy',
        'other',
      ],
      'Invalid selection',
    )
    .required('Primary use is required'),
});

const RegistrationForm = ({ handleShowLoginForm, onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: createUser, error } = useAuthCreateUserWithEmailAndPassword(auth, {
    onSuccess: (userCredentials) => {
      onRegister(userCredentials);
      // firestore.collection('users').doc(userCredential.user.uid).set({
      //   name,
      //   lastName,
      // });
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword((x) => !x);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Formik
          initialValues={{
            email: '',
            password: '',
            usage: '',
          }}
          onSubmit={({ email, password }, { setSubmitting, setFieldError, setStatus }) =>
            createUser({ email, password })
          }
          validationSchema={RegistrationFormSchema}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => (
            <>
              <TextField
                margin="dense"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                error={!!EmailError[error?.code] || (touched.email && !!errors.email)}
                helperText={EmailError[error?.code] || (touched.email && errors.email) || ' '}
                required
                autoFocus
              />
              <TextField
                margin="dense"
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                error={!!PasswordError[error?.code] || (touched.password && !!errors.password)}
                helperText={
                  PasswordError[error?.code] || (touched.password && errors.password) || ' '
                }
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="dense"
                fullWidth
                name="usage"
                label="Primary use of the US Social Progress Map™?"
                id="usage"
                value={values.usage}
                onChange={handleChange}
                error={touched.usage && !!errors.usage}
                helperText={(touched.usage && errors.usage) || ' '}
                required
                select
              >
                <MenuItem value={'policymaking'}>Policymaking</MenuItem>
                <MenuItem value={'resource_allocation'}>Resource allocation</MenuItem>
                <MenuItem value={'investments'}>Investments</MenuItem>
                <MenuItem value={'Advocacy'}>Advocacy</MenuItem>
                <MenuItem value={'academic_research'}>Academic research</MenuItem>
                <MenuItem value={'personal_research'}>Personal research</MenuItem>
                <MenuItem value={'csr_esg_strategy'}>CSR or ESG strategy</MenuItem>
                <MenuItem value={'other'}>Other</MenuItem>
              </TextField>
              <Button onClick={handleSubmit} fullWidth variant="contained" sx={{ mt: '8px' }}>
                Sign Up
              </Button>
              <FormHelperText error>
                {!!error?.code && !PasswordError[error?.code] && !EmailError[error?.code]
                  ? 'An unexpected error occurred. Please try again later.'
                  : ' '}
              </FormHelperText>
            </>
          )}
        </Formik>
        <Grid container>
          <Grid item>
            <Link href="#" variant="body2" onClick={handleShowLoginForm}>
              {'Back to login'}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
