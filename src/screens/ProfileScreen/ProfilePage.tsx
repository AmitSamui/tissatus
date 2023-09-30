import React, { useState, useEffect } from "react";
import { getUserFromlocalStorage, UserProfile } from "../../api/api";
import Loader from "../../components/Loader/Loader";
import UserInfo from "./components/UserInfo/UserInfo";
import UserQR from "./components/UserQR/UserQR";
import UserTickets from "./components/UserTickets/UserTickets";
import UserWallet from "./components/UserWallet/UserWallet";

const ProfilePage: React.FC = () => {
  const [state, setState] = useState<string>("UserQR");
  const [loading, setLoading] = useState<boolean>(false);

  // const token = localStorage.getItem("UserAuthToken");
  const [user, setUser] = useState<any>({});

  // const fetchUserProfile = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await UserProfile();
  //     setUser(data.user);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     window.alert(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserProfile();
  // }, []);

  // useEffect(() => {
  //   if (token) {
  //     const userData = getUserFromlocalStorage();
  //     if (userData) {
  //       setUser(userData);
  //     }
  //   }
  // }, [token]);
  return (
    <div className="container profile-page-container">
      <div className="wrapper profile-page-wrapper">
        {loading ? (
          <Loader />
        ) : (
          (state === "UserQR" && <UserQR user={user} />) ||
          (state === "UserInfo" && <UserInfo user={user} />) ||
          (state === "UserWallet" && <UserWallet user={user} />) ||
          (state === "UserTickets" && <UserTickets user={user} />)
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
