import { useMemo, useEffect } from 'react';
import { styled } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import {
  Modal,
  Box,
  Typography,
  Backdrop,
  CssBaseline,
  Container as MUIContainer,
} from '@mui/material';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { JumpTo } from './JumpTo';
import { Boxmodal, Container, Content, Description } from './IntroModal.styles';
import Fade from './Fade';
import { useSpring, animated } from 'react-spring';
import useIntroModalStore from './store';
import shallow from 'zustand/shallow';
import { STAGE } from './constants';
import { useAuthUser } from '@react-query-firebase/auth';
import { auth } from 'App/firebase';
import ResetPasswordForm from './ResetPasswordForm';

const IntroModal = () => {
  const [isOpen, setIsOpen, stage, setStage] = useIntroModalStore(
    (state) => [state.open, state.setOpen, state.stage, state.setStage],
    shallow,
  );

  const Component = useMemo(
    () =>
      ({
        LOGIN: () => (
          <LoginForm
            onLogin={() => setIsOpen(false)}
            handleShowRegistrationForm={() => setStage(STAGE.REGISTRATION)}
            handleShowResetPasswordForm={() => setStage(STAGE.RESET_PASSWORD)}
          />
        ),
        RESET_PASSWORD: () => (
          <ResetPasswordForm handleShowLoginForm={() => setStage(STAGE.LOGIN)} />
        ),
        REGISTRATION: () => (
          <RegistrationForm
            onRegister={() => setStage(STAGE.JUMP_TO)}
            handleShowLoginForm={() => setStage(STAGE.LOGIN)}
          />
        ),
        JUMP_TO: () => <JumpTo onJumpTo={() => setIsOpen(false)} />,
      }[stage]),
    [stage, setIsOpen, setStage],
  );

  const { data: user, isLoading } = useAuthUser(['user'], auth);

  const isSignedIn = !!user;

  useEffect(() => {
    // Only used for UI to decide whether or not to show
    // the Intro Modal immediately on startup.
    // If the auth request returns invalid, the modal will open regardless
    localStorage.setItem('SIGNED_IN', isSignedIn);

    if (!isSignedIn && !isLoading) {
      setStage(STAGE.LOGIN);
      setIsOpen(true);
    }
  }, [isSignedIn, isLoading, setStage, setIsOpen]);

  // Handles backdropFilter only. Fade is handled by child of modal
  // see: https://mui.com/material-ui/react-modal/#transitions
  const styles = useSpring({ backdropFilter: `blur(${isOpen ? 5 : 0}px)` });
  const AnimatedModal = animated(Modal);

  return (
    <AnimatedModal
      open={isOpen}
      aria-labelledby="intro-modal-title"
      aria-describedby="intro-modal-description"
      style={{
        display: 'flex',
        flexDirection: 'row',
        ...styles,
      }}
      BackdropComponent={styled(Backdrop)({
        backgroundColor: 'transparent',
      })}
    >
      <Fade in={isOpen}>
        <Container>
          <Content>
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
                <img
                  src="/assets/img/spi-logo.png"
                  alt="Social Progress Imperative logo"
                  width="120"
                />
                <Typography id="login-modal-title" style={visuallyHidden}>
                  Social Progress Imperative
                </Typography>
              </Box>
              <Box>
                <Description id="intro-modal-description">
                  This map presents Social Progress Index data, including dozens of indicators and
                  demographics, for the 50 US states and 500 cities.{' '}
                  {stage === STAGE.JUMP_TO
                    ? 'Click a view below to get started.'
                    : 'Login or create an account below to get started.'}
                </Description>
              </Box>
            </Boxmodal>
            <div>
              <MUIContainer component="main" maxWidth="xs">
                <CssBaseline />
                <Component />
              </MUIContainer>
            </div>
          </Content>
        </Container>
      </Fade>
    </AnimatedModal>
  );
};

export default IntroModal;
