import { styled } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import { Modal, Box, Button, Typography, Backdrop } from '@mui/material';
import shallow from 'zustand/shallow';
import { useDashboardStore } from '@hyperobjekt/react-dashboard';
import useIntroModalStore from './store';
import { Container, Content, Description, Label } from './IntroModal.styles';

const IntroModal = ({ ...props }) => {
  const [introModalOpen, setIntroModalOpen] = useIntroModalStore(
    (state) => [state.open, state.setOpen],
    shallow,
  );
  const setRegion = useDashboardStore((state) => state.setRegion);
  const setAutoSwitchRegion = useDashboardStore((state) => state.setAutoSwitchRegion);

  const handleClose = (e) => {
    setIntroModalOpen(false);
  };

  const handleViewStates = (e) => {
    setIntroModalOpen(false);
  };

  const handleViewCities = (e) => {
    setAutoSwitchRegion(false);
    setRegion('cities');
    setIntroModalOpen(false);
  };

  const handleViewTracts = (e) => {
    setRegion('tracts');
    setIntroModalOpen(false);
  };

  return (
    <Modal
      open={introModalOpen}
      onClose={handleClose}
      aria-labelledby="intro-modal-title"
      aria-describedby="intro-modal-description"
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
          <Box
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
              <Typography id="intro-modal-title" style={visuallyHidden}>
                Social Progress Imperative
              </Typography>
            </Box>
            <Box>
              <Description id="intro-modal-description">
                This map presents Social Progress Index data, including dozens of indicators and
                demographics, for the 50 US states and 500 cities. Click a view below to get
                started.
              </Description>
            </Box>
          </Box>

          <Box
            sx={{
              width: '50%',
              mt: 3,
              mx: 'auto',
            }}
          >
            <Label>View data for 50 U.S. states</Label>
            <Button
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              onClick={handleViewStates}
            >
              Go to states view
            </Button>

            <Label>View data for 500 U.S. cities</Label>
            <Button
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              onClick={handleViewCities}
            >
              Go to cities view
            </Button>

            <Label>View data for Census tracts</Label>
            <Button
              disabled
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              onClick={handleViewTracts}
            >
              Coming soon!
            </Button>
          </Box>
        </Content>
      </Container>
    </Modal>
  );
};

export default IntroModal;
