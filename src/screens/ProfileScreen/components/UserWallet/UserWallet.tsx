import axios from "axios";
import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  CreateTransaction,
  getUserFromlocalStorage,
  RefreshTransaction,
  UpdateTransaction,
  UserProfile,
  UserProfileWithConfig,
} from "../../../../api/api";
import CoinImg from "../../../../assets/coin.png";
import Loader, { override } from "../../../../components/Loader/Loader";
import { regexForNums, regexForText } from "../../../Layout/Layout";
import "./UserWallet.scss";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const UserWallet: React.FC<any> = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<string>("Actions");
  const token = localStorage.getItem("UserAuthToken");
  const [user, setUser] = useState<any>({});

  const [coupon, setCoupon] = useState<string>("");
  const [coinAmount, setCoinAmount] = useState<string>("");

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [reloadOnce, setReloadOnce] = useState(false);

  const fetchUserProfile = async (config: any) => {
    setFullPageLoading(true);
    try {
      const { data } = await UserProfileWithConfig(config);
      const userData = data.user;
      setUser(userData);
      setFullPageLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  const refreshPayment = async (
    transactionId: string
    // transactionSuccessMessage: string
  ) => {
    // console.log(transactionId);
    try {
      const { data } = await RefreshTransaction({
        transactionId: transactionId,
      });
      // window.location.reload();s
      setLoading(false);
      // navigate("/my-wallet");
      // toast.success("Payment refreshed");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  const payAmount = async (coin: string) => {
    if (coin !== "") {
      setLoading(true);
      try {
        const { data } = await CreateTransaction({ amount: coin });
        const razorpayUrl = data.razorpayData.short_url;
        // redirect to razorpay url
        window.open(razorpayUrl, "_self");
      } catch (error: any) {
        setLoading(false);
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      }
    } else {
      window.alert("Please enter a valid amount.");
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
      const urlParams = new URLSearchParams(window.location.search);
      const transactionId = urlParams.get("razorpay_payment_link_reference_id");
      // const paymentId = urlParams.get("razorpay_payment_link_id");

      if (transactionId) {
        // navigate("/my-wallet");
        refreshPayment(transactionId);
        window.history.replaceState(null, "", "/my-wallet");
        toast.success("Payment Completed Successfully");
      }
    }
  }, []);

  return (
    <div
      className={`container user-wallet-container ${
        state === "Actions" ? "stick-to-top" : null
      }`}
    >
      <div className="wrapper user-wallet-wrapper">
        {fullPageLoading ? (
          <Loader />
        ) : (
          <>
            {(state === "Actions" && (
              <>
                <div className="user-coin-box">
                  <h3 className="title-20">My Wallet</h3>
                  <div className="coin-box">
                    <img src={CoinImg} alt="" />
                    <div className="text-18">{user?.coins} Coins</div>
                    <p className="text-16">(Rs. 1 for 10 coins)</p>
                  </div>
                </div>
                <div className="user-wallet-actions">
                  <div
                    className="action-btn"
                    onClick={() => setState("AddCoins")}
                  >
                    <div className="text-16">Add Coins</div>
                    <i className="fa-solid fa-angle-right"></i>
                  </div>
                  {/* <div
                    className="action-btn"
                    onClick={() => setState("RedeemCoins")}
                  >
                    <div className="text-16">Redeem Coins</div>
                    <i className="fa-solid fa-angle-right"></i>
                  </div> */}
                </div>
                {user.transactions?.length !== 0 ? (
                  <div className="user-transactions">
                    <div
                      className="top-title-bar"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      <div className="title-20">My Transactions</div>
                      <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                      >
                        <i className="fa-solid fa-arrows-rotate"></i> Refresh
                      </button>
                    </div>
                    <div className="transaction-list">
                      {user.transactions?.map((transaction: any) => (
                        <div className="list-item" key={transaction._id}>
                          <div className="text-detail">
                            <h5 className="text-16">Amount Paid :</h5>
                            <p className="text-18">
                              Rs. {transaction.amount}/-
                            </p>
                          </div>
                          <div className="text-detail">
                            <h5 className="text-16">Coins Added :</h5>
                            <div className="coin-details">
                              <span>{transaction.coins}</span>
                              <img src={CoinImg} className="coin-icon" alt="" />
                            </div>
                          </div>
                          <div className="text-detail">
                            <h5 className="text-16">Status :</h5>
                            <p className="text-18">{transaction.status}</p>
                          </div>
                          <div className="text-detail">
                            <h5 className="text-16">Time :</h5>
                            <p className="text-18">
                              {moment(transaction.createdAt)
                                .subtract("330", "minutes")
                                .format("L")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            )) ||
              (state === "AddCoins" && (
                <div className="add-coins user-action-box">
                  <div className="user-action-top-bar">
                    <h3 className="title-20">Add Coins</h3>
                    <i
                      className="fa-solid fa-arrow-left"
                      onClick={() => setState("Actions")}
                    ></i>
                  </div>
                  <div className="form-detail" style={{ gridColumn: "1 / 3" }}>
                    <label htmlFor="coin">
                      Enter Amount in Rs. (Rs. 1 for 10 coins)
                    </label>
                    <input
                      type="text"
                      name="coin"
                      id="coin"
                      className="form_input"
                      placeholder="amount"
                      required
                      autoComplete="off"
                      value={coinAmount}
                      onChange={(e) => {
                        if (regexForNums(e)) setCoinAmount(e.target.value);
                      }}
                    />
                  </div>
                  <div className="bottom-button-box">
                    {loading ? (
                      <BounceLoader
                        size={40}
                        color="#4a7fd4"
                        loading={loading}
                        cssOverride={override}
                        speedMultiplier={0.5}
                      />
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => payAmount(coinAmount)}
                      >
                        Add Coins
                      </button>
                    )}
                  </div>
                </div>
              )) ||
              (state === "RedeemCoins" && (
                <div className="add-coins user-action-box">
                  <div className="user-action-top-bar">
                    <h3 className="title-20">Redeem Coins</h3>
                    <i
                      className="fa-solid fa-arrow-left"
                      onClick={() => setState("Actions")}
                    ></i>
                  </div>
                  <div className="form-detail" style={{ gridColumn: "1 / 3" }}>
                    <label htmlFor="coupon">Enter Coupon Code</label>
                    <input
                      type="text"
                      name="coupon"
                      id="coupon"
                      className="form_input"
                      placeholder="coupon"
                      required
                      autoComplete="off"
                      value={coupon}
                      onChange={(e) => {
                        if (regexForText(e)) setCoupon(e.target.value);
                      }}
                    />
                  </div>
                  <div className="bottom-button-box">
                    <button className="btn btn-primary">Redeem Coupon</button>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UserWallet;
