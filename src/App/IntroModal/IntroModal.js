import { useMemo, useEffect } from 'react';
import { visuallyHidden } from '@mui/utils';
import { Box, Typography, CssBaseline, Container as MUIContainer } from '@mui/material';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { Boxmodal, Description } from './IntroModal.styles';
import useIntroModalStore from './store';
import shallow from 'zustand/shallow';
import { STAGE } from './constants';
import ResetPasswordForm from './ResetPasswordForm';
import { Modal } from 'App/Modal';
import { useJumpToModalStore } from './JumpToModal';
import { useAuthUser } from 'App/firebase';

const IntroModal = () => {
  const [open, setOpen, stage, setStage] = useIntroModalStore(
    (state) => [state.open, state.setOpen, state.stage, state.setStage],
    shallow,
  );

  const setJumpToModalOpen = useJumpToModalStore((state) => state.setOpen);

  const { data: user, isLoading } = useAuthUser();

  const isSignedIn = !!user;

  useEffect(() => {
    // Only used for UI to decide whether or not to show
    // the Intro Modal immediately on startup.
    // If the auth request returns invalid, the modal will open regardless
    localStorage.setItem('SIGNED_IN', !!isSignedIn);

    if (!isSignedIn && !isLoading) {
      setStage(STAGE.LOGIN);
      setOpen(true);
    }
  }, [isSignedIn, isLoading, setStage, setOpen]);

  const { Header, Content } = useMemo(
    () =>
      ({
        LOGIN: {
          Header: () => 'Sign In',
          Content: () => (
            <LoginForm
              onLogin={() => setOpen(false)}
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
          Content: () =>
            `Verification email sent to ${user.email}. Please check your email and follow the instructions.`,
        },
      }[stage]),
    [stage, setOpen, setStage, setJumpToModalOpen, user?.email],
  );

  return (
    <Modal>
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
        <div>
          <MUIContainer component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 2,
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
        </div>
      </>
    </Modal>
  );
};

export default IntroModal;
