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
import { getAuth } from 'firebase/auth';
import { Formik } from 'formik';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import * as yup from 'yup';
import { EmailError, PasswordError } from './utils';

const LoginFormSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup.string('Enter your password').required('Password is required'),
});

const LoginForm = ({ setShowRegistrationForm }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(
    getAuth(),
  );

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
          onSubmit={(values, { setSubmitting, setFieldError, setStatus }) =>
            signInWithEmailAndPassword(values.email, values.password)
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
            <Link href="#" variant="body2" onClick={() => setShowRegistrationForm(true)}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginForm;
