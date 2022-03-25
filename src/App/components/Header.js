import React from "react";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import SearchInput from "./SearchInput";
import { ArrowBack } from "@mui/icons-material";
import useActiveView from "../hooks/useActiveView";
import { styled } from "@mui/material";
import { animated, useSpring } from "@react-spring/web";

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

  const buttonSpringProps = useSpring({
    y: activeView === "map" ? -80 : 0,
    delay: activeView === "map" ? 400 : 0,
  });

  const handleBackToMap = () => {
    setActiveView("map");
  };
  return (
    <AppBar
      color="transparent"
      sx={{ bgcolor: "background.paper" }}
      position="sticky"
    >
      <Toolbar>
        <img
          src="/assets/img/spi-logo.png"
          alt="SPI"
          height="40"
          sx={{ marginRight: "auto", height: 40 }}
        />
        <BackButtonWrapper style={buttonSpringProps}>
          <Button onClick={handleBackToMap}>
            <ArrowBack sx={{ fontSize: 24, mt: "-3px", mr: 1 }} />
            <Typography variant="h4">Back To Map</Typography>
          </Button>
        </BackButtonWrapper>

        <Box display="flex" gap={1} ml="auto" pl={1}>
          <SearchInput />
          {/* <Button color="inherit">Menu</Button> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
