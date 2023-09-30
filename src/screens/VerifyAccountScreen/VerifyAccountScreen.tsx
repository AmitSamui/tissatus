import React, { useState, createContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserFromlocalStorage } from "../../api/api";
import StartVerification from "./components/StartVerification";
import VerifyAccount from "./components/VerifyAccount";
import "./VerifyAccountScreen.scss";

export const VerifyAccountContext = createContext<any>({} as any);

const VerifyAccountScreen: React.FC = () => {
  //   const [resetPasswordForm, setResetPasswordForm] = useState<UserSignIn>({
  //     email: "",
  //     password: "",
  //   });
  const navigate = useNavigate();
  const [formState, setFormState] = useState<string>("StartVerification");

  const token = localStorage.getItem("UserAuthToken");

  useEffect(() => {
    if (token) {
      const userData = getUserFromlocalStorage();
      if (userData?.verified) {
        navigate("/");
      }
    }
  }, [token]);

  return (
    <VerifyAccountContext.Provider
      value={{
        // form: [resetPasswordForm, setResetPasswordForm],
        state: [formState, setFormState],
      }}
    >
      <div className="container verify-account-page-container">
        <div className="wrapper verify-account-page-wrapper">
          {(formState === "StartVerification" && <StartVerification />) ||
            (formState === "VerifyAccount" && <VerifyAccount />)}
        </div>
      </div>
    </VerifyAccountContext.Provider>
  );
};

export default VerifyAccountScreen;
