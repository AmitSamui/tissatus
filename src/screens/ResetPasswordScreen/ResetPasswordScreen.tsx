import React, { useState, createContext } from "react";
import EnterEmail from "./components/EnterEmail";
import EnterPassword from "./components/EnterPassword";
import VerifyOTP from "./components/VerifyOTP";
import "./ResetPasswordScreen.scss";

export const ResetPasswordContext = createContext<any>({} as any);

const ResetPasswordScreen: React.FC = () => {
  const [resetPasswordForm, setResetPasswordForm] = useState<UserSignIn>({
    email: "",
    password: "",
  });
  const [formState, setFormState] = useState<string>("EnterEmail");

  return (
    <ResetPasswordContext.Provider
      value={{
        form: [resetPasswordForm, setResetPasswordForm],
        state: [formState, setFormState],
      }}
    >
      <div className="container reset-password-page-container">
        <div className="wrapper reset-password-page-wrapper">
          {(formState === "EnterEmail" && <EnterEmail />) ||
            (formState === "EnterPassword" && <EnterPassword />) ||
            (formState === "VerifyOTP" && <VerifyOTP />)}
        </div>
      </div>
    </ResetPasswordContext.Provider>
  );
};

export default ResetPasswordScreen;
