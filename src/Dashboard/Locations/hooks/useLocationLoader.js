import { useMapStore } from "@hyperobjekt/mapgl";

export default function useLocationLoader() {
  const selectedFeature = useMapStore((state) => state.selectedFeature);
  console.log("useLocationLoader", selectedFeature);
}
