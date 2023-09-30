import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../Layout/Layout";
import { ResetPasswordContext } from "../ResetPasswordScreen";
import ResetPasswordFormSteps from "./ResetPasswordFormSteps";

const EnterEmail: React.FC = () => {
  const navigate = useNavigate();
  const { form, state } = useContext(ResetPasswordContext);

  const [detailsForm, setDetailsForm] = form;
  const [currentFormState, setCurrentFormState] = state;

  const checkFormFields = () => {
    // console.log(detailsForm);
    if (detailsForm.email !== "") {
      if (validateEmail(detailsForm.email)) {
        setCurrentFormState("EnterPassword");
      } else {
        window.alert("Please enter a valid email address.");
      }
    } else {
      if (detailsForm.email === "") {
        window.alert("Please enter your email.");
      }
    }
  };

  return (
    <div className="details-info-box">
      <div className="details-info-title-bar">
        <h3 className="title-26">
          Reset your <span>Password</span>
        </h3>
        <span className="back-icon" onClick={() => navigate("/login")}>
          <i className="fa-solid fa-arrow-left"></i>
        </span>
      </div>
      <p className="text-16">Participate in Espektro Seamlessly!!</p>
      <h4 className="text-18">Registered Email</h4>
      <form className="details-info-form">
        <div className="form-detail">
          <label htmlFor="email">Enter Your Registered E-mail</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form_input"
            placeholder="email"
            required
            autoComplete="off"
            value={detailsForm.email}
            onChange={(e) =>
              setDetailsForm({ ...detailsForm, email: e.target.value })
            }
          />
        </div>
      </form>
      <div className="details-info-action">
        <ResetPasswordFormSteps currentFormState={currentFormState} />
        <button className="btn btn-primary" onClick={() => checkFormFields()}>
          Next
        </button>
      </div>
    </div>
  );
};

export default EnterEmail;
