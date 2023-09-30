import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NoProfileImg from "../../assets/no-profile-pic.png";
import CoinImg from "../../assets/coin.png";
import QRImg from "../../assets/qr.png";
import BlueQRImg from "../../assets/blue-qr.png";
import UserInfoImg from "../../assets/user-info.png";
import WalletImg from "../../assets/wallet.png";
import TicketImg from "../../assets/ticket.png";
import LogoutImg from "../../assets/logout.png";
import EspektroLogo from "../../assets/espektro-small-logo.svg";
import "./Navbar.scss";
import {
  getUserFromlocalStorage,
  updateToken,
  UserProfile,
  UserProfileWithConfig,
} from "../../api/api";
import RefreshUser from "../RefreshUser/RefreshUser";
import { toast } from "react-toastify";
import FullScreenLoader from "../FullScreenLoader/FullScreenLoader";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("UserAuthToken");
  // const user = JSON.parse(localStorage.getItem("user") || "");
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState<any>({});

  const [fullScreenLoading, setFullScreenLoading] = useState<boolean>(false);

  const logout = () => {
    const yes = window.confirm("Do you want to log out?");
    if (yes) {
      localStorage.clear();
      updateToken(token);
      navigate("/login");
    }
  };

  const loadUserProfile = async (config: any) => {
    try {
      const { data } = await UserProfileWithConfig(config);
      // console.log(data.user);
      // localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setTimeout(() => {
        setFullScreenLoading(false);
      }, 2000);
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    setAuth(token !== null ? true : false);
    if (token) {
      setFullScreenLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      loadUserProfile(config);
      // const userData = getUserFromlocalStorage();
      // // console.log(userData);
      // if (userData) {
      //   setUser(userData);
      // } else {
      //   window.location.reload();
      // }
    }
  }, [token]);

  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  return (
    <header className="navbar-section sticky">
      <div className="navbar-container container">
        {/* <div className="page-wrapper wrapper"> */}
        <div className="nav-wrapper wrapper">
          {fullScreenLoading ? (
            <FullScreenLoader />
          ) : (
            <nav className="navbar">
              <div className="logo" onClick={() => navigate("/")}>
                <img src={EspektroLogo} alt="Company Logo" />
                {/* <h1>IT</h1> */}
              </div>
              {token !== null && user ? (
                <div className="nav-actions">
                  <div className="user-profile">
                    <img
                      src={user?.profileImageUrl}
                      className="user-img"
                      alt=""
                    />
                    <div className="details">
                      <h4>{user?.name}</h4>
                      <div className="coin-details">
                        <span>{user?.coins}</span>
                        <img src={CoinImg} className="coin-icon" alt="" />
                        <span>coins</span>
                      </div>
                    </div>
                  </div>
                  <div
                    // className={`menu-toggle ${mobileNavOpen ? "is-active" : ""}`}
                    className="menu-toggle"
                    id="mobile-menu"
                    onClick={() => setMobileNavOpen(true)}
                  >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                  </div>
                  <div
                    className={`menu-toggle ${
                      mobileNavOpen ? "is-active" : ""
                    }`}
                    id="desktop-menu"
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                  </div>
                </div>
              ) : (
                <div className="nav-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
              )}
              <div
                className={`nav-sidebar desktop-sidebar ${
                  mobileNavOpen ? "nav-sidebar-opened" : ""
                }`}
              >
                <div className="user-profile-box">
                  <div className="top-title-bar">
                    <h4 className="text-18">My Profile</h4>
                    {/* <div className="img-icon">
                    <img src={BlueQRImg} alt="" />
                  </div> */}
                    <i
                      className="fa-solid fa-xmark"
                      onClick={() => setMobileNavOpen(false)}
                    ></i>
                  </div>
                  <div className="user-details">
                    <img src={user?.profileImageUrl} alt="" />
                    <div className="text-details">
                      <p className="user-name">
                        {user?.name} <RefreshUser setUser={setUser} />
                      </p>
                      <p>
                        <span className="text-purple">{user?.espektroId}</span>{" "}
                        (Espektro ID)
                      </p>
                      {/* <p>{user?.college}</p> */}
                    </div>
                  </div>
                </div>
                <ul
                  className={`nav ${
                    mobileNavOpen ? "nav-ul-items-opened " : ""
                  } no-search`}
                >
                  <li
                    className={`nav-item ${
                      location.pathname === "/events" ? "active" : ""
                    }`}
                    onClick={() => {
                      // setMobileNavOpen(false);
                      navigate("/");
                    }}
                  >
                    <div className="nav-item-details">
                      <i className="fa-solid fa-house"></i>
                      <span>Home</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/my-qr-code" ? "active" : ""
                    }`}
                    onClick={() => {
                      // setMobileNavOpen(false);
                      navigate("/my-qr-code");
                    }}
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={QRImg} alt="" />
                      </div>
                      <span>My QR Code</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/my-info" ? "active" : ""
                    }`}
                    onClick={() => {
                      // setMobileNavOpen(false);
                      navigate("/my-info");
                    }}
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={UserInfoImg} alt="" />
                      </div>
                      <span>Personal Information</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/my-wallet" ? "active" : ""
                    }`}
                    onClick={() => {
                      // setMobileNavOpen(false);
                      navigate("/my-wallet");
                    }}
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={WalletImg} alt="" />
                      </div>
                      <span>My Wallet</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/my-tickets" ? "active" : ""
                    }`}
                    onClick={() => {
                      // setMobileNavOpen(false);
                      navigate("/my-tickets");
                    }}
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={TicketImg} alt="" />
                      </div>
                      <span>My Tickets</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    onClick={() => {
                      // setMobileNavOpen(false);
                      logout();
                    }}
                    className="nav-item"
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={LogoutImg} alt="" />
                      </div>
                      <span>Logout</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div
                className={`nav-sidebar mobile-sidebar ${
                  mobileNavOpen ? "nav-sidebar-opened" : ""
                }`}
              >
                <div className="user-profile-box">
                  <div className="top-title-bar">
                    <h4 className="text-18">My Profile</h4>
                    {/* <div className="img-icon">
                    <img src={BlueQRImg} alt="" />
                  </div> */}
                    <i
                      className="fa-solid fa-xmark"
                      onClick={() => setMobileNavOpen(false)}
                    ></i>
                  </div>
                  <div className="user-details">
                    <img src={user?.profileImageUrl} alt="" />
                    <div className="text-details">
                      <p className="user-name">
                        {user?.name} <RefreshUser setUser={setUser} />
                      </p>
                      <p>
                        <span className="text-purple">{user?.espektroId}</span>{" "}
                        (Espektro ID)
                      </p>
                    </div>
                  </div>
                </div>
                <ul
                  className={`nav ${
                    mobileNavOpen ? "nav-ul-items-opened " : ""
                  } no-search`}
                >
                  <li
                    className={`nav-item ${
                      location.pathname === "/events" ? "active" : ""
                    }`}
                    onClick={() => {
                      setMobileNavOpen(false);
                      navigate("/");
                    }}
                  >
                    <div className="nav-item-details">
                      <i className="fa-solid fa-house"></i>
                      <span>Home</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/my-qr-code" ? "active" : ""
                    }`}
                    onClick={() => {
                      setMobileNavOpen(false);
                      navigate("/my-qr-code");
                    }}
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={QRImg} alt="" />
                      </div>
                      <span>My QR Code</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/my-info" ? "active" : ""
                    }`}
                    onClick={() => {
                      setMobileNavOpen(false);
                      navigate("/my-info");
                    }}
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={UserInfoImg} alt="" />
                      </div>
                      <span>Personal Information</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/my-wallet" ? "active" : ""
                    }`}
                    onClick={() => {
                      setMobileNavOpen(false);
                      navigate("/my-wallet");
                    }}
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={WalletImg} alt="" />
                      </div>
                      <span>My Wallet</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/my-tickets" ? "active" : ""
                    }`}
                    onClick={() => {
                      setMobileNavOpen(false);
                      navigate("/my-tickets");
                    }}
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={TicketImg} alt="" />
                      </div>
                      <span>My Tickets</span>
                    </div>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li
                    onClick={() => {
                      setMobileNavOpen(false);
                      logout();
                    }}
                    className="nav-item"
                  >
                    <div className="nav-item-details">
                      <div className="nav-item-img-icon">
                        <img src={LogoutImg} alt="" />
                      </div>
                      <span>Logout</span>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          )}
        </div>
        {/* </div> */}
      </div>
    </header>
  );
};

export default Navbar;
