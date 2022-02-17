import React from "react";
import { Source, Layer } from "react-map-gl";
import { useLocationStore } from "../../Dashboard/Locations";

/**
 * DEPRECATED: this function is one attempt at location outlines, but a better
 * method is used in `useChoroplethLayers`.  This is left as an example and will
 * be removed before release.
 */
const casingLayer = {
  id: `selected-casing`,
  source: `selected-features`,
  type: "line",
  paint: {
    "line-color": "#fff",
    "line-width": 5,
  },
  beforeId: "road-label",
};
const outlineLayer = {
  id: `selected-outline`,
  source: `selected-features`,
  type: "line",
  paint: {
    "line-color": "#666",
    "line-width": 3,
  },
  beforeId: "road-label",
};

const SelectedLocationLayer = (props) => {
  console.log("SelectedLocationLayer is deprecated!");
  const selected = useLocationStore((state) => state.selected);
  const geojson = {
    type: "FeatureCollection",
    features: selected,
  };
  return (
    <Source id="selected-features" type="geojson" data={geojson}>
      <Layer {...casingLayer} />
      <Layer {...outlineLayer} />
    </Source>
  );
};

SelectedLocationLayer.propTypes = {};

export default SelectedLocationLayer;
