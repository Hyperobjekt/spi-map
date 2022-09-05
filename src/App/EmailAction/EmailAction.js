import { Container, CssBaseline } from '@mui/material';
import { Boxmodal } from 'App/IntroModal/IntroModal.styles';
import { Modal } from 'App/Modal';
import useModalStore from 'App/Modal/store';
import { useEffect } from 'react';
import { auth } from '../firebase';
import RecoverEmail from './RecoverEmail';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';

const EmailAction = ({ mode, oobCode, continueUrl, lang = 'en' }) => {
  const setOpen = useModalStore((state) => state.setOpen);

  useEffect(() => {
    if (mode) {
      setOpen(true);
    }
  }, [mode, setOpen]);

  if (!mode) return null;

  const Component = {
    resetPassword: ResetPassword,
    recoverEmail: RecoverEmail,
    verifyEmail: VerifyEmail,
  }[mode];

  return (
    <Modal>
      <Boxmodal
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Component auth={auth} continueUrl={continueUrl} oobCode={oobCode} lang={lang} />
        </Container>
      </Boxmodal>
    </Modal>
  );
};

export default EmailAction;
