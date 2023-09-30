import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import {
  SendUserOTP,
  SignUpUser,
  updateToken,
  UserProfileWithConfig,
} from "../../../api/api";
import Loader, { override } from "../../../components/Loader/Loader";
import { UserSignUpContext } from "../RegisterPage";
import FormSteps from "./FormSteps";
import { toast } from "react-toastify";

const CreatePassword: React.FC = () => {
  const navigate = useNavigate();
  const { form, state, referral } = useContext(UserSignUpContext);

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

  const fetchUserProfile = async (config: any) => {
    try {
      const { data } = await UserProfileWithConfig(config);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(
        "You have successfully registered. Now verify your account."
      );
      sendOtp(config);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  const isPasswordValid = (passwordVal: string) => {
    const UpperCaseRegex = /(?=.*?[A-Z])/;
    const LowerCaseRegex = /(?=.*?[a-z])/;
    const NumRegex = /(?=.*?[0-9])/;
    const SpecialCharRegex = /(?=.*?[#?!@$%^&*-])/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (passwordVal) {
      if (!passwordRegex.test(passwordVal)) {
        // if (passwordVal.length < 6) {
        //   setPasswordError("Password length must be 6");
        // } else
        if (!UpperCaseRegex.test(passwordVal)) {
          setPasswordError(
            "Password must contain at least one upper case letter"
          );
        } else if (!LowerCaseRegex.test(passwordVal)) {
          setPasswordError(
            "Password must contain at least one lower case letter"
          );
        } else if (!NumRegex.test(passwordVal)) {
          setPasswordError("Password must contain at least one number");
        } else if (!SpecialCharRegex.test(passwordVal)) {
          setPasswordError("Password must contain at least an special char");
        }
        return false;
      } else {
        setPasswordError("");
        return true;
      }
    } else setPasswordError("");
  };

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
      registerUser();
    } else {
      window.alert("Please enter your password.");
    }
  };

  const sendOtp = async (config: any) => {
    try {
      const { data } = await SendUserOTP(config);
      localStorage.setItem("otp_token", data.otp.otp_token);
      setLoading(false);
      setCurrentFormState("OtpVerification");
      toast.success(data.message);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  const registerUser = async () => {
    setLoading(true);
    let signUpData: UserSignUp;
    if (detailsForm.profileImageUrl !== "") {
      signUpData = {
        name: detailsForm.name,
        email: detailsForm.email,
        profileImageUrl: detailsForm.profileImageUrl,
        phone: detailsForm.phone,
        password: detailsForm.password,
        gender: detailsForm.gender,
        dateOfBirth: detailsForm.dateOfBirth,
        college: detailsForm.college,
        degree: detailsForm.degree,
        year: detailsForm.year,
        stream: detailsForm.stream,
        rcode: detailsForm.referralcode,
      };
    } else {
      signUpData = {
        name: detailsForm.name,
        email: detailsForm.email,
        phone: detailsForm.phone,
        password: detailsForm.password,
        gender: detailsForm.gender,
        dateOfBirth: detailsForm.dateOfBirth,
        college: detailsForm.college,
        degree: detailsForm.degree,
        year: detailsForm.year,
        stream: detailsForm.stream,
        rcode: detailsForm.referralcode,
      };
    }
    try {
      const { data } = await SignUpUser(signUpData);
      //   // console.log(data.auth_token);
      localStorage.setItem("UserAuthToken", data.auth_token);
      updateToken(data.auth_token);
      const config = {
        headers: {
          Authorization: `Bearer ${data.auth_token}`,
        },
      };
      fetchUserProfile(config);
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
          Create your <span>Account</span>
        </h3>
        <span
          className="back-icon"
          onClick={() => setCurrentFormState("CollegeInfo")}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </span>
      </div>
      <p className="text-16">Participate in Espektro Seamlessly!!</p>
      <h4 className="text-18">Create Password</h4>
      <form className="details-info-form">
        <div className="form-detail">
          <label htmlFor="enterPassword">
            Enter Password<span className="text-red">*</span>
          </label>
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
          <label htmlFor="confirmPassword">
            Confirm Password<span className="text-red">*</span>
          </label>
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
        <FormSteps currentFormState={currentFormState} />
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

export default CreatePassword;
