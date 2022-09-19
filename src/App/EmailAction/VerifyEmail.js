import { Button, Grid, Link, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useAuthApplyActionCode, useAuthSendEmailVerification } from '@react-query-firebase/auth';
import { history } from 'App/history';
import { STAGE, useIntroModalStore } from 'App/IntroModal';
import { useJumpToModalStore } from 'App/JumpToModal';
import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';

const Header = styled(Typography)({
  textAlign: 'center',
  marginBottom: 8,
});

const VerifyEmail = ({ auth, oobCode, continueUrl, lang }) => {
  const [setIntroModalOpen, setIntroModalStage] = useIntroModalStore(
    (state) => [state.setOpen, state.setStage],
    shallow,
  );
  const setOpen = useJumpToModalStore((state) => state.setOpen);

  const [componentKey, setComponentKey] = useState();
  const { mutate: applyActionCode } = useAuthApplyActionCode(auth);
  const { mutate: sendVerificationEmail } = useAuthSendEmailVerification();

  const Component = {
    SUCCESS: () => (
      <>
        <Header component="h1" variant="h5">
          Successfully validated email
        </Header>
        <Typography
          component="p"
          sx={{
            mt: 2,
            mb: 1,
          }}
        >
          Email has been successfully validated!
        </Typography>
        <Button
          onClick={() => {
            history.push(continueUrl);
            setOpen(true);
          }}
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
        >
          Continue to Application
        </Button>
      </>
    ),
    ERROR_LOGGED_OUT: () => (
      <>
        <Header component="h1" variant="h5">
          Unable to validate email
        </Header>
        <Typography
          component="p"
          sx={{
            mt: 2,
            mb: 1,
          }}
        >
          Code is invalid or expired. Please sign in again to resend validation email.
        </Typography>
        <Link
          href="#"
          variant="body2"
          onClick={() => {
            setOpen(false);
            setIntroModalOpen(true);
            setIntroModalStage(STAGE.LOGIN);
          }}
        >
          Back to login
        </Link>
      </>
    ),
    ERROR_LOGGED_IN: () => (
      <>
        <Header component="h1" variant="h5">
          Unable to validate email
        </Header>
        <Typography
          component="p"
          sx={{
            mt: 2,
            mb: 1,
          }}
        >
          Code is invalid or expired.
        </Typography>{' '}
        <Button
          onClick={() => sendVerificationEmail({ user: auth.currentUser })}
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
        >
          Resend Validation Email
        </Button>
        <Link href="#" variant="body2" onClick={() => window.location.reload()}>
          Back to login
        </Link>
      </>
    ),
  }[componentKey];

  useEffect(() => {
    if (oobCode && auth.currentUser?.emailVerified !== true) {
      applyActionCode(oobCode, {
        onSuccess: () => {
          setComponentKey('SUCCESS');
        },
        onError: (error, variables, context) => {
          setComponentKey(`ERROR_LOGGED_${!!auth.currentUser ? 'IN' : 'OUT'}`);
        },
      });
    }
  }, [oobCode, applyActionCode, sendVerificationEmail, auth.currentUser]);

  if (!Component) return null;

  return <Component />;
};

export default VerifyEmail;
