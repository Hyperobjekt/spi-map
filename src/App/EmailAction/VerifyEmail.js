import { Button, Grid, Link, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useAuthApplyActionCode, useAuthSendEmailVerification } from '@react-query-firebase/auth';
import { useJumpToModalStore } from 'App/IntroModal/JumpToModal';
import { useEffect, useState } from 'react';

const Header = styled(Typography)({
  textAlign: 'center',
  marginBottom: 8,
});

const VerifyEmail = ({ auth, oobCode, continueUrl, lang }) => {
  const setOpen = useJumpToModalStore((state) => state.setOpen);

  const [componentKey, setComponentKey] = useState();
  const { mutate: applyActionCode } = useAuthApplyActionCode(auth);
  const { mutate: sendVerificationEmail } = useAuthSendEmailVerification();

  // const { email } = Object.fromEntries(new URLSearchParams(continueUrl));

  const Component = {
    SUCCESS: () => (
      <>
        <Header component="h1" variant="h5">
          Successfully validated email
        </Header>
        <Typography component="p">Email has been successfully validated!</Typography>
        <Button onClick={() => setOpen(true)} fullWidth variant="contained" sx={{ mt: '8px' }}>
          Continue to Application
        </Button>
      </>
    ),
    ERROR_LOGGED_OUT: () => (
      <>
        <Header component="h1" variant="h5">
          Unable to validate email
        </Header>
        <Typography component="p">
          Code is invalid or expired. Please sign in again to resend validation email.
        </Typography>
        <Grid container>
          <Grid item>
            <Link href="#" variant="body2" onClick={() => window.location.reload()}>
              Back to login
            </Link>
          </Grid>
        </Grid>
      </>
    ),
    ERROR_LOGGED_IN: () => (
      <>
        <Header component="h1" variant="h5">
          Unable to validate email
        </Header>
        <Typography component="p">Code is invalid or expired.</Typography>{' '}
        <Button
          onClick={() => sendVerificationEmail({ user: auth.currentUser })}
          fullWidth
          variant="contained"
          sx={{ mt: '8px' }}
        >
          Resend Validation Email
        </Button>
      </>
    ),
  }[componentKey];

  useEffect(() => {
    if (oobCode) {
      applyActionCode(oobCode, {
        onSuccess: () => {
          setComponentKey('SUCCESS');
        },
        onError: (error, variables, context) => {
          if (auth.currentUser) {
            sendVerificationEmail({ user: auth.currentUser });
            setComponentKey('ERROR_LOGGED_IN');
          } else {
            setComponentKey('ERROR_LOGGED_OUT');
          }
        },
      });
    }
  }, [oobCode, applyActionCode, sendVerificationEmail, auth.currentUser]);

  if (!Component) return null;

  return <Component />;
};

export default VerifyEmail;
