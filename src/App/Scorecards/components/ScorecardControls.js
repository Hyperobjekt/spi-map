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

const StyledPaper = styled(Paper)`
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
`;

const ControlsWrapper = animated(StyledPaper);

const ScorecardControls = ({ onNavigateToSection, ...props }) => {
  const handleSectionNavigation = (section) => (e) => {
    onNavigateToSection && onNavigateToSection(e, section);
  };

  return (
    <ControlsWrapper {...props}>
      <Typography variant="overline">Color Codes</Typography>
      <List style={{ paddingBottom: 16 }}>
        {[
          [1, 'Underperforming'],
          [3, 'Performing as expected'],
          [5, 'Overperforming'],
        ].map(([performance, primary]) => (
          <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
            <ListItemIcon style={{ minWidth: 20 }}>
              <PerformanceIndicator performance={performance} />
            </ListItemIcon>
            <ListItemText style={{ margin: 0 }} primary={primary} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="overline">Scorecard Sections</Typography>
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
      </List>
      <Divider />
      <Typography sx={{ mb: 2, display: 'block' }} variant="overline">
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
