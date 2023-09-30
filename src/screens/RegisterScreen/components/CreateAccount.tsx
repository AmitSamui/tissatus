import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import TeamImg from "../../../assets/espektro-logo-nobg.png";
import { UserSignUpContext } from "../RegisterPage";

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { form, state } = useContext(UserSignUpContext);

  const [detailsForm, setDetailsForm] = form;
  const [currentFormState, setCurrentFormState] = state;
  //   // console.log(detailsForm, currentFormState);
  return (
    <div className="create-account-box">
      <div className="image-box">
        <img src={TeamImg} alt="" />
      </div>
      <div className="detail-box">
        <div className="details-title">
          <h3 className="title-26">Welcome</h3>
          <p className="text-16 text-16-para">
            Welcome to Espektro 2023. Espektro is the annual techno cum
            management fest of Kalyani Government Engineering College. Please
            create your account to book your tickets and register for events.
            <br />
          </p>
        </div>
        <div className="details-action">
          <button
            className="btn btn-primary"
            onClick={() => setCurrentFormState("PersonalInfo")}
          >
            Create Account
          </button>
          <div className="bottom-text">
            Already have an account?{" "}
            <span className="text-link" onClick={() => navigate("/login")}>
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
