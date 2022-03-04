import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import { SearchInput } from "../../Dashboard";

export const Header = () => {
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
        <Box display="flex" gap={1} ml="auto" pl={1}>
          <SearchInput />
          {/* <Button color="inherit">Menu</Button> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
