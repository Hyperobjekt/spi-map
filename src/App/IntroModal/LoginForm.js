import { async } from '@firebase/util';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
} from '@mui/material';
import {
  useAuthSignInWithEmailAndPassword,
  useAuthSignInWithRedirect,
} from '@react-query-firebase/auth';
import Form from 'App/components/Form';
import { auth, provider } from 'App/firebase';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { EmailError, FormError, PasswordError } from './utils';

const LoginFormSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup.string('Enter your password').required('Password is required'),
});

const LoginForm = ({ handleShowRegistrationForm, handleShowResetPasswordForm, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: signIn, error: emailPasswordError } = useAuthSignInWithEmailAndPassword(auth, {
    onSuccess: async (user) => {
      onLogin(user);
    },
  });

  const { mutate: signInWithRedirect, error: googleError } = useAuthSignInWithRedirect(auth, {
    onMutate: () => {
      localStorage.setItem('SIGNED_IN', true);
    },
  });

  const error = emailPasswordError || googleError;

  const handleClickShowPassword = () => {
    setShowPassword((x) => !x);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
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
        <Form>
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
            helperText={PasswordError[error?.code] || (touched.password && errors.password) || ' '}
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
          <Button onClick={handleSubmit} fullWidth variant="contained" sx={{ mt: 1 }}>
            Sign In
          </Button>
          <Button
            onClick={() => signInWithRedirect({ provider })}
            fullWidth
            variant="outlined"
            sx={{
              mt: 1,
              display: 'inline-block',
              background: 'white',
              color: '#444',
              whiteSpace: 'nowrap',
            }}
          >
            <img
              src={'/assets/img/google-logo.svg'}
              style={{
                position: 'absolute',
                left: '0px',
                top: '-5px',
              }}
              alt="Google"
            />
            <span
              style={{
                paddingLeft: '42px',
                paddingRight: '42px',
              }}
            >
              Continue with Google
            </span>
          </Button>

          <FormHelperText error>
            {!!error?.code ? FormError[error?.code] || FormError['*'] : ' '}
          </FormHelperText>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" onClick={handleShowResetPasswordForm}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={handleShowRegistrationForm}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
