// import Color from 'color';
import { useMemo } from 'react';
import { useMetricConfig } from '@hyperobjekt/react-dashboard';

const non_reverse_metric_ids = [
  'nmbc_dentalvisits',
  'ps_motoraccidents(per 10,000pop)',
  'ps_propertycrime(per 10,000pop)',
  'ps_violentcrime(per 1,000pop)',
  'sh_costburden_owners',
  'sh_costburden_renters',
  'sh_overcrowding',
  'abk_withouthighdiploma',
  'abk_lessthan9thgrade',
  'aic_nointernet',
  'eq_ozone',
  'eq_pm2.5',
  'nbmc_foodsecurity',
  'hw_cancer',
  'hw_chd',
  'hw_diabetes',
  'hw_overdose',
  'hw_mentalhealth',
  'hw_obesity',
  'inc_residentialsegregation',
  'pfc_disconnectedyouth',
  'pr_fatalencounters',
  'sh_lackkitchen',
  'ws_wastewaterproximity',
  'eq_waterrisk',
  'inc_averagecommuttetime',
  'pfc_teenbirthrate',
  'pfc_lackhealthinsurance',
  'ws_floodrisk',
  'ws_lackplumbing',
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
