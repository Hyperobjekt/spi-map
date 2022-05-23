import { styled, AppBar, Toolbar, Box, Button, Typography } from '@mui/material';
import { ArrowBack, Search } from '@mui/icons-material';
import { animated, useSpring } from '@react-spring/web';
import React from 'react';
import shallow from 'zustand/shallow';
import useActiveView from '../hooks/useActiveView';
import { useSearchStore } from '../Search';

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  background: #fff;
  height: 100%;
  position: absolute;
  top: 0;
  left: 24px;
`;

const BackButtonWrapper = animated(StyledBox);

export const Header = () => {
  const [activeView, setActiveView] = useActiveView();
  const [setModalOpened] = useSearchStore((state) => [state.setModalOpened], shallow);

  const buttonSpringProps = useSpring({
    y: activeView === 'map' ? -80 : 0,
    delay: activeView === 'map' ? 400 : 0,
  });

  const handleBackToMap = () => {
    setActiveView('map');
  };

  const handleShowSearch = () => {
    setModalOpened(true);
  };

  return (
    <AppBar color="transparent" sx={{ bgcolor: 'background.paper' }} position="sticky">
      <Toolbar>
        <img
          src="/assets/img/spi-logo.png"
          alt="SPI"
          height="40"
          sx={{ marginRight: 'auto', height: 40 }}
        />
        <BackButtonWrapper style={buttonSpringProps}>
          <Button onClick={handleBackToMap}>
            <ArrowBack sx={{ fontSize: 24, mt: '-3px', mr: 1 }} />
            <Typography variant="h4">Back To Map</Typography>
          </Button>
        </BackButtonWrapper>
        <Box display="flex" gap={1} ml="auto" pl={1}>
          <Button variant="outlined" onClick={handleShowSearch}>
            <Search sx={{ mr: 1 }} />
            <Typography>Find a Place</Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
