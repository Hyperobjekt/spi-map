import React from "react";
import ChoroplethScale from "./ChoroplethScale";
import ChoroplethSelect from "./ChoroplethSelect";

export const Legend = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 99,
        background: "#fff",
        padding: 16,
        border: `1px solid #ccc`,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <ChoroplethSelect />
      <ChoroplethScale />
    </div>
  );
};
