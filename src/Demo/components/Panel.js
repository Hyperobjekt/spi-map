import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import clsx from "clsx";
import { styled } from "@mui/system";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import { Close } from "@mui/icons-material";

const PanelRoot = styled(Paper)(({ theme }) => ({
  position: "relative",
  flex: 0,
  height: "100%",
  zIndex: 100,
  maxHeight: "100%",
  "&.HypPanel-fixed": {
    position: "fixed",
    top: 64,
    maxHeight: "calc(100% - 64px)",
    "&.HypPanel-right": {
      right: 0,
    },
    "&.HypPanel-left": {
      left: 0,
    },
  },
  "&.HypPanel-absolute": {
    position: "absolute",
    top: 0,
    bottom: 0,
    height: "100%",
    "&.HypPanel-right": {
      right: 0,
    },
    "&.HypPanel-left": {
      left: 0,
    },
  },
}));

const PanelContents = styled(Box)(({ theme }) => ({
  minWidth: 320,
  maxHeight: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "stretch",
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  height: 64,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxSizing: "border-box",
}));

const PanelBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  overflow: "auto",
  maxHeight: "calc(100% - 64px)",
  boxSizing: "border-box",
}));

const AnimatedPanel = animated(PanelRoot);

const Panel = ({
  open = false,
  classes,
  className,
  width = 320,
  float,
  absolute,
  position = "left",
  offset = 0,
  title,
  style: styleOverrides,
  bodyRef,
  children,
  onOpen,
  onClose,
  onScroll,
  ...props
}) => {
  // 👇 setup transforms required (based on float and position)
  const springOptions = {};
  const transformProp =
    float || absolute
      ? "x"
      : position === "right"
      ? "marginRight"
      : "marginLeft";
  const transformWidth = width;
  const transformAmount =
    !float || !absolute || position !== "right"
      ? -1 * transformWidth
      : transformWidth;
  springOptions[transformProp] = open ? 0 + offset : transformAmount - offset;
  springOptions.width = transformWidth;
  const style = useSpring(springOptions);

  // 👇  manage focus state
  const buttonRef = React.useRef();
  const restoreRef = React.useRef();
  useEffect(() => {
    // if opening, set the element to restore to
    if (open && document.activeElement)
      restoreRef.current = document.activeElement;
    // slight delay to allow the panel to open / close
    setTimeout(() => {
      open && buttonRef.current?.focus();
      !open && restoreRef.current?.focus();
    }, 400);
  }, [open]);

  return (
    <AnimatedPanel
      square
      elevation={2}
      className={clsx(
        "HypPanel-root",
        {
          "HypPanel-fixed": float,
          "HypPanel-absolute": absolute,
          "HypPanel-right": position === "right",
          "HypPanel-left": position === "left",
        },
        className
      )}
      style={{
        ...style,
        // hide visibility when animation is complete and panel is closed
        // visibility: style[transformProp].to((val) =>
        //   Math.abs(val) === transformWidth ? "hidden" : "visible"
        // ),
        ...styleOverrides,
      }}
      {...props}
    >
      <PanelContents className="HypPanel-contents">
        <PanelHeader className="HypPanel-header">
          <Typography component="h2" variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {onClose && (
            <IconButton ref={buttonRef} size="small" onClick={onClose}>
              <Close />
            </IconButton>
          )}
        </PanelHeader>
        <PanelBody className="HypPanel-body" ref={bodyRef} onScroll={onScroll}>
          {children}
        </PanelBody>
      </PanelContents>
    </AnimatedPanel>
  );
};

export default Panel;
