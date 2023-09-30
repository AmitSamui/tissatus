import React, { useState, useContext } from "react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import {
  SendOTPForResetPassword,
  VerifyOTPForResetPassword,
} from "../../../api/api";
import Loader, { override } from "../../../components/Loader/Loader";
import { ResetPasswordContext } from "../ResetPasswordScreen";
import { toast } from "react-toastify";
import ResetPasswordFormSteps from "./ResetPasswordFormSteps";

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const { form, state } = useContext(ResetPasswordContext);

  const otp_token = localStorage.getItem("otp_token") || "";
  const [loading, setLoading] = useState<boolean>(false);
  const [resendOtpLoading, setResendOtpLoading] = useState<boolean>(false);

  const [detailsForm, setDetailsForm] = form;
  const [currentFormState, setCurrentFormState] = state;

  const [otp, setOtp] = useState<string>("");

  const checkFormFields = () => {
    if (otp !== "") {
      resetPasswordVerifyOtp(otp);
    } else {
      window.alert("Please enter your OTP.");
    }
  };

  const resendOtp = async () => {
    setOtp("");
    setResendOtpLoading(true);
    try {
      const { data } = await SendOTPForResetPassword({
        email: detailsForm.email,
      });
      localStorage.setItem("otp_token", data.otp.otp_token);
      setResendOtpLoading(false);
      toast.success(data.message);
    } catch (error: any) {
      setResendOtpLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  const resetPasswordVerifyOtp = async (otp: string) => {
    setLoading(true);
    try {
      const { data } = await VerifyOTPForResetPassword({
        otp: otp,
        otp_token: otp_token,
        email: detailsForm.email,
        password: detailsForm.password,
      });
      setOtp("");
      setTimeout(() => {
        setLoading(false);
        localStorage.clear();
        navigate("/login");
      }, 1000);
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
        {/* <span
          className="back-icon"
          onClick={() => setCurrentFormState("CreatePassword")}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </span> */}
      </div>
      <p className="text-16">Participate in Espektro Seamlessly!!</p>
      <h4 className="text-18">OTP Verification</h4>
      {resendOtpLoading ? (
        <Loader loading={resendOtpLoading} />
      ) : (
        <form className="details-info-form">
          <div className="form-detail">
            <label htmlFor="name">Enter OTP</label>
            <OtpInput
              value={otp}
              onChange={(otpVal: any) => {
                setOtp(otpVal);
              }}
              numInputs={4}
              isInputNum={true}
              separator={<span>{"  "}</span>}
              inputStyle={{
                width: "2.5rem",
                height: "2.5rem",
                fontSize: "1rem",
                borderRadius: 10,
                backgroundColor: "#1c1c1e",
                border: "2px solid #1c1c1e",
                outline: "none",
                color: "#4a7fd4",
              }}
              className="otp_input"
            />
            <div
              className="bottom-text"
              style={{ textAlign: "left", fontSize: "11px" }}
            >
              OTP not sent?{" "}
              <span
                className="text-link"
                onClick={() => {
                  resendOtp();
                }}
              >
                Resend OTP
              </span>
            </div>
          </div>
        </form>
      )}
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
            Verify OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;
