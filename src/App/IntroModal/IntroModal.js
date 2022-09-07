import { useMemo, useEffect } from 'react';
import { visuallyHidden } from '@mui/utils';
import { Box, Typography, CssBaseline, Container as MUIContainer, Button } from '@mui/material';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { Boxmodal, Description } from './IntroModal.styles';
import useIntroModalStore from './store';
import shallow from 'zustand/shallow';
import { STAGE } from './constants';
import ResetPasswordForm from './ResetPasswordForm';
import { Modal } from 'App/Modal';
import { auth, useAuthUser } from 'App/firebase';
import EmailVerificationSent from './EmailVerificationSent';
import { useAuthGetRedirectResult } from '@react-query-firebase/auth';

const IntroModal = () => {
  const [open, setOpen, stage, setStage] = useIntroModalStore(
    (state) => [state.open, state.setOpen, state.stage, state.setStage],
    shallow,
  );

  const { data: user, isLoading } = useAuthUser();
  const { data: redirectedUser, isLoading: isLoadingRedirect } = useAuthGetRedirectResult(
    'redirect-result',
    auth,
  );

  const isSignedIn = !!user;

  useEffect(() => {
    // Only used for UI to decide whether or not to show
    // the Intro Modal immediately on startup.
    // If the auth request returns invalid, the modal will open regardless
    debugger;
    localStorage.setItem(
      'SIGNED_IN',
      JSON.parse(localStorage.getItem('SIGNED_IN')) === false && !!isSignedIn,
    );

    if (!isSignedIn && !isLoading && !isLoadingRedirect) {
      setStage(STAGE.LOGIN);
      setOpen(true);
    }

    if (isSignedIn && !user.emailVerified) {
      setStage(STAGE.EMAIL_VERIFICATION_SENT);
      setOpen(true);
    }
  }, [isSignedIn, isLoading, setStage, setOpen, user?.emailVerified]);

  const { Header, Content } = useMemo(
    () =>
      ({
        LOGIN: {
          Header: () => 'Sign In',
          Content: () => (
            <LoginForm
              onLogin={({ user }) => {
                if (user.emailVerified) {
                  setOpen(false);
                } else {
                  setStage(STAGE.EMAIL_VERIFICATION_SENT);
                }
              }}
              handleShowRegistrationForm={() => setStage(STAGE.REGISTRATION)}
              handleShowResetPasswordForm={() => setStage(STAGE.RESET_PASSWORD)}
            />
          ),
        },
        RESET_PASSWORD: {
          Header: () => 'Reset Password',
          Content: () => <ResetPasswordForm handleShowLoginForm={() => setStage(STAGE.LOGIN)} />,
        },
        REGISTRATION: {
          Header: () => 'Sign Up',
          Content: () => (
            <RegistrationForm
              onRegister={(user) => setStage(STAGE.EMAIL_VERIFICATION_SENT)}
              handleShowLoginForm={() => setStage(STAGE.LOGIN)}
            />
          ),
        },
        EMAIL_VERIFICATION_SENT: {
          Header: () => 'Email Verification Sent',
          Content: () => <EmailVerificationSent email={user.email} />,
        },
      }[stage]),
    [stage, setOpen, setStage, user?.email],
  );

  return (
    <Modal isOpen={open}>
      <>
        <Boxmodal
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            sx={{
              mt: 0.75,
              mr: 3,
            }}
          >
            <img src="/assets/img/spi-logo.png" alt="Social Progress Imperative logo" width="120" />
            <Typography id="login-modal-title" style={visuallyHidden}>
              Social Progress Imperative
            </Typography>
          </Box>
          <Box>
            <Description id="intro-modal-description">
              This map presents Social Progress Index data, including dozens of indicators and
              demographics, for the 50 US states and 500 cities.
            </Description>
          </Box>
        </Boxmodal>
        <MUIContainer component="main" maxWidth="xs" sx={{ mt: 2 }}>
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              <Header />
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Content />
            </Box>
          </Box>
        </MUIContainer>
      </>
    </Modal>
  );
};

export default IntroModal;
