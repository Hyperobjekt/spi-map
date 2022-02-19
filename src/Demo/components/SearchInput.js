import React, { useRef } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment } from "@mui/material";
import { Close } from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: `1px solid`,
  borderColor: theme.palette.divider,
  // borderRadius: theme.shape.borderRadius,
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
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
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export const SearchInput = ({
  onChange,
  onClear,
  InputProps = {},
  placeholder = "Search…",
  icon = <SearchIcon style={{ color: "#ccc" }} />,
  ...props
}) => {
  const inputEl = useRef();
  const handleClear = (event) => {
    inputEl.current.value = "";
    onClear && onClear(event);
  };
  return (
    <Search {...props}>
      <SearchIconWrapper>{icon}</SearchIconWrapper>
      <StyledInputBase
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        inputRef={inputEl}
        onChange={onChange}
        endAdornment={
          inputEl?.current?.value && (
            <InputAdornment position="end">
              <IconButton size="small" sx={{ mr: 1 }} onClick={handleClear}>
                <Close style={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          )
        }
        {...InputProps}
      />
    </Search>
  );
};
