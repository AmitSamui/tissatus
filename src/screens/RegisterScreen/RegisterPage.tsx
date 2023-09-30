import React, { useContext, useState, useEffect, createContext } from "react";
import { useParams } from "react-router-dom";
import CollegeInfo from "./components/CollegeInfo";
import CreateAccount from "./components/CreateAccount";
import CreatePassword from "./components/CreatePassword";
import OtpVerification from "./components/OtpVerification";
import PersonalInfo from "./components/PersonalInfo";
import "./RegisterScreen.scss";

export const UserSignUpContext = createContext<any>({} as any);

const RegisterPage: React.FC = () => {
  const params = useParams();
  const [signUpForm, setSignUpForm] = useState<UserSignUp>({
    name: "",
    email: "",
    profileImageUrl: "",
    phone: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    college: "Kalyani Government Engineering College",
    degree: "",
    year: "",
    stream: "",
    referralcode: "",
  });
  const [formState, setFormState] = useState<string>("CreateAccount");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralcode = urlParams.get("referralcode");
    if (referralcode) {
      // console.log("referral code found");
      setSignUpForm({ ...signUpForm, referralcode: referralcode });
    }
    localStorage.clear();
  }, []);

  return (
    <UserSignUpContext.Provider
      value={{
        form: [signUpForm, setSignUpForm],
        state: [formState, setFormState],
      }}
    >
      <div className="container register-page-container">
        <div className="wrapper register-page-wrapper">
          {(formState === "CreateAccount" && <CreateAccount />) ||
            (formState === "PersonalInfo" && <PersonalInfo />) ||
            (formState === "CollegeInfo" && <CollegeInfo />) ||
            (formState === "CreatePassword" && <CreatePassword />) ||
            (formState === "OtpVerification" && <OtpVerification />)}
        </div>
      </div>
    </UserSignUpContext.Provider>
  );
};

export default RegisterPage;
