import React, { useEffect, useState } from "react";
import "./LoginScreen.scss";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../Layout/Layout";
import {
  SignInUser,
  updateToken,
  UserProfile,
  UserProfileWithConfig,
} from "../../api/api";
import Loader, { override } from "../../components/Loader/Loader";
import { BounceLoader } from "react-spinners";
import PopUp from "../../components/PopUp/PopUp";
import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [userLoginData, setUserLoginData] = useState<UserSignIn>({
    email: "",
    password: "",
  });
  const [passWordShown, setPasswordShown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<PopUpProps>({
    type: "Success",
    message: "",
    show: false,
  });
  const [error, setError] = useState<PopUpProps>({
    type: "Error",
    message: "",
    show: false,
  });

  const fetchUserProfile = async (config: any) => {
    try {
      const { data } = await UserProfileWithConfig(config);
      // window.location.reload();
      // if(data.user.verified === false){
      //   toast.error("Please verify your email address to continue.", {
      //     position: "top-right",
      //   });
      //   navigate("/verify-account", { state: data });
      // }else{
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => {
        setLoading(false);
        navigate("/", { state: data.user });
      }, 3000);
      toast.success("Successfully logged in");
      //}
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  const checkFormFields = () => {
    // console.log(userLoginData);
    if (userLoginData.email !== "" && userLoginData.password !== "") {
      if (validateEmail(userLoginData.email)) {
        loginUser();
      } else {
        window.alert("Please enter a valid email address.");
      }
    } else {
      if (userLoginData.email === "") {
        window.alert("Please enter your email.");
      } else if (userLoginData.password === "") {
        window.alert("Please enter your password.");
      }
    }
  };

  const loginUser = async () => {
    setLoading(true);
    try {
      const { data } = await SignInUser(userLoginData);
      localStorage.setItem("UserAuthToken", data.auth_token);
      updateToken(data.auth_token);
      const config = {
        headers: {
          Authorization: `Bearer ${data.auth_token}`,
        },
      };
      fetchUserProfile(config);
      //toast.success(data.message);
    } catch (error: any) {
      // console.log(error);
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="container login-page-container">
      <div className="wrapper login-page-wrapper">
        <div className="details-info-box" style={{ maxWidth: "350px" }}>
          <div className="details-info-title-bar">
            <h3 className="title-26">
              Login to your <span>Account</span>
            </h3>
            <span className="back-icon" onClick={() => navigate("/")}>
              <i className="fa-solid fa-arrow-left"></i>
            </span>
          </div>
          <p className="text-16">Participate in Espektro Seamlessly!!</p>
          <form className="details-info-form">
            <div className="form-detail" style={{ gridColumn: "1 / 3" }}>
              <label htmlFor="email">Enter Your E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form_input"
                placeholder="email"
                required
                autoComplete="off"
                value={userLoginData.email}
                onChange={(e) =>
                  setUserLoginData({ ...userLoginData, email: e.target.value })
                }
              />
            </div>
            <div className="form-detail" style={{ gridColumn: "1 / 3" }}>
              <label htmlFor="password">Enter Your Password</label>
              <div className="password-input-box">
                <input
                  type={passWordShown ? "text" : "password"}
                  name="password"
                  id="password"
                  className="form_input"
                  placeholder="password"
                  required
                  autoComplete="off"
                  value={userLoginData.password}
                  onChange={(e) => {
                    setUserLoginData({
                      ...userLoginData,
                      password: e.target.value,
                    });
                  }}
                />
                <div
                  className="bottom-text"
                  style={{
                    textAlign: "left",
                    marginTop: "0.5rem",
                    position: "absolute",
                    // fontSize: "10px",
                  }}
                >
                  Forgot password?{" "}
                  <span
                    className="text-link"
                    onClick={() => navigate("/reset-password")}
                  >
                    Reset Password
                  </span>
                </div>
                <span
                  className="password_view_icon"
                  onClick={() => setPasswordShown(!passWordShown)}
                >
                  {passWordShown ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </span>
              </div>
            </div>
          </form>
          {loading ? (
            <BounceLoader
              size={40}
              color="#4a7fd4"
              loading={loading}
              cssOverride={override}
              speedMultiplier={0.5}
            />
          ) : (
            <div className="details-action details-action-login">
              <button
                className="btn btn-primary"
                onClick={() => checkFormFields()}
              >
                Login
              </button>
              <div className="bottom-text">
                Don't have an account?{" "}
                <span
                  className="text-link"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <PopUp
        type={success.type}
        message={success.message}
        show={success.show}
      />
      <PopUp type={error.type} message={error.response.data.message} show={error.show} /> */}
    </div>
  );
};

export default LoginPage;
