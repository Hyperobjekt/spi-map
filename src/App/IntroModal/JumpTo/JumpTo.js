import { Button } from '@mui/material';
import { useDashboardStore } from '@hyperobjekt/react-dashboard';
import { Buttoncontainer, Label } from './JumpTo.styles';

const JumpTo = ({ onJumpTo = () => {} }) => {
  const setRegion = useDashboardStore((state) => state.setRegion);
  const setAutoSwitchRegion = useDashboardStore((state) => state.setAutoSwitchRegion);

  const handleViewStates = (e) => {
    setRegion('states');
    onJumpTo();
  };

  const handleViewCities = (e) => {
    setAutoSwitchRegion(false);
    setRegion('cities');
    onJumpTo();
  };

  const handleViewTracts = (e) => {
    setRegion('tracts');
    onJumpTo();
  };

  return (
    <Buttoncontainer
      sx={{
        width: '50%',
        mt: 3,
        mx: 'auto',
      }}
    >
      <Label>View data for 50 U.S. states</Label>
      <Button fullWidth size="large" variant="contained" color="primary" onClick={handleViewStates}>
        Go to states view
      </Button>

      <Label>View data for 500 U.S. cities</Label>
      <Button fullWidth size="large" variant="contained" color="primary" onClick={handleViewCities}>
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
  );
};

export default JumpTo;
