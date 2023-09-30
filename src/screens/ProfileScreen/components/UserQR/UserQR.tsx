import React, { useEffect, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { getUserFromlocalStorage } from "../../../../api/api";
import EspektroLogo from "../../../../assets/espektro-small-logo-black.png";
import "./UserQR.scss";

const UserQR: React.FC<any> = () => {
  const token = localStorage.getItem("UserAuthToken");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (token) {
      const userData = getUserFromlocalStorage();
      if (userData) {
        setUser(userData);
      }
    }
  }, [token]);
  return (
    <div className="container user-qr-container">
      <div className="wrapper user-qr-wrapper">
        <div className="user-qr-box">
          <div className="qr-img-box">
            <QRCode
              value={user?.qrText}
              ecLevel="H"
              quietZone={25}
              qrStyle="dots"
              eyeRadius={10}
              removeQrCodeBehindLogo={true}
              logoImage={EspektroLogo}
              logoWidth={35}
              logoHeight={35}
              // bgColor="#fff"
              // fgColor="#4a7fd4"
              bgColor="#33c75a"
            />
          </div>
          <h3 className="title-26">User QR</h3>
          <p className="text-16 text-16-para">
            Volunteer will scan the QR for event entry!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserQR;
