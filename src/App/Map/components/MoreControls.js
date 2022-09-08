import React from 'react';
import { styled } from '@mui/system';
import { AlaskaIcon, HawaiiIcon, USIcon } from '../../assets/icons';
import FlyToBtn from './FlyToBtn';

const Root = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '156px',
  right: '18px',
  width: '29px',
  height: 'auto',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  borderRadius: '4px',
  boxShadow: '0 0 0 2px #0000001a',
  backgroundColor: '#fff',
  '& > button + button': {
    borderTop: '1px solid #ddd',
  },
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const MoreControls = () => {
  return (
    <Root className="more-controls">
      <FlyToBtn fips="02" position="first">
        <AlaskaIcon />
      </FlyToBtn>
      <FlyToBtn fips="15">
        <HawaiiIcon />
      </FlyToBtn>
      <FlyToBtn fips="us" position="last">
        <USIcon />
      </FlyToBtn>
    </Root>
  );
};

export default MoreControls;
