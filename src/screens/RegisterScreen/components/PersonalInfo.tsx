import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserSignUpContext } from "../RegisterPage";
import NoProfileImg from "../../../assets/no-profile-pic.png";
import FormSteps from "./FormSteps";
import { toast } from "react-toastify";
import { UploadImage } from "../../../api/api";
import { ClipLoader } from "react-spinners";
import {
  validateImgSize,
  regexForNums,
  regexForText,
  validateEmail,
} from "../../Layout/Layout";

const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const { form, state } = useContext(UserSignUpContext);

  const [detailsForm, setDetailsForm] = form;
  const [currentFormState, setCurrentFormState] = state;

  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const uploadProfileImage = async (profileImage: File) => {
    // console.log("running");
    setImageUploading(true);
    const imageData = new FormData();
    imageData.append("images", profileImage);
    try {
      const { data } = await UploadImage(imageData);
      // console.log(data.images);
      setDetailsForm({ ...detailsForm, profileImageUrl: data.images[0] });
      setImageUploading(false);
      toast.success(data.message);
    } catch (error: any) {
      setImageUploading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  const checkFormFields = () => {
    // console.log(detailsForm);
    if (
      detailsForm.name !== "" &&
      detailsForm.email !== "" &&
      // detailsForm.profileImageUrl !== "" &&
      detailsForm.phone !== "" &&
      detailsForm.dateOfBirth !== "" &&
      detailsForm.gender !== ""
    ) {
      if (validateEmail(detailsForm.email)) {
        setCurrentFormState("CollegeInfo");
      } else {
        window.alert("Please enter a valid email address.");
      }
    } else {
      if (detailsForm.name === "") {
        window.alert("Please enter your name.");
      } else if (detailsForm.email === "") {
        window.alert("Please enter your email.");
      } else if (detailsForm.phone === "") {
        window.alert("Please enter your mobile no.");
      } else if (detailsForm.dateOfBirth === "") {
        window.alert("Please enter your date of birth.");
      } else if (detailsForm.gender === "") {
        window.alert("Please select your gender.");
      }
    }
  };

  return (
    <div className="details-info-box">
      <div className="details-info-title-bar">
        <h3 className="title-26">
          Create your <span>Account</span>
        </h3>
        <span
          className="back-icon"
          onClick={() => setCurrentFormState("CreateAccount")}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </span>
      </div>
      <p className="text-16">Participate in Espektro Seamlessly!!</p>
      <h4 className="text-18">Personal Information</h4>
      <form className="details-info-form">
        <div className="file-details full-form-width">
          <div className="image-box">
            <img
              src={
                detailsForm.profileImageUrl
                  ? detailsForm.profileImageUrl
                  : NoProfileImg
              }
              alt=""
            />
            <label htmlFor="image" className="file_input">
              <i className="fa-solid fa-image"></i>
            </label>
            {imageUploading ? (
              <ClipLoader
                size={40}
                color="#4a7fd4"
                loading={imageUploading}
                // cssOverride={override}
                speedMultiplier={0.5}
                className="image-input-loader"
              />
            ) : null}
          </div>
          <p className="validation-text">
            image size should be {"<"} 5MB<span className="text-red">*</span>
          </p>
          <input
            type="file"
            name="image"
            id="image"
            className="form_input"
            accept=".png, .jpg, .jpeg"
            hidden={true}
            onChange={(e) => {
              if (e.target.files) {
                if (validateImgSize(e.target.files[0])) {
                  uploadProfileImage(e.target.files[0]);
                } else {
                  window.alert("Image size should be less than 5MB");
                }
              }
            }}
          />
        </div>
        <div className="form-detail">
          <label htmlFor="name">
            Enter Your Name<span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="form_input"
            placeholder="name"
            required
            autoComplete="off"
            value={detailsForm.name}
            onChange={(e) => {
              if (regexForText(e))
                setDetailsForm({ ...detailsForm, name: e.target.value });
            }}
          />
        </div>
        <div className="form-detail">
          <label htmlFor="email">
            Enter Your E-mail<span className="text-red">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="form_input"
            placeholder="email"
            required
            autoComplete="off"
            value={detailsForm.email}
            onChange={(e) =>
              setDetailsForm({ ...detailsForm, email: e.target.value })
            }
          />
        </div>
        <div className="form-detail">
          <label htmlFor="phone">
            Phone Number<span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            className="form_input"
            placeholder="mobile no."
            required
            autoComplete="off"
            maxLength={10}
            value={detailsForm.phone}
            onChange={(e) => {
              if (regexForNums(e))
                setDetailsForm({ ...detailsForm, phone: e.target.value });
            }}
          />
        </div>
        <div className="form-detail">
          <label htmlFor="dob">
            Date of Birth<span className="text-red">*</span>
          </label>
          <input
            type="date"
            name="dob"
            id="dob"
            className="form_input"
            // placeholder="name"
            required
            autoComplete="off"
            value={detailsForm.dateOfBirth}
            onChange={(e) =>
              setDetailsForm({ ...detailsForm, dateOfBirth: e.target.value })
            }
          />
        </div>
        <div className="form-detail">
          <label htmlFor="gender">
            Gender<span className="text-red">*</span>
          </label>
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
        </div>
        <div className="form-detail">
          <label htmlFor="referralcode">Referral Code (Optional)</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form_input"
            placeholder="referralcode"
            required
            autoComplete="off"
            value={detailsForm.referralcode}
            onChange={(e) =>
              setDetailsForm({ ...detailsForm, referralcode: e.target.value })
            }
          />
        </div>
      </form>
      <div className="details-info-action">
        <FormSteps currentFormState={currentFormState} />
        <button className="btn btn-primary" onClick={() => checkFormFields()}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
