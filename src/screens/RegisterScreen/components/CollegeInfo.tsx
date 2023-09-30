import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserSignUpContext } from "../RegisterPage";
import FormSteps from "./FormSteps";
import { regexForText } from "../../Layout/Layout";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const CollegeInfo: React.FC = () => {
  const navigate = useNavigate();
  const { form, state } = useContext(UserSignUpContext);

  const [detailsForm, setDetailsForm] = form;
  const [currentFormState, setCurrentFormState] = state;

  const checkFormFields = () => {
    // console.log(detailsForm);
    if (
      detailsForm.college !== "" &&
      detailsForm.degree !== "" &&
      detailsForm.stream !== "" &&
      detailsForm.year !== ""
    ) {
      setCurrentFormState("CreatePassword");
    } else {
      if (detailsForm.college === "") {
        window.alert("Please enter your college.");
      } else if (detailsForm.degree === "") {
        window.alert("Please select your degree.");
      } else if (detailsForm.stream === "") {
        window.alert("Please select your stream.");
      } else if (detailsForm.year === "") {
        window.alert("Please select your year.");
      }
    }
  };

  return (
    <div className="details-info-box">
      <div className="details-info-title-bar">
        <h3 className="title-26">
          Create your <span>Account</span>
        </h3>
        <span
          className="back-icon"
          onClick={() => setCurrentFormState("PersonalInfo")}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </span>
      </div>
      <p className="text-16">Participate in Espektro Seamlessly!!</p>
      <h4 className="text-18">College Information</h4>
      <form className="details-info-form">
        <div className="form-detail full-form-width">
          <label htmlFor="college">
            Enter Your College<span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="college"
            id="college"
            className="form_input"
            placeholder="eg: Kalyani Government Engineering College"
            required
            autoComplete="off"
            value={detailsForm.college}
            onChange={(e) => {
              if (regexForText(e))
                setDetailsForm({ ...detailsForm, college: e.target.value });
            }}
          />
          <div
            className="bottom-text"
            style={{ textAlign: "left", opacity: "0.5" }}
          >
            <i className="fa-solid fa-circle-exclamation"></i> Please carry your
            college ID card on the day of the event or else you will be
            disqualified.
          </div>
        </div>
        <div className="form-detail">
          <label htmlFor="degree">
            Degree<span className="text-red">*</span>
          </label>
          <select
            name="degree"
            id="degree"
            className="form_input"
            required
            value={detailsForm.degree}
            onChange={(e) =>
              setDetailsForm({ ...detailsForm, degree: e.target.value })
            }
          >
            <option value="" hidden selected>
              Select degree
            </option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.Sc">B.Sc</option>
            <option value="BA">BA</option>
            <option value="MCA">MCA</option>
            <option value="M.Sc">M.Sc</option>
            <option value="MA">MA</option>
            <option value="M.Tech">M.Tech</option>
            <option value="PhD">PhD</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-detail">
          <label htmlFor="stream">
            Stream<span className="text-red">*</span>
          </label>
          <select
            name="stream"
            id="stream"
            className="form_input"
            required
            value={detailsForm.stream}
            onChange={(e) =>
              setDetailsForm({ ...detailsForm, stream: e.target.value })
            }
          >
            <option value="" hidden selected>
              Select stream
            </option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EE">EE</option>
            <option value="ME">ME</option>
            <option value="Civil">Civil</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-detail">
          <label htmlFor="year">
            Year<span className="text-red">*</span>
          </label>
          <select
            name="year"
            id="year"
            className="form_input"
            required
            value={detailsForm.year}
            onChange={(e) =>
              setDetailsForm({ ...detailsForm, year: e.target.value })
            }
          >
            <option value="" hidden selected>
              Select year
            </option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
            <option value="5">5th</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>
      </form>
      <div className="details-info-action">
        <FormSteps currentFormState={currentFormState} />
        <button className="btn btn-primary" onClick={() => checkFormFields()}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CollegeInfo;
