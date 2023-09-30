import React from "react";

const FormSteps: React.FC<any> = ({ currentFormState }) => {
  return (
    <div className="form-steps">
      <span
        className={`step-item ${
          currentFormState === "PersonalInfo" ? "active" : ""
        }`}
      ></span>
      <span
        className={`step-item ${
          currentFormState === "CollegeInfo" ? "active" : ""
        }`}
      ></span>
      <span
        className={`step-item ${
          currentFormState === "CreatePassword" ? "active" : ""
        }`}
      ></span>
      <span
        className={`step-item ${
          currentFormState === "OtpVerification" ? "active" : ""
        }`}
      ></span>
    </div>
  );
};

export default FormSteps;
