import { Box, styled } from "@mui/material";
import theme from "../../theme";

const ScorecardsStyle = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  gap: ${theme.spacing(2)};

  .scorecard__root {
    position: relative;
    width: 344px;
  }
  .scorecard__header {
    position: relative;
    padding: ${theme.spacing(2, 5)};
    border-bottom: 1px solid ${theme.palette.grey["300"]};
    background: #fff;
    border-radius: 2px 2px 0 0;
    z-index: 2;
  }
  .scorecard__location-color {
    width: 6px;
    border-radius: 4px;
    position: absolute;
    left: 17px;
    top: 20px;
    bottom: 20px;
  }
  .scorecard__row {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex: 1;
    padding: ${theme.spacing(1, 2, 1, 4)};
  }
  .scorecard__label {
    margin-left: 8px;
  }
  .scorecard__label,
  .scorecard__value {
    line-height: 1.333;
  }
  .scorecard__value {
    min-width: ${theme.spacing(7)};
    text-align: right;
  }

  .scorecard__perf-wrapper {
    width: ${theme.spacing(2)};
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    flex-grow: 0;
    margin-left: ${theme.spacing(1)};
    position: absolute;
    left: 3px;
    z-index: 2;
  }

  .scorecard__perf-circle {
    border: 2px solid #fff;
  }

  // TOP LEVEL CATEGORY ITEM

  .scorecard__row.HypNestedListItem-depth0 {
    margin-top: ${theme.spacing(2)};
    .scorecard__label,
    .scorecard__value {
      font-weight: 600;
      font-size: ${theme.typography.pxToRem(16)};
    }
    .scorecard__perf-wrapper {
      height: 21px;
    }
    .scorecard__perf-circle {
      width: 16px;
      height: 16px;
    }
  }

  // CIRCLE OUTLINES FOR TOP LEVEL ITEMS
  .HypNestedListItem-depth0 {
    &:nth-of-type(1) {
      .scorecard__perf-circle {
        box-shadow: 0 0 0 2px #00afbd;
      }
    }
    &:nth-of-type(2) {
      .scorecard__perf-circle {
        box-shadow: 0 0 0 2px #f79445;
      }
    }
    &:nth-of-type(3) {
      .scorecard__perf-circle {
        box-shadow: 0 0 0 2px #b6c469;
      }
    }
  }

  .HypNestedList-depth1 {
    &:nth-of-type(1) {
      .scorecard__perf-circle {
        box-shadow: 0 0 0 1px #a7d6dd;
      }
    }
    &:nth-of-type(2) {
      .scorecard__perf-circle {
        box-shadow: 0 0 0 1px #f4ccaa;
      }
    }
    &:nth-of-type(3) {
      .scorecard__perf-circle {
        box-shadow: 0 0 0 1px #dce1ba;
      }
    }
  }

  .HypNestedListItem-depth2 {
    .scorecard__perf-circle {
      border-width: 1px;
    }
  }

  // SECOND LEVEL SUB-CATEGORY LIST

  .HypNestedList-depth1 {
    position: relative;
    padding-bottom: ${theme.spacing(2)};
    border-bottom: 1px solid ${theme.palette.grey["300"]};
    .scorecard__label {
      // margin-left: 0;
    }
  //   &:after {
  //     content: "";
  //     position: absolute;
  //     top: -24px;
  //     left: 18px;
  //     bottom: 32px;
  //     width: 2px;
  //     border-radius: 4px;
  //     background: ${theme.palette.grey["300"]};
  //     opacity: 0.5;
  //   }
  //   &:nth-of-type(1):after {
  //     background: #00afbd;
  //   }
  //   &:nth-of-type(2):after {
  //     background: #f79445;
  //   }
  //   &:nth-of-type(3):after {
  //     background: #b6c469;
  //   }
  // }

  // SECOND LEVEL SUB-CATEGORY ITEM

  .scorecard__row.HypNestedListItem-depth1 {
    .scorecard__label,
    .scorecard__value {
      font-size: ${theme.typography.pxToRem(14)};
      font-weight: 600;
    }
    .scorecard__perf-wrapper {
      height: 19px;
    }
    .scorecard__perf-circle {
      width: 12px;
      height: 12px;
    }
  }

  .scorecard__row.HypNestedListItem-depth2 {
    .scorecard__label,
    .scorecard__value {
      font-size: ${theme.typography.pxToRem(14)};
    }
  }
`;

export default ScorecardsStyle;
