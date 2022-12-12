import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
  Typography,
} from '@mui/material';
import theme from '../../../theme';
import { CustomizeIndicatorsToggle } from '../../IndicatorPanel';
import { animated } from '@react-spring/web';
import PerformanceIndicator from 'App/components/PerformanceIndicator';
import { useDashboardStore } from '@hyperobjekt/react-dashboard';
import { startCase } from 'lodash';

const StyledPaper = styled(Paper)`
  max-height: calc(100vh - ${theme.spacing(16)});
  overflow: auto;
  padding: ${theme.spacing(2)};
  opacity: 0;
  min-width: 264px;
  .MuiList-root {
    margin: 0 -${theme.spacing(2)};
  }
  .MuiDivider-root {
    margin: 0 ${theme.spacing(-2)} ${theme.spacing(2)};
  }
  .customize-toggle__label {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 0;
    .MuiFormControlLabel-label {
      font-size: ${theme.typography.pxToRem(14)};
    }
  }
  .customize-toggle__switch {
    margin-right: ${theme.spacing(-1)};
  }
  .customize-toggle__button {
    width: 100%;
    margin-top: ${theme.spacing(1)};
  }
  button.jumplink {
    cursor: pointer;
    background-color: #fff;
    border: none;
    padding: 0;
    text-decoration: underline;
    color: #3e8ace;
  }
`;

const ControlsWrapper = animated(StyledPaper);

const ScorecardControls = ({ onNavigateToSection, ...props }) => {
  const region = useDashboardStore((state) => state.region);

  const handleSectionNavigation = (section) => (e) => {
    onNavigateToSection && onNavigateToSection(e, section);
  };

  return (
    <ControlsWrapper {...props}>
      <Typography variant="overline" fontWeight={600}>
        Color Codes
      </Typography>
      <List style={{ paddingBottom: 16 }}>
        {[
          [1, 'Underperforming'],
          [2, 'Performing as expected'],
          [3, 'Overperforming'],
        ].map(([performance, primary]) => (
          <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
            <ListItemIcon style={{ minWidth: 20 }}>
              <PerformanceIndicator performance={performance} />
            </ListItemIcon>
            <ListItemText style={{ margin: 0 }} primary={primary} />
          </ListItem>
        ))}
      </List>
      <Typography variant="caption" maxWidth={360} display={'block'} fontSize={'0.875rem'}>
        {`Strengths and vulnerabilities are relative to 16 ${region} of similar Median Household Income
        per capita.`}{' '}
        <button className="jumplink" onClick={handleSectionNavigation('peers')}>
          View peer {region}
        </button>
        {` at the end of this table.`}
      </Typography>
      <Divider style={{ paddingTop: 16 }} />
      <Typography variant="overline" fontWeight={600}>
        Scorecard Sections
      </Typography>
      <List>
        <ListItem button onClick={handleSectionNavigation('spi')}>
          <ListItemText primary="Social Progress Index" />
        </ListItem>
        <ListItem button onClick={handleSectionNavigation('bhn')}>
          <ListItemText primary="Basic Human Needs" />
        </ListItem>
        <ListItem button onClick={handleSectionNavigation('fow')}>
          <ListItemText primary="Foundations of Wellbeing" />
        </ListItem>
        <ListItem button onClick={handleSectionNavigation('opp')}>
          <ListItemText primary="Opportunity" />
        </ListItem>
        <ListItem button onClick={handleSectionNavigation('dem')}>
          <ListItemText primary="Demographics" />
        </ListItem>
        <ListItem button onClick={handleSectionNavigation('peers')}>
          <ListItemText primary={`Peer ${startCase(region)}`} />
        </ListItem>
      </List>
      <Divider />
      <Typography sx={{ mb: 2, display: 'block' }} variant="overline" fontWeight={600}>
        Scorecard Indicators
      </Typography>
      {/*<SearchInput placeholder="Filter by keyword" icon={<FilterList />} />*/}
      <CustomizeIndicatorsToggle
        flexDirection="column"
        px={0}
        mb={2}
        mt={1}
        editLabel="Change Custom Indicators"
      />
      {/*<Divider />
      <Typography variant="overline">Data Export</Typography>
      <List>
        <ListItem
          button
          onClick={() => {
            alert('not implemented');
          }}
        >
          <ListItemText primary="Download PDF Report" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            alert('not implemented');
          }}
        >
          <ListItemText primary="Download Spreadsheet" />
        </ListItem>
      </List>*/}
    </ControlsWrapper>
  );
};

export default ScorecardControls;
