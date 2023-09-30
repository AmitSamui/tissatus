interface UserSignUp {
  name: string;
  email: string;
  profileImageUrl?: string;
  phone: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  college: string;
  degree: string;
  year: string;
  stream: string;
  referralcode?: string;
  rcode?: string;
}

interface UserSignIn {
  email: string;
  password: string;
}

interface OTPObj {
  otp: string;
  otp_token: string;
}

interface OTPObjForResetPassword {
  otp: string;
  otp_token: string;
  email: string;
  password: string;
}

interface PopUpProps {
  type: string;
  message: string;
  show: boolean;
}

interface filtersParams {
  club: string;
  query: string;
}
