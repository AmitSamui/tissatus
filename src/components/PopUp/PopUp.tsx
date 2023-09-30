import React, { useEffect, useState } from "react";
import "./PopUp.scss";

const PopUp: React.FC<PopUpProps> = ({ type, message, show }) => {
  const [popUpShown, setPopUpShown] = useState<boolean>(true);

  useEffect(() => {
    if (popUpShown) {
      setTimeout(() => setPopUpShown(false), 3000);
    }
  }, [popUpShown]);

  return (
    <div className={`pop-up-box ${popUpShown ? "shown" : "hidden"}`}>
      <div className="message-text">
        <span className="pop-up-icon type-icon">
          {type === "Success" ? (
            <i
              className="fa-solid fa-circle-check"
              style={{ color: "#4285f4" }}
            ></i>
          ) : type === "Error" ? (
            <i
              className="fa-solid fa-circle-exclamation"
              style={{ color: "#ea4335" }}
            ></i>
          ) : null}
        </span>
        <p>{"Enter your details"}</p>
      </div>
      <span className="pop-up-icon close-icon">
        <i
          className="fa-solid fa-xmark"
          onClick={() => setPopUpShown(!popUpShown)}
        ></i>
      </span>
    </div>
  );
};

export default PopUp;
