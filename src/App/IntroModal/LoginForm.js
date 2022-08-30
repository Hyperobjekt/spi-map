import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useAuthSignInWithEmailAndPassword } from '@react-query-firebase/auth';
import { auth } from 'App/firebase';
import { Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import { EmailError, PasswordError } from './utils';

const LoginFormSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup.string('Enter your password').required('Password is required'),
});

const LoginForm = ({ handleShowRegistrationForm, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: signIn, error } = useAuthSignInWithEmailAndPassword(auth, {
    onSuccess: (user) => {
      onLogin(user);
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
        Sign In
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={({ email, password }, { setSubmitting, setFieldError, setStatus }) =>
            signIn({ email, password })
          }
          validationSchema={LoginFormSchema}
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
              <Button onClick={handleSubmit} fullWidth variant="contained" sx={{ mt: '8px' }}>
                Sign In
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
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" onClick={handleShowRegistrationForm}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginForm;
