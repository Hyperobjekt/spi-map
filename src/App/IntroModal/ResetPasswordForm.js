import { Button, FormHelperText, Link, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useAuthSendPasswordResetEmail } from '@react-query-firebase/auth';
import { auth } from 'App/firebase';
import { Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import { EmailError, PasswordError } from './utils';

const ResetPasswordFormSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
});

const ResetPasswordForm = ({ handleShowLoginForm }) => {
  const [submittedEmail, setSubmittedEmail] = useState();
  const { mutate: resetPassword, error } = useAuthSendPasswordResetEmail(auth, {
    onSuccess: (data, { email }) => {
      setSubmittedEmail(email);
    },
  });

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
        Reset Password
      </Typography>
      <Box sx={{ mt: 1 }}>
        {!submittedEmail ? (
          <Formik
            initialValues={{
              email: '',
            }}
            onSubmit={({ email }, { setSubmitting, setFieldError, setStatus }) =>
              resetPassword({
                email,
              })
            }
            validationSchema={ResetPasswordFormSchema}
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
                <Button onClick={handleSubmit} fullWidth variant="contained" sx={{ mt: '8px' }}>
                  Reset Password
                </Button>
                <FormHelperText error>
                  {!!error?.code && !PasswordError[error?.code] && !EmailError[error?.code]
                    ? 'An unexpected error occurred. Please try again later.'
                    : ' '}
                </FormHelperText>
              </>
            )}
          </Formik>
        ) : (
          <>
            <Typography>An email has been sent to {submittedEmail}</Typography>
          </>
        )}
        <Link href="#" variant="body2" onClick={handleShowLoginForm}>
          Back to login
        </Link>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;