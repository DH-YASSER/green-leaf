import React from "react";

export default function Empty({
  icon: Icon,
  label = "No data",
}) {
  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
      }}
    >
      {Icon && <Icon size={32} />}
      <p>{label}</p>
    </div>
  );
}