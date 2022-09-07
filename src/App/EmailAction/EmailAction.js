import { Container, CssBaseline } from '@mui/material';
import { Modal } from 'App/Modal';
import { auth } from '../firebase';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';

const EmailAction = ({ mode, oobCode, continueUrl = '/', lang = 'en' }) => {
  const Component = {
    resetPassword: ResetPassword,
    verifyEmail: VerifyEmail,
  }[mode];

  return (
    <Modal isOpen={!!mode}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Component auth={auth} continueUrl={continueUrl} oobCode={oobCode} lang={lang} />
      </Container>
    </Modal>
  );
};

export default EmailAction;
