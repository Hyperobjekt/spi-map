import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

/**
 * Number formats to use based on value
 */
const PRECISION_FORMATS = {
  0.001: format(".4~f"), // fixed to 4 decimal places
  0.01: format(".3~f"), // fixed to 3 decimal places
  0.1: format(".3~f"), // fixes to 3 decimal places
  1: format(".2~f"), // fixed to 2 decimal places
  100: format(".1~f"), // fixed to 1 decimal place
  1000: format(",d"), // integer, comma separator
  10000: format(".2~s"), // 2 sig figs, use SI prefix
  100000: format(".3~s"), // 3 sig figs, use SI prefix
  1000000: format(".3~s"), // 3 sig figs, use SI prefix
};

/**
 * Determines the number precision and returns a short formatted string
 */
export const autoFormatNumber = (num) => {
  num = Number(num);
  const precisionKeys = Object.keys(PRECISION_FORMATS);
  const intervals = precisionKeys.map((k) => Number(k));
  for (let i = 0; i < intervals.length; i++) {
    if (num < intervals[i]) {
      return PRECISION_FORMATS[precisionKeys[i]](num);
    }
  }
  // use largest formatter if no match
  return PRECISION_FORMATS[precisionKeys[precisionKeys.length - 1]](num);
};

export const formatInteger = format(",d"); // 123
export const formatDecimal = (value, precision = 2) =>
  format(`,.${precision}f`)(value); // 123.46 (when precision = 2)
export const formatDate8601 = timeFormat("%Y-%m-%d"); // 2018-01-02 (ISO 8601)
export const formatShortDate = timeFormat("%b %d, '%y"); // Jan 2, '18
export const formatFullDate = timeFormat("%B %d, %Y"); // January 2, 2018
export const formatMonth = timeFormat("%B"); // January
export const formatShortMonth = timeFormat("%b"); // Jan
export const formatMonthDay = timeFormat("%b %d"); // Jan 2
export const formatMonthYear = timeFormat("%b '%y"); // Jan '18
export const formatPercent = format(".2~p"); // 54.23% (or 54% if integer is passed)
export const formatDollars = format("$,d"); // $123,456
export const formatCurrency = (value) => `$${autoFormatNumber(value)}`; // $123k
export const formatFullCurrency = format("$,.2~f"); // $123,456.78
export const formatYesNo = (v) => (v ? "Yes" : "No"); // Yes when truthy
export const formatOnOff = (v) => (v ? "On" : "Off"); // On when truthy
export const formatNothing = (v) => v; // no formatting
export const formatPercentValue = (v) => autoFormatNumber(v) + "%"; // adds a percent sign, assums percent has already been calculated

/**
 * Provides a formatter function based on the provided type.
 */
export const getFormatter = (type) => {
  switch (type) {
    case "number":
      return autoFormatNumber;
    case "integer":
      return formatInteger;
    case "float":
      return formatDecimal;
    case "date":
      return formatDate8601;
    case "full_date":
      return formatFullDate;
    case "short_date":
      return formatShortDate;
    case "month":
      return formatMonth;
    case "short_month":
      return formatShortMonth;
    case "month_day":
      return formatMonthDay;
    case "month_year":
      return formatMonthYear;
    case "percent":
      return formatPercent;
    case "percent_value":
      return formatPercentValue;
    case "dollars":
      return formatDollars;
    case "currency":
      return formatCurrency;
    case "full_currency":
      return formatFullCurrency;
    case "yes_no":
      return formatYesNo;
    case "on_off":
      return formatOnOff;
    default:
      return formatNothing;
  }
};
