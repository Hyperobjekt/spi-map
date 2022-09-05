import { styled } from '@mui/system';
import { Modal as MUIModal, Backdrop } from '@mui/material';
import { Container, Content } from './Modal.styles';
import Fade from './Fade';
import { useSpring, animated } from 'react-spring';
import useModalStore from './store';
import shallow from 'zustand/shallow';

const Modal = ({ children, ...props }) => {
  const [isOpen = false] = useModalStore((state) => [state.open], shallow);

  // Handles backdropFilter only. Fade is handled by child of modal
  // see: https://mui.com/material-ui/react-modal/#transitions
  const styles = useSpring({ backdropFilter: `blur(${isOpen ? 5 : 0}px)` });
  const AnimatedModal = animated(MUIModal);

  return (
    <AnimatedModal
      open={isOpen}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{
        display: 'flex',
        flexDirection: 'row',
        ...styles,
      }}
      BackdropComponent={styled(Backdrop)({
        backgroundColor: 'transparent',
      })}
      {...props}
    >
      <Fade in={isOpen}>
        <Container>
          <Content>{children}</Content>
        </Container>
      </Fade>
    </AnimatedModal>
  );
};

export default Modal;
