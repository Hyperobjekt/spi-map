import Color from 'color';
import { useMemo } from 'react';
import { useMetricConfig } from '@hyperobjekt/react-dashboard';

export const getCategoryColors = (category) => {
  const bluegreen = ['#498ABA', '#6AB1CF', '#8ECAC4', '#B3DBB8', '#D2EAC8'];
  switch (category) {
    case 'spi':
      return bluegreen.reverse();
    case 'bhn':
      return bluegreen.reverse();
    case 'fow':
      return bluegreen.reverse();
    /* .map((c, i) => {
          const color = Color(c);
          return color.desaturate(0.05 * i).hex();
        })
        .reverse(); */
    case 'opp':
      return bluegreen.reverse();
    /*  .map((c, i) => {
          const color = Color(c);
          return color
            .rotate(-10)
            .desaturate(0.2 * i)
            .hex();
        })
        .reverse(); */
    default:
      return null;
  }
};

export default function useSpiScaleOverrides({ metric_id }) {
  const metric = useMetricConfig(metric_id);
  const category = metric?.category || metric_id;
  return useMemo(() => {
    return { colors: getCategoryColors(category) };
  }, [category]);
}
