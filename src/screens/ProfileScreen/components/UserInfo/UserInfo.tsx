import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getUserFromlocalStorage,
  UserProfile,
  UserProfileWithConfig,
} from "../../../../api/api";
import Loader from "../../../../components/Loader/Loader";

import { regexForNums, regexForText } from "../../../Layout/Layout";
import "./UserInfo.scss";

const UserInfo: React.FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("UserAuthToken");
  const [user, setUser] = useState<any>({});
  const [detailsForm, setDetailsForm] = useState<UserSignUp>({
    name: "",
    email: "",
    profileImageUrl: "",
    phone: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    college: "",
    degree: "",
    year: "",
    stream: "",
  });

  const fetchUserProfile = async (config: any) => {
    setLoading(true);
    try {
      const { data } = await UserProfileWithConfig(config);
      const userData = data.user;
      setUser(userData);
      setDetailsForm({
        ...detailsForm,
        name: userData.name,
        email: userData.email,
        profileImageUrl: userData.profileImageUrl,
        phone: userData.phone,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        college: userData.college,
        degree: userData.degree,
        year: userData.year,
        stream: userData.stream,
      });
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      fetchUserProfile(config);
    }
  }, [token]);
  return (
    <div className="container user-info-container">
      <div className="wrapper user-info-wrapper">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="user-info-img">
              <img src={user?.profileImageUrl} alt="" />
            </div>
            <form className="details-info-form">
              <div className="form-detail">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form_input"
                  placeholder="name"
                  required
                  autoComplete="off"
                  readOnly={true}
                  value={detailsForm.name}
                  onChange={(e) => {
                    if (regexForText(e))
                      setDetailsForm({ ...detailsForm, name: e.target.value });
                  }}
                />
              </div>
              <div className="form-detail">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form_input"
                  placeholder="email"
                  required
                  autoComplete="off"
                  readOnly={true}
                  value={detailsForm.email}
                  onChange={(e) =>
                    setDetailsForm({ ...detailsForm, email: e.target.value })
                  }
                />
              </div>
              <div className="form-detail">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="form_input"
                  placeholder="mobile no."
                  required
                  autoComplete="off"
                  readOnly={true}
                  maxLength={10}
                  value={detailsForm.phone}
                  onChange={(e) => {
                    if (regexForNums(e))
                      setDetailsForm({ ...detailsForm, phone: e.target.value });
                  }}
                />
              </div>
              <div className="form-detail">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="text"
                  name="dob"
                  id="dob"
                  className="form_input"
                  // placeholder="name"
                  required
                  autoComplete="off"
                  readOnly={true}
                  value={detailsForm.dateOfBirth.slice(0, 10)}
                  onChange={(e) =>
                    setDetailsForm({
                      ...detailsForm,
                      dateOfBirth: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-detail">
                <label htmlFor="college">College Name</label>
                <input
                  type="text"
                  name="college"
                  id="college"
                  className="form_input"
                  placeholder="college"
                  required
                  autoComplete="off"
                  readOnly={true}
                  value={detailsForm.college}
                  onChange={(e) => {
                    if (regexForText(e))
                      setDetailsForm({
                        ...detailsForm,
                        college: e.target.value,
                      });
                  }}
                />
              </div>
              <div className="form-detail">
                <label htmlFor="year">Year</label>
                <input
                  type="text"
                  name="year"
                  id="year"
                  className="form_input"
                  placeholder="year"
                  required
                  autoComplete="off"
                  readOnly={true}
                  value={detailsForm.year}
                  onChange={(e) =>
                    setDetailsForm({ ...detailsForm, year: e.target.value })
                  }
                />
              </div>
              <div className="form-detail">
                <label htmlFor="stream">Stream</label>
                <input
                  type="text"
                  name="stream"
                  id="stream"
                  className="form_input"
                  placeholder="stream"
                  required
                  autoComplete="off"
                  readOnly={true}
                  value={detailsForm.stream}
                  onChange={(e) =>
                    setDetailsForm({ ...detailsForm, stream: e.target.value })
                  }
                />
              </div>
              <div className="form-detail">
                <label htmlFor="espektroId">Espektro ID</label>
                <div className="password-input-box">
                  <input
                    type="text"
                    name="espektroId"
                    id="espektroId"
                    className="form_input"
                    placeholder="espektroId"
                    required
                    autoComplete="off"
                    readOnly={true}
                    value={user?.espektroId}
                    // onChange={(e) =>
                    //   setDetailsForm({ ...detailsForm, stream: e.target.value })
                    // }
                  />
                  <span
                    className="password_view_icon"
                    onClick={() => {
                      navigator.clipboard.writeText(user?.espektroId);
                      toast.success("Espektro ID copied successfully");
                    }}
                  >
                    <i className="fa-regular fa-copy"></i>
                  </span>
                </div>
              </div>
              <div className="form-detail">
                <label htmlFor="referralcode">Referral Code</label>
                <div className="password-input-box">
                  <input
                    type="text"
                    name="referralcode"
                    id="referralcode"
                    className="form_input"
                    placeholder="referralcode"
                    required
                    autoComplete="off"
                    readOnly={true}
                    value={user?.referralCode}
                    // onChange={(e) =>
                    //   setDetailsForm({ ...detailsForm, stream: e.target.value })
                    // }
                  />
                  <span
                    className="password_view_icon"
                    onClick={() => {
                      navigator.clipboard.writeText(user?.referralCode);
                      toast.success("Referral Code copied successfully");
                    }}
                  >
                    <i className="fa-regular fa-copy"></i>
                  </span>
                </div>
              </div>
              {/* <div className="form-detail">
            <label htmlFor="gender">Gender</label>
            <select
              name="gender"
              id="gender"
              className="form_input"
              required
              value={detailsForm.gender}
              onChange={(e) =>
                setDetailsForm({ ...detailsForm, gender: e.target.value })
              }
            >
              <option value="" hidden selected>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div> */}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
