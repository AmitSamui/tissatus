import React, { CSSProperties } from "react";
import { BounceLoader } from "react-spinners";

export const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const Loader: React.FC<any> = ({ loadingState }) => {
  return (
    <div
      className="bounce-loader-container"
      style={{
        minHeight: "200px",
        display: "grid",
        placeContent: "center",
      }}
    >
      <div className="bounce-loader">
        <BounceLoader
          size={40}
          color="#4a7fd4"
          loading={loadingState}
          cssOverride={override}
          speedMultiplier={0.5}
        />
      </div>
    </div>
  );
};

export default Loader;
