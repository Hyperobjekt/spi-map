// Temporary object mapping state fips to name

import { getRegionFromGeoid } from '@hyperobjekt/react-dashboard';

// TODO: put the state name in the tileset data so this is not needed.
export const FIPS_TO_STATE_NAME = {
  '01': 'Alabama',
  '02': 'Alaska',
  '04': 'Arizona',
  '05': 'Arkansas',
  '06': 'California',
  '08': 'Colorado',
  '09': 'Connecticut',
  10: 'Delaware',
  11: 'District of Columbia',
  12: 'Florida',
  13: 'Geogia',
  15: 'Hawaii',
  16: 'Idaho',
  17: 'Illinois',
  18: 'Indiana',
  19: 'Iowa',
  20: 'Kansas',
  21: 'Kentucky',
  22: 'Louisiana',
  23: 'Maine',
  24: 'Maryland',
  25: 'Massachusetts',
  26: 'Michigan',
  27: 'Minnesota',
  28: 'Mississippi',
  29: 'Missouri',
  30: 'Montana',
  31: 'Nebraska',
  32: 'Nevada',
  33: 'New Hampshire',
  34: 'New Jersey',
  35: 'New Mexico',
  36: 'New York',
  37: 'North Carolina',
  38: 'North Dakota',
  39: 'Ohio',
  40: 'Oklahoma',
  41: 'Oregon',
  42: 'Pennsylvania',
  44: 'Rhode Island',
  45: 'South Carolina',
  46: 'South Dakota',
  47: 'Tennessee',
  48: 'Texas',
  49: 'Utah',
  50: 'Vermont',
  51: 'Virginia',
  53: 'Washington',
  54: 'West Virginia',
  55: 'Wisconsin',
  56: 'Wyoming',
};

/**
 * Returns the name and parent location for a feature properties object
 * @param {object} featureProps
 * @returns
 */
export const getLocationNameParts = (featureProps) => {
  if (!featureProps) return null;
  const { name, state, GEOID } = featureProps;
  const region = getRegionFromGeoid(GEOID);
  const nameValue = name || featureProps.NAME || 'Unknown';
  const stateValue = state || featureProps.STATE;
  const parent = region === 'states' ? 'United States' : FIPS_TO_STATE_NAME[stateValue];
  return [nameValue, parent];
};

export const getColorForMetric = (metric) => {
  const category = metric.category || metric.id;
  switch (category) {
    case 'spi':
      return '#00afbd';
    case 'bhn':
      return '#00afbd';
    case 'fow':
      return '#f79445';
    case 'opp':
      return '#b6c469';
    default:
      return '#f5f5f5';
  }
};
