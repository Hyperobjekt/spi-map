import styled from '@emotion/styled';
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
import {
  useAuthConfirmPasswordReset,
  useAuthSendPasswordResetEmail,
  useAuthVerifyPasswordResetCode,
} from '@react-query-firebase/auth';
import { history } from 'App/history';
import { STAGE, useIntroModalStore } from 'App/IntroModal';
import { FormError, PasswordError } from 'App/IntroModal/utils';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import shallow from 'zustand/shallow';

const Header = styled(Typography)({
  textAlign: 'center',
  marginBottom: 8,
});

const UpdatePasswordFormSchema = yup.object({
  password: yup
    .string('Enter your new password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const UpdatePasswordForm = ({ auth, oobCode, continueUrl, lang, handleShowLoginForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: confirmPasswordReset, error, isSuccess } = useAuthConfirmPasswordReset(auth);

  const handleClickShowPassword = () => {
    setShowPassword((x) => !x);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {!isSuccess ? (
        <Formik
          initialValues={{
            password: '',
          }}
          onSubmit={({ password: newPassword }, { setSubmitting, setFieldError, setStatus }) =>
            confirmPasswordReset({ oobCode, newPassword })
          }
          validationSchema={UpdatePasswordFormSchema}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => (
            <>
              <TextField
                margin="dense"
                fullWidth
                name="password"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
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
                Reset Password
              </Button>
              <FormHelperText error>
                {!!error?.code ? FormError[error?.code] || FormError['*'] : ' '}
              </FormHelperText>
            </>
          )}
        </Formik>
      ) : (
        <Typography>Your password has been updated</Typography>
      )}
      <Link href="#" variant="body2" onClick={handleShowLoginForm}>
        Back to login
      </Link>
    </>
  );
};

const ResetPassword = ({ auth, oobCode, continueUrl, lang }) => {
  const [setIntroModalOpen, setIntroModalStage] = useIntroModalStore(
    (state) => [state.setOpen, state.setStage],
    shallow,
  );
  const [componentKey, setComponentKey] = useState();

  const { mutate: verifyPasswordResetCode } = useAuthVerifyPasswordResetCode(auth);
  const { mutate: sendPasswordResetEmail } = useAuthSendPasswordResetEmail(auth);

  const handleShowLoginForm = () => {
    setIntroModalOpen(true);
    setIntroModalStage(STAGE.LOGIN);
  };

  const Component = {
    SUCCESS: () => (
      <>
        <Header component="h1" variant="h5">
          Reset Password
        </Header>
        <UpdatePasswordForm
          auth={auth}
          oobCode={oobCode}
          continueUrl={continueUrl}
          lang={lang}
          handleShowLoginForm={handleShowLoginForm}
        />
      </>
    ),
    ERROR_LOGGED_OUT: () => (
      <>
        <Header component="h1" variant="h5">
          Unable to reset password
        </Header>
        <Typography component="p">
          Code is invalid or expired. Please sign in again to resend reset password email.
        </Typography>
        <Link href="#" variant="body2" onClick={handleShowLoginForm}>
          Back to login
        </Link>
      </>
    ),
    ERROR_LOGGED_IN: () => (
      <>
        <Header component="h1" variant="h5">
          Unable to validate email
        </Header>
        <Typography component="p">Code is invalid or expired.</Typography>
        <Button
          onClick={() => sendPasswordResetEmail({ email: auth.currentUser.email })}
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
        >
          Resend Password Reset Email
        </Button>
        <Link href="#" variant="body2" onClick={() => window.location.reload()}>
          Back to login
        </Link>
      </>
    ),
  }[componentKey];

  useEffect(() => {
    if (oobCode) {
      verifyPasswordResetCode(oobCode, {
        onSuccess: () => {
          setComponentKey('SUCCESS');
        },
        onError: (error, variables, context) => {
          setComponentKey(`ERROR_LOGGED_${!!auth.currentUser ? 'IN' : 'OUT'}`);
        },
      });
    }
  }, [oobCode, verifyPasswordResetCode, auth.currentUser]);

  if (!Component) return null;

  return <Component />;
};

export default ResetPassword;
