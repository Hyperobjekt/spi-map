import { styled } from "@mui/material";

const MapBodyWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  height: `calc(100vh - ${theme.spacing(7)})`,
  maxHeight: `calc(100vh - ${theme.spacing(7)})`,
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    height: `calc(100vh - ${theme.spacing(8)})`,
    maxHeight: `calc(100vh - ${theme.spacing(8)})`,
  },
  "& .HypMapGl-root": {
    position: "absolute",
    inset: 0,
    height: "100%",
  },
}));

export default MapBodyWrapper;
