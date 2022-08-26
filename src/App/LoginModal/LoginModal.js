import { styled } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import { Modal, Box, Typography, Backdrop } from '@mui/material';
import { SignInScreen } from '../SignInScreen';
import { Boxmodal, Container, Content } from './LoginModal.styles';

const LoginModal = ({ ...props }) => {
  return (
    <Modal
      open
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        backdropFilter: 'blur(5px)',
      }}
      BackdropComponent={styled(Backdrop)({
        backgroundColor: 'transparent',
      })}
    >
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
          </Boxmodal>
          <SignInScreen />
        </Content>
      </Container>
    </Modal>
  );
};

export default LoginModal;
