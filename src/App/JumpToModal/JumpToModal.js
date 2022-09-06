import { Box, Button, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useDashboardStore } from '@hyperobjekt/react-dashboard';
import { Boxmodal, Buttoncontainer, Description, Label } from './JumpTo.styles';
import { Modal } from 'App/Modal';
import useJumpToModalStore from './store';

const JumpToModal = () => {
  const open = useJumpToModalStore((state) => state.open);
  const setOpen = useJumpToModalStore((state) => state.setOpen);
  const setRegion = useDashboardStore((state) => state.setRegion);
  const setAutoSwitchRegion = useDashboardStore((state) => state.setAutoSwitchRegion);

  const handleViewStates = (e) => {
    setRegion('states');
    setOpen(false);
  };

  const handleViewCities = (e) => {
    setAutoSwitchRegion(false);
    setRegion('cities');
    setOpen(false);
  };

  const handleViewTracts = (e) => {
    setRegion('tracts');
    setOpen(false);
  };

  return (
    <Modal isOpen={open}>
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
          fullWidth
          size="large"
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
          size="large"
          variant="contained"
          color="primary"
          onClick={handleViewTracts}
        >
          Coming soon!
        </Button>
      </Buttoncontainer>
    </Modal>
  );
};

export default JumpToModal;
