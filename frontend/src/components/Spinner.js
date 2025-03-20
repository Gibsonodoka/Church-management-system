import React from "react";
import { HashLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <HashLoader color="#36d7b7" size={60} />
    </div>
  );
};

export default Spinner;
