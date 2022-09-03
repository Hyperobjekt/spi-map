import styled from '@emotion/styled';
import {
  Backdrop,
  Container as MUIContainer,
  CssBaseline,
  Fade,
  Modal,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Box } from '@mui/system';
import { Boxmodal, Content, Container } from 'App/IntroModal/IntroModal.styles';
import { animated, useSpring } from 'react-spring';
import { auth } from '../firebase';
import RecoverEmail from './RecoverEmail';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';

const EmailAction = ({ mode, oobCode, continueUrl, lang = 'en' }) => {
  // Handles backdropFilter only. Fade is handled by child of modal
  // see: https://mui.com/material-ui/react-modal/#transitions
  const styles = useSpring({ backdropFilter: `blur(${true ? 5 : 0}px)` });
  const AnimatedModal = animated(Modal);

  if (!mode) return null;

  const Component = {
    resetPassword: ResetPassword,
    recoverEmail: RecoverEmail,
    verifyEmail: VerifyEmail,
  }[mode];

  return (
    <AnimatedModal
      open={true}
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
      <Fade in={true}>
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
              {/* <Box>
                <Description id="intro-modal-description">
                  This map presents Social Progress Index data, including dozens of indicators and
                  demographics, for the 50 US states and 500 cities.{' '}
                  {stage === STAGE.JUMP_TO
                    ? 'Click a view below to get started.'
                    : 'Login or create an account below to get started.'}
                </Description>
              </Box> */}
            </Boxmodal>
            <div>
              <MUIContainer component="main" maxWidth="xs">
                <CssBaseline />
                <Component auth={auth} continueUrl={continueUrl} oobCode={oobCode} lang={lang} />
              </MUIContainer>
            </div>
          </Content>
        </Container>
      </Fade>
    </AnimatedModal>
  );
};

export default EmailAction;
