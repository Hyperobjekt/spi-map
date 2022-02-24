import React from "react";
import PropTypes from "prop-types";
import { useMapState } from "@hyperobjekt/mapgl";
import {
  useConfig,
  useDashboardStore,
  useMapLayersConfig,
} from "../../Dashboard";
import { usePreviousProps } from "@mui/utils";

const getLayersInZoomRange = (mapLayersConfig, zoom) => {
  const layers = [];
  for (const layer of mapLayersConfig) {
    if (layer.min_zoom <= zoom && layer.max_zoom >= zoom) {
      layers.push(layer);
    }
  }
  return layers;
};

const getSwitchLayer = (mapLayersConfig, isZoomingIn) => {
  // if zooming in, switch to the layer lowest max zoom
  if (isZoomingIn)
    return mapLayersConfig.reduce((prev, curr) =>
      prev["max_zoom"] < curr["max_zoom"] ? prev : curr
    );
  // if zooming out, switch to the layer highest max zoom
  return mapLayersConfig.reduce((prev, curr) =>
    prev["max_zoom"] > curr["max_zoom"] ? prev : curr
  );
};

const MapAutoSwitch = (props) => {
  const viewState = useMapState("viewState");
  const previousViewState = usePreviousProps(viewState);
  const currentRegion = useDashboardStore((state) => state.region);
  const setRegion = useDashboardStore((state) => state.setRegion);
  const zoom = viewState.zoom;
  const previousZoom = previousViewState?.zoom;
  const isZoomingIn = zoom > previousZoom;
  const mapLayersConfig = useConfig("mapLayers");
  const layersInZoomRange = getLayersInZoomRange(mapLayersConfig, zoom);
  const shouldSwitch = !layersInZoomRange.some(
    (layerConfig) => layerConfig.region_id === currentRegion
  );
  // do nothing if we shouldn't switch or if there are no layers to switch to
  if (!shouldSwitch || layersInZoomRange.length === 0) return null;
  // get the next layer, based on the zoom direction and layers in range
  const nextLayer = getSwitchLayer(layersInZoomRange, isZoomingIn);
  nextLayer?.region_id &&
    nextLayer.region_id !== "*" &&
    setRegion(nextLayer.region_id);

  return null;
};

MapAutoSwitch.propTypes = {};

export default MapAutoSwitch;
