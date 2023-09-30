import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

let authToken = localStorage.getItem("UserAuthToken");

if (authToken) {
  API.defaults.headers.common.Authorization = `Bearer ${authToken}`;
} else {
  delete API.defaults.headers.common.Authorization;
}

// API.interceptors.request.use((req) => {
//   if (authToken) {
//     req.headers["Authorization"] = `Bearer ${authToken}`;
//   }
//   return req;
// });

export const updateToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};

export const getUserFromlocalStorage = () => {
  if (authToken) {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return null;
    }
  }
};

const configForImageUpload = {
  headers: {
    "UTILS-API-KEY": process.env.REACT_APP_UTILS_API_KEY,
    "content-type": "multipart/form-data",
  },
};

// USER AUTH
export const SignUpUser = (signUpData: UserSignUp) =>
  API.post("/api/users/signup", signUpData);
export const SignInUser = (signInData: UserSignIn) =>
  API.post("/api/users/login", signInData);
export const SendUserOTP = (config: any) =>
  API.post("/api/users/sendotp", null, config);
export const VerifyUserOTP = (otpData: OTPObj, config: any) =>
  API.post("/api/users/verifyotpforuser", otpData, config);

export const SendOTPForResetPassword = (EmailDetails: { email: string }) =>
  API.post("/api/users/sendotpreset", EmailDetails);
export const VerifyOTPForResetPassword = (otpData: OTPObjForResetPassword) =>
  API.post("/api/users/verifyotpforreset", otpData);

// INVITE USER
export const InviteUser = (EmailDetails: { email: string }) =>
  API.post("/api/users/inviteuser", EmailDetails);

// UPLOAD IMAGES
export const UploadImage = (imageData: FormData) =>
  API.put("/api/utils/uploadimages", imageData, configForImageUpload);

// export const AllEvents = (config: {
//   params: { "eventOrganiserClub.name": string };
// }) => API.get("/api/events/all", config);

// EVENTS
export const AllEvents = () => API.get("/api/events/all?dpp=20000");

export const AllEventsForClub = (clubName: string) =>
  API.get(`/api/events/all?eventOrganiserClub.name=${clubName}`);

export const SingleEvent = (eventId: string) =>
  API.get(`/api/events/${eventId}`);
export const RegisterEvent = (eventRegisterData: any) =>
  API.post("/api/events/register", eventRegisterData);

// USER PROFILE
export const UserProfile = () => API.get("/api/users/profile");
export const UserProfileWithConfig = (config: any) =>
  API.get("/api/users/profile", config);

export const UserVerify = (espektroId: string) =>
  API.get(`/api/users/verifyespektroid/${espektroId}`);

// TICKETS
export const AllTickets = () => API.get("/api/tickets/allforusers");
export const SingleTicket = (ticketId: string) =>
  API.get(`/api/tickets/${ticketId}`);

// TRANSACTION
export const CreateTransaction = (amountData: { amount: string }) =>
  API.post("/api/users/transaction", amountData);
export const UpdateTransaction = (transactionData: {
  transactionId: string;
  paymentId: string;
}) => API.put("/api/users/transaction", transactionData);
export const RefreshTransaction = (transactionIdDetails: {
  transactionId: string;
}) => API.patch("/api/users/transaction", transactionIdDetails);
