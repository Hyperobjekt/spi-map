import { ArrowDropDown } from "@mui/icons-material";
import { Menu, MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { useMemo } from "react";
// import { useLang } from "../../Language";

function uuid(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

const InlineMenuButton = styled("button")({
  background: "none",
  border: 0,
  padding: 0,
  margin: 0,
  borderRadius: 1,
  display: "inline-block",
  verticalAlign: "top",
  fontWeight: 500,
  fontSize: "inherit",
  cursor: "pointer",
  textAlign: "left",
  whiteSpace: "nowrap",
  "& span": {
    display: "inline",
    whiteSpace: "normal",
  },
  "& svg": {
    fontSize: "1.5em",
    margin: "-0.25em",
    // marginRight: -18,
  },
  "&:hover span": {
    textDecoration: "underline",
  },
  "&:focus": {
    outline: "none",
  },
});

const InlineMenu = ({ children, options, selected, onSelect, ...props }) => {
  const id = useMemo(uuid, []);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const unavailableOptions = options.filter((o) => o.unavailable);
  // const unavailableLabel = useLang("LABEL_UNAVAILABLE");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e, option) => {
    setAnchorEl(null);
    onSelect && onSelect(e, option);
  };
  return (
    <>
      <Typography
        aria-controls={id}
        aria-haspopup="true"
        component={InlineMenuButton}
        onClick={handleClick}
        {...props}
      >
        <span>{children}</span> <ArrowDropDown />
      </Typography>
      <Menu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options
          .filter((o) => !o.unavailable)
          .map((option, i) => (
            <MenuItem
              key={option.id}
              selected={option.active || selected === option.id}
              onClick={(e) => handleClose(e, option)}
            >
              <span style={{ textTransform: "capitalize" }}>
                {option?.name ? option.name : option}{" "}
              </span>
            </MenuItem>
          ))}
        {/* {unavailableOptions.length > 0 && (
          <ListSubheader>{unavailableLabel}</ListSubheader>
        )} */}
        {unavailableOptions.map((option, i) => (
          <MenuItem key={option.id} disabled>
            <span style={{ textTransform: "capitalize" }}>
              {option?.name ? option.name : option}
            </span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

InlineMenu.propTypes = {};

export default InlineMenu;
