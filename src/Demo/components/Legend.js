import { HelpOutline } from "@mui/icons-material";
import { Paper, Tooltip, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React from "react";
import { useChoroplethContext, useLang } from "../../Dashboard";
import ChoroplethScale from "./ChoroplethScale";
import ChoroplethSelect from "./ChoroplethSelect";
import RegionSelect from "./RegionSelect";

const LegendContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  bottom: 24,
  right: 24,
  zIndex: 99,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  padding: theme.spacing(2, 2, 1, 2),
  maxWidth: 300,
}));

const HelpContainer = styled(Paper)(({ theme }) => {
  return {
    position: "absolute",
    right: "-16px",
    padding: "4px 4px 4px 0px",
    borderRadius: "0 24px 24px 0",
    top: 10,
    "&:before": {
      content: '""',
      position: "absolute",
      background: theme.palette.background.paper,
      left: -2,
      height: 40,
      width: 14,
      top: -2,
      zIndex: 2,
    },
    "& svg": {
      display: "block",
      position: "relative",
      zIndex: 4,
      color: theme.palette.grey["500"],
    },
  };
});

export const Legend = ({ children, ...props }) => {
  const { metric_id } = useChoroplethContext();
  const unit = useLang("UNIT_" + metric_id);
  const hint = useLang("DESC_" + metric_id);
  return (
    <LegendContainer {...props}>
      {hint && (
        <HelpContainer>
          <Tooltip title={hint} placement="left" arrow>
            <HelpOutline />
          </Tooltip>
        </HelpContainer>
      )}

      <ChoroplethSelect />
      <Box display="flex" alignItems="center" gap={0.5} mt={0.5} mb={1}>
        <Typography lineHeight={1.2} variant="caption">
          {" "}
          for{" "}
        </Typography>{" "}
        <RegionSelect lineHeight={1.2} color="grey.700" />{" "}
        <Typography lineHeight={1.2} variant="caption">
          {" "}
          in the U.S.{" "}
        </Typography>
      </Box>
      {unit && (
        <Typography
          variant="caption"
          fontStyle="italic"
          color="grey.700"
          mb={0.5}
        >
          Values represent {unit}
        </Typography>
      )}
      <ChoroplethScale style={{ margin: "0px -15px -8px" }} />
      {children}
    </LegendContainer>
  );
};
