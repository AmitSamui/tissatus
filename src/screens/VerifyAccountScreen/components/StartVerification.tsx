import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { toast } from "react-toastify";
import { SendUserOTP } from "../../../api/api";
import VerifyAccountImg from "../../../assets/verify-account.png";
import { override } from "../../../components/Loader/Loader";
import { VerifyAccountContext } from "../VerifyAccountScreen";

const StartVerification: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useContext(VerifyAccountContext);

  const [loading, setLoading] = useState<boolean>(false);

  //   const [detailsForm, setDetailsForm] = form;
  const [currentFormState, setCurrentFormState] = state;
  //   // console.log(detailsForm, currentFormState);

  const sendOtp = async () => {
    setLoading(true);
    const token = localStorage.getItem("UserAuthToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await SendUserOTP(config);
      localStorage.setItem("otp_token", data.otp.otp_token);
      setLoading(false);
      setCurrentFormState("VerifyAccount");
      toast.success(data.message);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="create-account-box">
      <div className="image-box">
        <img src={VerifyAccountImg} alt="" />
      </div>
      <div className="detail-box">
        <div className="details-title">
          <h3 className="title-26">Account Verification</h3>
          <p className="text-16 text-16-para">
            You have successfully registered in our events platform. To
            participate seamlessly in Espektro'23, please verify your account.
          </p>
        </div>
        <div className="details-action">
          {loading ? (
            <BounceLoader
              size={40}
              color="#4a7fd4"
              loading={loading}
              cssOverride={override}
              speedMultiplier={0.5}
            />
          ) : (
            <button className="btn btn-primary" onClick={() => sendOtp()}>
              Verify Account
            </button>
          )}
          {/* <div className="bottom-text">
            Already have an verified account?{" "}
            <span className="text-link" onClick={() => navigate("/login")}>
              Sign in
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default StartVerification;
