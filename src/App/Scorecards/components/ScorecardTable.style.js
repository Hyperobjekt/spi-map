import { Box, Paper, styled } from "@mui/material";
import theme from "../../../theme";
import { animated } from "@react-spring/web";

const StyledPaper = styled(Paper)`
  display: block;
  overflow: hidden;
  width: 100%;
  .MuiTableContainer-root {
    max-height: calc(100vh - ${theme.spacing(16)});
  }
  .scorecard__location-color {
    width: 6px;
    border-radius: 4px;
    position: absolute;
    right: 8px;
    top: 20px;
    bottom: 20px;
  }
  .scorecard__value-cell {
    // display: flex;
  }
  .scorecard__label-cell {
    position: sticky;
    left: 0;
    z-index: 10;
    background: #fff;
    max-width: 300px;
    min-width: 240px;
  }
  .MuiTableHead-root .scorecard__label-cell {
    top: 0;
    z-index: 1000;
  }

  .MuiTableCell-root {
    padding-left: ${theme.spacing(1)};
    padding-right: ${theme.spacing(1)};
  }
  .MuiTableCell-root:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  .MuiTableCell-root.scorecard__header {
    background: #fff;
    z-index: 2;
  }
  .MuiTableCell-root.scorecard__header:nth-child(2n) {
    background-color: #fcfcfc;
  }
  .scorecard__location-name,
  .scorecard__location-parent {
    max-width: 140px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: right;
    margin-right: ${theme.spacing(3)};
    margin-left: auto;
  }
  .scorecard__value-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .scorecard__perf-wrapper {
    margin-left: ${theme.spacing(2)};
  }
  .scorecard__row--depth0 {
    .MuiTypography-root {
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(16)};
    }
  }
  .scorecard__row--depth1 {
    .MuiTableCell-root {
      padding-top: ${theme.spacing(1.5)};
      padding-bottom: ${theme.spacing(1.5)};
    }
    .MuiTypography-root {
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(14)};
    }
  }
  .scorecard__row--depth2 {
    .MuiTableCell-root {
      padding-top: ${theme.spacing(1)};
      padding-bottom: ${theme.spacing(1)};
    }
    .MuiTypography-root {
      font-size: ${theme.typography.pxToRem(14)};
    }
  }
`;

const ScorecardTableStyle = animated(StyledPaper);

export default ScorecardTableStyle;
