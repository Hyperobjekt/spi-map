import { styled } from '@mui/system';
import { Tooltip, Button } from '@mui/material';
import { useMapStore } from '@hyperobjekt/mapgl';
import React from 'react';
import PropTypes from 'prop-types';
import { FIPS_TO_STATE_NAME } from '../../utils';
import { boundsToFly, US_BOUNDS } from '../../shared/constants';

const ButtonStyle = styled(Button)({
  width: '29px',
  height: '29px',
  backgroundColor: '#fff',
  padding: 0,
  minWidth: 0,
  borderRadius: '4px',
  boxShadow: '0 0 0 2px #0000001a',
  '& svg': {
    width: '20px',
    height: '20px',
  },
});

const FlyToBtn = ({ children, ...props }) => {
  const [flyTo, flyToBounds] = useMapStore((state) => [state.flyTo, state.flyToBounds]);

  const handleClick = () => {
    if (props.fips === 'us') {
      flyToBounds(US_BOUNDS);
    } else {
      if (boundsToFly[props.fips]) {
        flyTo(boundsToFly[props.fips]);
      }
    }
  };

  return (
    <Tooltip title={`Fly to ${FIPS_TO_STATE_NAME[props.fips]}`} placement={props.placement} arrow>
      <ButtonStyle aria-label={FIPS_TO_STATE_NAME[props.fips]} onClick={handleClick}>
        {children}
      </ButtonStyle>
    </Tooltip>
  );
};

FlyToBtn.propTypes = {
  fips: PropTypes.string,
};

export default FlyToBtn;
