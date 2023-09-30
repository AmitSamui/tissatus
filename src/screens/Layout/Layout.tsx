import React, { createContext, useEffect, useState } from "react";
import "./Layout.scss";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/Footer/Footer";
import { updateToken, UserProfile } from "../../api/api";
import FullScreenLoader from "../../components/FullScreenLoader/FullScreenLoader";

export const validateImgSize = (file: File) => {
  if (file.size < 5120000) {
    return true;
  } else {
    return false;
  }
};

export const regexForText = (e: any) => {
  const re = /^[A-Za-z\s]+$/;
  if (e.target.value === "" || re.test(e.target.value)) return true;

  return false;
};

export const regexForNums = (e: any) => {
  const re = /^[0-9\b\s]+$/;
  if (e.target.value === "" || re.test(e.target.value)) return true;

  return false;
};

export const validateEmail = (email: string) => {
  const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (regexForEmail.test(email)) {
    return true;
  }
  return false;
};

export const validateEventPrice = (user: any, event: any) => {
  let kgecNames: Array<String> = [
    "kalyani government engineering college",
    "Kalyani Government Engineering college, kalyani",
    "kgec",
    "kalyani govt. engineering college",
    "kalyani govt. engg. college",
  ];
  // debugger;
  let toPayForEvent = 0;
  if (kgecNames.includes(user?.college?.toLowerCase().trim())) {
    toPayForEvent = !event?.eventPriceForKGEC ? 0 : event?.eventPriceForKGEC;
  } else {
    toPayForEvent = event?.eventPrice;
  }

  return toPayForEvent?.toString();
};

export const ScrollPageToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const LayoutContext = createContext<any>({} as any);

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [layoutLoading, setLayoutLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("UserAuthToken");
    updateToken(token);
    if (token === null) {
      if (
        location.pathname.includes(
          "/login" || "/register" || "/events" || "/reset-password"
        ) === false
      ) {
        if (
          location.pathname.includes("/events") ||
          location.pathname === "/" ||
          location.pathname === "/register"
        ) {
          return;
        } else {
          navigate("/login");
        }
      }
    }
  }, []);

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, [location.pathname]);

  return (
    <LayoutContext.Provider
      value={{ pageLoading: [layoutLoading, setLayoutLoading] }}
    >
      {/* {layoutLoading ? (
        <FullScreenLoader />
      ) : ( */}
      <div className="layout-container">
        {location.pathname === "/register" ||
        location.pathname === "/login" ||
        location.pathname === "/reset-password" ||
        location.pathname === "/verify-account" ? null : (
          <Navbar />
        )}
        <div
          className="contents"
          style={{
            marginTop:
              location.pathname === "/register" ||
              location.pathname === "/login" ||
              location.pathname === "/reset-password" ||
              location.pathname === "/verify-account"
                ? "0px"
                : "100px",
          }}
        >
          <Outlet />
          {location.pathname === "/register" ||
          location.pathname === "/login" ||
          location.pathname === "/reset-password" ||
          location.pathname === "/verify-account" ? null : (
            <Footer />
          )}
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </div>
      {/* )} */}
    </LayoutContext.Provider>
  );
};

export default Layout;
