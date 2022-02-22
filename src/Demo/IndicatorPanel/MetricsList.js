import { Help, HelpOutline } from "@mui/icons-material";
import { IconButton, ListItemButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { useLang } from "../../Dashboard";
import NestedList from "../components/NestedList";

const StyledNestedList = styled(NestedList)(({ theme }) => ({
  "& .HypNestedList-depth2": {
    paddingTop: 0,
  },
  // increase space on left of all list items to make room
  // for category indicator and selected indicator
  "& .HypNestedListItem-root": {
    paddingLeft: theme.spacing(5),
    "&:not(.HypNestedListItem-expanded) .HypNestedListItem-toggle .MuiSvgIcon-root":
      {
        color: theme.palette.grey[400],
      },
    "&.Mui-selected .MuiTypography-root": {
      fontWeight: theme.typography.fontWeightBold,
    },
    // selected indicator
    "&.Mui-selected:before": {
      content: '""',
      position: "absolute",
      top: theme.spacing(1),
      bottom: theme.spacing(1),
      left: theme.spacing(0.75),
      width: theme.spacing(0.25),
    },
    "&.HypNestedListItem-bhn:before": {
      backgroundColor: "#00AFBD",
    },
    "&.HypNestedListItem-fow:before": {
      backgroundColor: "#F79445",
    },
    "&.HypNestedListItem-opp:before": {
      backgroundColor: "#B6C469",
    },
    "&.Mui-selected .SpiHintIconButton-root, &:hover .SpiHintIconButton-root": {
      opacity: 1,
    },
  },
  // default font size for list items
  "& .MuiTypography-root": {
    fontSize: theme.typography.pxToRem(14),
  },
  // Basic human needs hover + selected colors
  "& .HypNestedListItem-bhn": {
    "&.Mui-selected": {
      backgroundColor: "#F2FBFC",
      color: "#00AFBD",
      // expand / collapse icon color
      "& .MuiSvgIcon-root": {
        color: "#00AFBD",
      },
    },
    "&:hover": {
      backgroundColor: "#F2FBFC",
    },
  },
  // Foundations of wellness hover + selected colors
  "& .HypNestedListItem-fow": {
    "&.Mui-selected": {
      backgroundColor: "#FEF8F4",
      color: "#F79445",
      // expand / collapse icon color
      "& .MuiSvgIcon-root": {
        color: "#F79445",
      },
    },
    "&:hover": {
      backgroundColor: "#FEF8F4",
    },
  },
  // Opportunity hover + selected background and text colors
  "& .HypNestedListItem-opp": {
    "&.Mui-selected": {
      backgroundColor: "#FAFBF6",
      color: "#909B66",
      // expand / collapse icon color
      "& .MuiSvgIcon-root": {
        color: "#909B66",
      },
    },
    "&:hover": {
      backgroundColor: "#FAFBF6",
    },
  },
  "& .HypNestedListItem-depth0, & .HypNestedListItem-depth1": {
    // circle category marker
    "&:after": {
      content: '""',
      position: "absolute",
      borderRadius: theme.spacing(2),
    },
    "&.HypNestedListItem-bhn:after": {
      backgroundColor: "#00AFBD",
    },
    "&.HypNestedListItem-fow:after": {
      backgroundColor: "#F79445",
    },
    "&.HypNestedListItem-opp:after": {
      backgroundColor: "#B6C469",
    },
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
    // circle category marker
    "&:after": {
      top: theme.spacing(2.3333),
      left: theme.spacing(2),
      height: theme.spacing(1.5),
      width: theme.spacing(1.5),
    },
  },
  // subcategory list items styling
  "& .HypNestedListItem-depth1": {
    "&:after": {
      top: 21,
      left: 19,
      height: 6,
      width: 6,
    },
    "& .MuiTypography-root": {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
}));

const HintIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1.2),
  left: theme.spacing(1.25),
  opacity: 0,
  transition: theme.transitions.create("opacity"),
  "& .MuiSvgIcon-root": {
    fontSize: theme.typography.pxToRem(16),
  },
}));

const ListItemHintButton = ({ value, children, ...props }) => {
  const langKey = `DESC_${value}`.toUpperCase();
  const hint = useLang(langKey);
  return (
    <ListItemButton {...props}>
      {hint && (
        <Tooltip title={hint} arrow placement="left">
          <HintIconButton className="SpiHintIconButton-root" size="small">
            <HelpOutline />
          </HintIconButton>
        </Tooltip>
      )}
      {children}
    </ListItemButton>
  );
};

export default function MetricsList({ ...props }) {
  return <StyledNestedList childComponent={ListItemHintButton} {...props} />;
}
