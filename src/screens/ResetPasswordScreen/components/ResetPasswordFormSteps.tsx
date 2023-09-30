import React from "react";

const ResetPasswordFormSteps: React.FC<any> = ({ currentFormState }) => {
  return (
    <div className="form-steps">
      <span
        className={`step-item ${
          currentFormState === "EnterEmail" ? "active" : ""
        }`}
      ></span>
      <span
        className={`step-item ${
          currentFormState === "EnterPassword" ? "active" : ""
        }`}
      ></span>
      <span
        className={`step-item ${
          currentFormState === "VerifyOtp" ? "active" : ""
        }`}
      ></span>
    </div>
  );
};

export default ResetPasswordFormSteps;
