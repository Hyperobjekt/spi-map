// import Color from 'color';
import { useMemo } from 'react';
import { useMetricConfig } from '@hyperobjekt/react-dashboard';

const non_reverse_metric_ids = [
  'nbm_dental',
  'ps_accidents',
  'ps_property',
  'ps_violent',
  's_hburdenowner',
  's_hburdenrenter',
  's_homeless',
  's_overcrowded',
  'abk_hsincomplete',
  'abk_lessthan9',
  'aic_nointernet',
  'eq_no2',
  'eq_ozone',
  'eq_pm25',
  'nbm_foodstamps',
  'hw_cancer',
  'hw_chd',
  'hw_diabetes',
  'hw_drugod',
  'hw_mentalhealth',
  'hw_obesity',
  'i_dissimilarity',
  'pfc_disconnected',
  'pr_fatal',
  'nbm_poorhealth',
  's_nokitchen',
  'ws_drinkingwater',
  'eq_waterstress',
  'eq_affectedglobalwa',
  'i_commutetime',
  'pfc_birthrate15_19',
  'pfc_notinsuredunder65',
  'pr_gendergappower',
  'ws_floodrisk',
  'ws_noplumbing',
];

export const getCategoryColors = (category, metric_id) => {
  const bluegreen = ['#498ABA', '#6AB1CF', '#8ECAC4', '#B3DBB8', '#D2EAC8'];
  const reverse = !non_reverse_metric_ids.includes(metric_id);
  switch (category) {
    case 'spi':
      return reverse ? bluegreen.reverse() : bluegreen;
    case 'bhn':
      return reverse ? bluegreen.reverse() : bluegreen;
    case 'fow':
      return reverse ? bluegreen.reverse() : bluegreen;
    /* .map((c, i) => {
          const color = Color(c);
          return color.desaturate(0.05 * i).hex();
        })
        .reverse(); */
    case 'opp':
      return reverse ? bluegreen.reverse() : bluegreen;
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
    return { colors: getCategoryColors(category, metric_id) };
  }, [category, metric_id]);
}
