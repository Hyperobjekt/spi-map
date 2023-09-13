import { styled } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import { Modal, Box, Button, Typography, Backdrop } from '@mui/material';
import shallow from 'zustand/shallow';
import { useDashboardStore } from '@hyperobjekt/react-dashboard';
import useIntroModalStore from './store';
import {
  Boxmodal,
  Container,
  Content,
  Description,
  Buttoncontainer,
  Label,
} from './IntroModal.styles';
import useAppStore from 'App/store';

const IntroModal = ({ ...props }) => {
  const [introModalOpen, setIntroModalOpen] = useIntroModalStore(
    (state) => [state.open, state.setOpen],
    shallow,
  );
  const setRegion = useDashboardStore((state) => state.setRegion);
  const role = useAppStore((state) => state.role);
  const setAutoSwitchRegion = useDashboardStore((state) => state.setAutoSwitchRegion);

  const handleClose = (e) => {
    setIntroModalOpen(false);
    storeFirstVisit();
  };

  const handleViewStates = (e) => {
    setIntroModalOpen(false);
    storeFirstVisit();
  };

  const handleViewCities = (e) => {
    setAutoSwitchRegion(false);
    setRegion('cities');
    setIntroModalOpen(false);
    storeFirstVisit();
  };

  const handleViewTracts = (e) => {
    setAutoSwitchRegion(false);
    setRegion('tracts');
    setIntroModalOpen(false);
    storeFirstVisit();
  };

  const storeFirstVisit = () => {
    const firstVisit = localStorage.getItem('spi.firstVisit');
    if (!firstVisit) {
      localStorage.setItem('spi.firstVisit', new Date());
    }
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
          </Boxmodal>

          <Buttoncontainer
            sx={{
              width: '50%',
              mt: 3,
              mx: 'auto',
            }}
          >
            <Label>View data for 50 U.S. states</Label>
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              onClick={handleViewStates}
            >
              Go to states view
            </Button>

            <Label>View data for 500 U.S. cities</Label>
            <Button
              disabled={role === 'Basic'}
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              onClick={handleViewCities}
            >
              {role !== 'Basic' ? 'Go to cities view' : 'Contact us for access'}
            </Button>

            <>
              <Label>NEW: View data for Census tracts</Label>
              <Button
                disabled={role !== 'Premium Plus'}
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                onClick={handleViewTracts}
              >
                {role === 'Premium Plus' ? 'Go to census tracts view' : 'Contact us for access'}
              </Button>
            </>
          </Buttoncontainer>
        </Content>
      </Container>
    </Modal>
  );
};

export default IntroModal;
