import {
  getFormatter,
  useLang,
  useLocationStore,
  useDashboardStore,
} from '@hyperobjekt/react-dashboard';
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Papa from 'papaparse';
import ScorecardHeaderCell from './ScorecardHeaderCell';
import ScorecardValueCell from './ScorecardValueCell';
import useIndicatorPanelStore from '../../IndicatorPanel/store';
import { HelpOutline } from '@mui/icons-material';
import styled from '@emotion/styled';
import useActiveView from 'App/hooks/useActiveView';
import { GEOID_TO_PLACE_NAME } from 'App/utils';
import { startCase } from 'lodash';

const HintIcon = styled(Icon)(({ theme }) => ({
  opacity: 0.54,
  '&:hover': { opacity: 0.8 },
  transition: theme.transitions.create('opacity'),
  marginLeft: 'auto',
  '& .MuiSvgIcon-root': {
    fontSize: theme.typography.pxToRem(16),
  },
}));

export const ScorecardTable = React.forwardRef(
  ({ locations: baseLocations, metrics: baseMetrics, ...props }, ref) => {
    const [, setActiveView] = useActiveView();
    const removeSelected = useLocationStore((state) => state.removeSelected);
    const region = useDashboardStore((state) => state.region);
    const [peers, setPeers] = useState([]);
    const [demographics, setDemographics] = useState([]);

    const locations = baseLocations
      .map((l) => {
        const data = l.GEOID
          ? demographics.find((d) => d.geoid?.toString().split('US').at(-1) === l.GEOID)
          : null;
        return {
          ...l,
          ...(data || {}),
        };
      })
      .map((l) => {
        const { LocationGeoid, ...locationPeers } =
          peers.find((d) => d?.LocationGeoid && d.LocationGeoid.endsWith(l.GEOID)) ?? {};

        return {
          ...l,
          peers: Object.values(locationPeers || [])
            .map((x) => GEOID_TO_PLACE_NAME[x])
            .sort(),
        };
      });

    const customizedMetrics = useIndicatorPanelStore((state) => state.customizedMetrics);
    const hasCustomized = customizedMetrics.length > 0;
    const enableCustomized = useIndicatorPanelStore((state) => state.enableCustomized);
    const filteredMetrics =
      enableCustomized && hasCustomized
        ? baseMetrics.filter((metric) => {
            if (metric.depth === 0) {
              //true if top-level category
              return true;
            } else if (metric.depth === 1) {
              //true if subcategory with children selected
              return baseMetrics
                .filter((m) => customizedMetrics.includes(m.id))
                .map((m) => m.subcategory)
                .includes(metric.id);
            } else {
              //true if item is selected
              return customizedMetrics.includes(metric.id);
            }
          })
        : baseMetrics;

    const metrics = [
      ...filteredMetrics,
      { id: 'dem', name: 'Demographics', depth: 0 },
      { id: 'overview', name: 'Overview', depth: 1 },
      {
        id: 'totpop',
        name: 'Total Population',
        depth: 2,
        formatter: getFormatter('integer'),
      },
      {
        id: 'medianhhinc',
        name: 'Median Household Income',
        depth: 2,
        formatter: getFormatter('dollars'),
      },
      {
        id: 'poor',
        name: 'Poverty Rate',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'below200pov',
        name: 'Below 200% Poverty Rate',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      { id: 'age', name: 'Age Groups', depth: 1 },
      {
        id: 'under5',
        name: 'Under 5',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'age5_19',
        name: 'Age 5-19',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'age20_34',
        name: 'Age 20-34',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'age35_49',
        name: 'Age 35-49',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'age50_65',
        name: 'Age 50-65',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'over65',
        name: 'Age 65+',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      { id: 'race', name: 'Race / Ethnicity', depth: 1 },
      {
        id: 'nonhispwhite',
        name: 'White',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'nonhispblack',
        name: 'Black',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'nonhispasian',
        name: 'Asian',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'hispanicpop',
        name: 'Hispanic',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'peers',
        name: `Peer ${startCase(region)}`,
        depth: 0,
        cellStyle: { verticalAlign: 'top' },
        formatter: (locations) => (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontWeight: 'normal' }}>
            {locations.map((location, i) => (
              <>
                {i > 0 && <span>•</span>}
                <span>{location}</span>
              </>
            ))}
          </div>
        ),
      },
    ];

    useEffect(() => {
      let subscribed = true;

      Papa.parse('/assets/data/demographics.csv', {
        header: true,
        download: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        transform: (value, col) => (!value ? value : col === 'geoid' ? value.toString() : +value),
        complete: (data) => {
          if (subscribed) {
            setDemographics(data.data);
          }
        },
      });

      Papa.parse(`/assets/data/${region}-peers.csv`, {
        header: true,
        download: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (data) => {
          setPeers(data.data);
        },
      });

      return () => {
        subscribed = false;
      };
    }, [region]);

    return (
      <TableContainer ref={ref} {...props}>
        <Table stickyHeader aria-label="sticky table" style={{ width: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 300 }} className="scorecard__label-cell" />
              {locations.map((location) => (
                <ScorecardHeaderCell
                  key={location.id}
                  color={location.color}
                  name={location.name}
                  parentName={location.parentName}
                  handleRemove={() => {
                    if (locations.length === 1) return setActiveView('map');
                    removeSelected(location);
                  }}
                  style={{
                    width: 200,
                  }}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map((metric) => (
              <Row metric={metric} locations={locations} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
);

const Row = ({ metric, locations }) => {
  const langKey = `DESC_${metric.id}`.toUpperCase();
  const hint = useLang(langKey);

  return (
    <TableRow
      hover
      tabIndex={-1}
      key={metric.id}
      className={clsx('scorecard__row', 'scorecard__row--depth' + metric.depth)}
    >
      <TableCell className="scorecard__label-cell" style={metric.cellStyle}>
        {/* SCROLL TARGET: offset by 90px to make room for header */}
        <span
          id={`scorecard-row-${metric.id}`}
          style={{
            width: '1px',
            height: '1px',
            position: 'absolute',
            marginTop: -90,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography className="scorecard__metric-label">{metric.name}</Typography>
          {(hint || metric?.source) && (
            <Tooltip
              title={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {hint && <div>{hint}</div>}
                  {metric.unit && <div>Values represent {metric.unit}</div>}
                  {metric?.source && (
                    <div
                      style={{
                        fontStyle: 'italic',
                      }}
                    >
                      Source: {metric.source}
                    </div>
                  )}
                </div>
              }
              arrow
              placement="left"
            >
              <HintIcon size="small" style={{ height: '100%' }}>
                <HelpOutline />
              </HintIcon>
            </Tooltip>
          )}
        </div>
      </TableCell>
      {locations.map((location) => {
        const value = location[metric.id];
        const performance = location[metric.id + '_p'];
        const showPercent = [
          'poor',
          'below200pov',
          'under5',
          'age5_19',
          'age20_34',
          'age35_49',
          'age50_65',
          'over65',
          'nonhispwhite',
          'nonhispblack',
          'nonhispasian',
          'hispanicpop',
        ].includes(metric.id);

        return (
          <ScorecardValueCell
            key={location.id}
            value={
              value && metric.formatter
                ? metric.formatter(showPercent ? value / 100 : value)
                : value
            }
            performance={performance}
            percent={showPercent && value ? value / 100 : undefined}
            style={metric.cellStyle}
          />
        );
      })}
    </TableRow>
  );
};
