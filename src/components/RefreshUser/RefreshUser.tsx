import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserProfile } from "../../api/api";
import "./RefreshUser.scss";

const RefreshUser: React.FC<any> = ({ setUser }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data } = await UserProfile();
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  return (
    <span
      className={`${loading ? "refresh-icon loading" : "refresh-icon"}`}
      onClick={() => fetchUserProfile()}
    >
      <i className="fa-solid fa-arrows-rotate"></i>
    </span>
  );
};

export default RefreshUser;
