import { useLocationData } from "@hyperobjekt/react-dashboard";
import { Typography } from "@mui/material";
import useCategorizedMetrics from "../IndicatorPanel/hooks/useCategorizedMetrics";
import Scorecard from "./components/Scorecard";
import ScorecardsStyle from "./Scorecards.style";

const Scorecards = () => {
  const locations = useLocationData();
  const metrics = useCategorizedMetrics();
  return (
    <ScorecardsStyle>
      <div className="section__header">
        <Typography variant="overline">
          Scorecards for selected locations
        </Typography>
      </div>
      {locations.map((location, i) => {
        return <Scorecard key={i} location={location} metrics={metrics} />;
      })}
    </ScorecardsStyle>
  );
};

export default Scorecards;
