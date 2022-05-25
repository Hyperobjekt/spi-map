import { getFormatter } from '@hyperobjekt/react-dashboard';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Papa from 'papaparse';
import ScorecardHeaderCell from './ScorecardHeaderCell';
import ScorecardValueCell from './ScorecardValueCell';

export const ScorecardTable = React.forwardRef(
  ({ locations: baseLocations, metrics: baseMetrics, ...props }, ref) => {
    const [demographics, setDemographics] = useState([]);

    const locations = baseLocations.map((l) => {
      const isState = l.state && l.GEOID && l.state === l.GEOID;
      const data = l.GEOID
        ? demographics.find(
            (d) =>
              d?.geoid &&
              (isState
                ? d.geoid.startsWith('04000') && d.geoid.endsWith(l.GEOID)
                : d.geoid.endsWith(l.GEOID)),
          )
        : null;
      return {
        ...l,
        ...(data || {}),
      };
    });

    const metrics = [
      ...baseMetrics,
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
        name: '% Poverty Rate',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'below200pov',
        name: '% Below 200% Poverty Rate',
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
        name: '% White',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'nonhispblack',
        name: '% Black',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'nonhispasian',
        name: '% Asian',
        depth: 2,
        formatter: getFormatter('percent'),
      },
      {
        id: 'hispanicpop',
        name: '% Hispanic',
        depth: 2,
        formatter: getFormatter('percent'),
      },
    ];

    useEffect(() => {
      let subscribed = true;

      Papa.parse('/assets/data/demographics.csv', {
        header: true,
        download: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (data) => {
          if (subscribed) {
            setDemographics(data.data);
          }
        },
      });

      return () => {
        subscribed = false;
      };
    }, []);

    return (
      <TableContainer ref={ref} {...props}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ width: `${100 / (locations.length + 1)}%` }}
                className="scorecard__label-cell"
              />
              {locations.map((location) => (
                <ScorecardHeaderCell
                  key={location.id}
                  color={location.color}
                  name={location.name}
                  parentName={location.parentName}
                  style={{
                    width: `${100 / (locations.length + 1)}%`,
                  }}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map((metric) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={metric.id}
                  className={clsx('scorecard__row', 'scorecard__row--depth' + metric.depth)}
                >
                  <TableCell className="scorecard__label-cell">
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
                    <Typography className="scorecard__metric-label">{metric.name}</Typography>
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
                      />
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
);
