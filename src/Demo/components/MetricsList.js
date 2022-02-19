import { styled } from "@mui/system";
import React from "react";
import shallow from "zustand/shallow";
import {
  useCategorizedMetrics,
  useChoroplethContext,
  useCurrentContext,
  useDashboardStore,
} from "../../Dashboard";
import NestedList from "./NestedList";

const SpiNestedList = styled(NestedList)(({ theme }) => ({
  "& .HypNestedList-depth2": {
    paddingTop: 0,
  },
  // increase space on left of all list items to make room
  // for category indicator and selected indicator
  "& .HypNestedListItem-root": {
    paddingLeft: theme.spacing(5),
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
  },
  // Basic human needs selected colors
  "& .HypNestedListItem-bhn": {
    "&.Mui-selected": {
      backgroundColor: "#F2FBFC",
      color: "#00AFBD",
    },
  },
  // Foundations of wellness selected colors
  "& .HypNestedListItem-fow": {
    "&.Mui-selected": {
      backgroundColor: "#FEF8F4",
      color: "#F79445",
    },
  },
  // Opportunity selected colors
  "& .HypNestedListItem-opp": {
    "&.Mui-selected": {
      backgroundColor: "#FAFBF6",
      color: "#909B66",
    },
  },
  "& .MuiTypography-root": {
    fontSize: theme.typography.pxToRem(14),
  },
  // top level items
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
      content: '""',
      position: "absolute",
      top: theme.spacing(2.3333),
      left: theme.spacing(2),
      height: theme.spacing(1.5),
      width: theme.spacing(1.5),
      borderRadius: theme.spacing(2),
      zIndex: 2,
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
  "& .HypNestedListItem-depth1 .MuiTypography-root": {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default function MetricsList() {
  const [metric, setMetric] = useDashboardStore(
    (state) => [state.choroplethMetric, state.setChoroplethMetric],
    shallow
  );
  const metrics = useCategorizedMetrics();
  const handleSelectMetric = (event, id) => {
    setMetric(id);
  };
  return (
    <SpiNestedList
      items={metrics}
      selected={[metric]}
      depth={0}
      collapseDepths={[0, 1]}
      onClick={handleSelectMetric}
    />
  );
}
