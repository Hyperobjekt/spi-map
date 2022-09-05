import React from 'react';
import { styled } from '@mui/system';
import { AlaskaIcon, HawaiiIcon, USIcon } from '../../assets/icons';
import FlyToBtn from './FlyToBtn';

const Root = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '194px',
  right: '18px',
  width: '29px',
  height: 'auto',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    gap: '10px',
  },
}));

const MoreControls = () => {
  return (
    <Root className="more-controls">
      <FlyToBtn fips="02" placement={'left'}>
        <AlaskaIcon />
      </FlyToBtn>
      <FlyToBtn fips="15" placement={'left'}>
        <HawaiiIcon />
      </FlyToBtn>
      <FlyToBtn fips="us" placement={'left'}>
        <USIcon />
      </FlyToBtn>
    </Root>
  );
};

export default MoreControls;
