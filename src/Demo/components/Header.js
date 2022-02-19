import React from "react";
import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: `1px solid`,
  borderColor: theme.palette.divider,
  // borderRadius: theme.shape.borderRadius,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1, 0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

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
          <Search>
            <SearchIconWrapper>
              <SearchIcon style={{ color: "#ccc" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Button color="inherit">Menu</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
