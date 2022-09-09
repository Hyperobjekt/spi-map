import { styled } from '@mui/system';
import { Tooltip, Button, useMediaQuery, useTheme } from '@mui/material';
import { useMapStore } from '@hyperobjekt/mapgl';
import React from 'react';
import PropTypes from 'prop-types';
import { FIPS_TO_STATE_NAME } from '../../utils';
import { boundsToFly, boundsToFlyOnMobile, US_BOUNDS } from '../../shared/constants';

const ButtonStyle = styled(Button)({
  width: '29px',
  height: '29px',
  backgroundColor: '#fff',
  padding: 0,
  minWidth: 0,
  '& svg': {
    width: '20px',
    height: '20px',
  },
});

const FlyToBtn = ({ children, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints['down']('sm'));
  const [flyTo, flyToBounds] = useMapStore((state) => [state.flyTo, state.flyToBounds]);

  const handleClick = () => {
    if (props.fips === 'us') {
      flyToBounds(US_BOUNDS);
    } else {
      if (boundsToFly[props.fips]) {
        flyTo(isMobile ? boundsToFlyOnMobile[props.fips] : boundsToFly[props.fips]);
      }
    }
  };

  const getBorderStyle = () => {
    let borderStyle = { borderRadius: 0 };
    if (props.position === 'first') {
      borderStyle = {
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      };
    }
    if (props.position === 'last') {
      borderStyle = {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px',
      };
    }
    return borderStyle;
  };

  return (
    <Tooltip
      title={`Zoom to ${props.fips === 'us' ? 'contiguous U.S.' : FIPS_TO_STATE_NAME[props.fips]}`}
      placement="left"
      arrow
    >
      <ButtonStyle
        aria-label={FIPS_TO_STATE_NAME[props.fips]}
        onClick={handleClick}
        style={{ ...getBorderStyle() }}
      >
        {children}
      </ButtonStyle>
    </Tooltip>
  );
};

FlyToBtn.propTypes = {
  fips: PropTypes.string,
};

export default FlyToBtn;
