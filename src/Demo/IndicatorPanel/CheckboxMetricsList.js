import { styled } from "@mui/system";
import NestedList from "../components/NestedList";
import ListItemCheckbox from "./ListItemCheckbox";

const StyledNestedList = styled(NestedList)(({ theme }) => ({
  "& .MuiCheckbox-root": {
    marginLeft: theme.spacing(-1.4),
    // checkbox size
    "& svg": {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  "& .HypNestedList-root": {
    paddingTop: 0,
    paddingBottom: 0,
  },
  // indent levels of nested lists
  "& .HypNestedListItem-root": {
    padding: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  "& .HypNestedList-depth1 .HypNestedListItem-root": {
    paddingLeft: theme.spacing(3.5),
  },
  "& .HypNestedList-depth2 .HypNestedListItem-root": {
    paddingLeft: theme.spacing(6.75),
  },
  // default font size for list items
  "& .MuiTypography-root": {
    fontSize: theme.typography.pxToRem(14),
  },

  // top level category styling
  "& .HypNestedListItem-depth0": {
    position: "sticky",
    top: 0,
    zIndex: 2,
    background: theme.palette.background.paper,
    // larger + bolder type
    "& .MuiTypography-root": {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.pxToRem(16),
    },
    // no selection on top level categories
    "& .MuiCheckbox-root": {
      display: "none",
    },
  },
  // subcategory list items styling
  "& .HypNestedListItem-depth1": {
    "& .MuiTypography-root": {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
}));

export default function CheckboxMetricsList({ ...props }) {
  return <StyledNestedList childComponent={ListItemCheckbox} {...props} />;
}
