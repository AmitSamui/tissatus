import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { SendOTPForResetPassword } from "../../../api/api";
import Loader, { override } from "../../../components/Loader/Loader";
import { ResetPasswordContext } from "../ResetPasswordScreen";
import { toast } from "react-toastify";
import ResetPasswordFormSteps from "./ResetPasswordFormSteps";

const EnterPassword: React.FC = () => {
  const navigate = useNavigate();
  const { form, state } = useContext(ResetPasswordContext);

  const [detailsForm, setDetailsForm] = form;
  const [currentFormState, setCurrentFormState] = state;

  const [loading, setLoading] = useState<boolean>(false);

  const [initialPasswordShown, setInitialPasswordShown] =
    useState<boolean>(false);
  const [confirmPasswordShown, setConfirmPasswordShown] =
    useState<boolean>(false);
  const [initialPassword, setInitialPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVal, setPasswordVal] = useState<string>("");

  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");

  //   const isPasswordValid = (passwordVal: string) => {
  //     const UpperCaseRegex = /(?=.*?[A-Z])/;
  //     const LowerCaseRegex = /(?=.*?[a-z])/;
  //     const NumRegex = /(?=.*?[0-9])/;
  //     const SpecialCharRegex = /(?=.*?[#?!@$%^&*-])/;
  //     const passwordRegex =
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  //     if (passwordVal) {
  //       if (!passwordRegex.test(passwordVal)) {
  //         // if (passwordVal.length < 6) {
  //         //   setPasswordError("Password length must be 6");
  //         // } else
  //         if (!UpperCaseRegex.test(passwordVal)) {
  //           setPasswordError(
  //             "Password must contain at least one upper case letter"
  //           );
  //         } else if (!LowerCaseRegex.test(passwordVal)) {
  //           setPasswordError(
  //             "Password must contain at least one lower case letter"
  //           );
  //         } else if (!NumRegex.test(passwordVal)) {
  //           setPasswordError("Password must contain at least one number");
  //         } else if (!SpecialCharRegex.test(passwordVal)) {
  //           setPasswordError("Password must contain at least an special char");
  //         }
  //         return false;
  //       } else {
  //         setPasswordError("");
  //         return true;
  //       }
  //     } else setPasswordError("");
  //   };

  const matchPassword = (enteredPassword: string, finalPassword: string) => {
    // console.log(enteredPassword !== finalPassword);
    if (enteredPassword !== finalPassword) {
      setPasswordMatchError("Passwords didn't match");
    } else if (finalPassword === "") {
      setPasswordMatchError("Password can't be empty");
    } else {
      setPasswordMatchError("Passwords matched!");
      setDetailsForm({ ...detailsForm, password: finalPassword });
    }
  };

  const checkFormFields = () => {
    // console.log(detailsForm);
    if (detailsForm.password !== "") {
      resetPasswordSendOtp();
    } else {
      window.alert("Please enter your password.");
    }
  };

  const resetPasswordSendOtp = async () => {
    setLoading(true);
    try {
      const { data } = await SendOTPForResetPassword({
        email: detailsForm.email,
      });
      localStorage.setItem("otp_token", data.otp.otp_token);
      setLoading(false);
      setCurrentFormState("VerifyOTP");
      toast.success(data.message);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="details-info-box">
      <div className="details-info-title-bar">
        <h3 className="title-26">
          Reset your <span>Password</span>
        </h3>
        <span
          className="back-icon"
          onClick={() => setCurrentFormState("EnterEmail")}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </span>
      </div>
      <p className="text-16">Participate in Espektro Seamlessly!!</p>
      <h4 className="text-18">Create New Password</h4>
      <form className="details-info-form">
        <div className="form-detail">
          <label htmlFor="enterPassword">Enter Password</label>
          <div className="password-input-box">
            <input
              type={initialPasswordShown ? "text" : "password"}
              name="enterPassword"
              id="enterPassword"
              className="form_input"
              // placeholder="name"
              required
              autoComplete="off"
              // maxLength={6}
              value={initialPassword}
              onChange={(e) => {
                // setPasswordVal(e.target.value);
                // if (isPasswordValid(e.target.value)) {
                setInitialPassword(e.target.value);
                // }
              }}
            />
            <span className="password-validation-warning">{passwordError}</span>
            <span
              className="password_view_icon"
              onClick={() => setInitialPasswordShown(!initialPasswordShown)}
            >
              {initialPasswordShown ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </span>
          </div>
        </div>
        <div className="form-detail">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-box">
            <input
              type={confirmPasswordShown ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              className="form_input"
              // placeholder="name"
              required
              autoComplete="off"
              // maxLength={6}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                matchPassword(initialPassword, e.target.value);
              }}
            />
            <span
              className="password-validation-warning"
              style={{
                color:
                  passwordMatchError === "Passwords didn't matched"
                    ? "#ea4335"
                    : passwordMatchError === "Passwords matched!"
                    ? "#34a853"
                    : "",
              }}
            >
              {passwordMatchError}
            </span>
            <span
              className="password_view_icon"
              onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
            >
              {confirmPasswordShown ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </span>
          </div>
        </div>
      </form>
      <div className="details-info-action">
        <ResetPasswordFormSteps currentFormState={currentFormState} />
        {loading ? (
          <BounceLoader
            size={40}
            color="#4a7fd4"
            loading={loading}
            // cssOverride={override}
            speedMultiplier={0.5}
          />
        ) : (
          <button className="btn btn-primary" onClick={() => checkFormFields()}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default EnterPassword;
