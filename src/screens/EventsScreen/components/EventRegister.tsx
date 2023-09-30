import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import {
  getUserFromlocalStorage,
  InviteUser,
  RegisterEvent,
  UserProfile,
  UserVerify,
} from "../../../api/api";
import VerifiedIcon from "../../../assets/verified.png";
import Loader from "../../../components/Loader/Loader";
import Ticket from "../../../components/Ticket/Ticket";
import "./../EventRegister.scss";
import { toast } from "react-toastify";
import { validateEmail } from "../../Layout/Layout";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const EventRegister: React.FC<any> = () => {
  const token = localStorage.getItem("UserAuthToken");
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state;
  const [user, setUser] = useState<any>({});

  const [teamSize, setTeamSize] = useState<number>(1);
  const [teamName, setTeamName] = useState<string>("");
  const [finalTeamName, setFinalTeamName] = useState<string>("");

  const [memberDetails, setMemberDetails] = useState<any>([{}]);
  const [members, setMembers] = useState<any>([]);
  const [person, setPerson] = useState<any>({ espektroId: "" });
  const [email, setEmail] = useState<string>("");

  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);

  const [ticketPurchased, setTicketPurchased] = useState<boolean>(false);

  const [eventPrice, setEventPrice] = useState<string>("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkIfKGEC = (user: any) => {
    let kgecNames: Array<String> = [
      "kalyani government engineering college",
      "Kalyani Government Engineering college, kalyani",
      "kgec",
      "kalyani govt. engineering college",
      "kalyani govt. engg. college",
    ];
    let toPayForEvent = 0;
    //// console.log(kgecNames.indexOf(String(user.college.toLowerCase().trim())));
    if (kgecNames.includes(user?.college?.toLowerCase().trim())) {
      toPayForEvent = !event?.eventPriceForKGEC ? 0 : event?.eventPriceForKGEC;
      setEventPrice(toPayForEvent?.toString());
    } else {
      toPayForEvent = event?.eventPrice;
      setEventPrice(toPayForEvent?.toString());
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data } = await UserProfile();
      localStorage.setItem("user", JSON.stringify(data.user));
      setTicketPurchased(true);
      setPurchaseLoading(false);
    } catch (error: any) {
      setPurchaseLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  const sendInvitation = async (email: string) => {
    if (email !== "") {
      if (validateEmail(email)) {
        setInviteLoading(true);
        try {
          const { data } = await InviteUser({ email: email });
          setEmail("");
          setInviteLoading(false);
          toast.success(data.message);
        } catch (error: any) {
          setInviteLoading(false);
          toast.error(error.response.data.message, {
            position: "top-center",
          });
        }
      } else {
        window.alert("Please enter a valid email.");
      }
    } else {
      window.alert("Please enter the email you want to send invitation.");
    }
  };

  const verifyMember = async (espektroId: string) => {
    if (espektroId !== "") {
      if (espektroId === user?.espektroId) {
        setPerson({ espektroId: "" });
        window.alert("You are already added to your team. Please add others.");
        return;
      }
      const existingMember = members.filter(
        (member: any) => member.espektroId === espektroId
      );
      if (existingMember?.length === 0) {
        setVerifyLoading(true);
        try {
          const { data } = await UserVerify(espektroId);
          setMemberDetails([
            ...memberDetails,
            {
              name: data.user.name,
              espektroId: data.user.espektroId,
              verified: true,
            },
          ]);
          setMembers([...members, { espektroId: data.user.espektroId }]);
          setTeamSize((size) => size + 1);
          setPerson({ espektroId: "" });
          setVerifyLoading(false);
          toast.success(data.message);
        } catch (error: any) {
          setVerifyLoading(false);
          toast.error(error.response.data.message, {
            position: "top-center",
          });
        }
      } else {
        window.alert("Member already present.");
      }
    } else {
      window.alert("Please enter a valid espektro id.");
    }
  };

  //   const submitVerifyMember = () => {

  //   }

  const registerForEvent = async () => {
    if (event?.eventType === "group" && finalTeamName === "") {
      window.alert("Please enter your team name");
      return;
    }
    if (
      event?.eventType === "group" &&
      members?.length + 1 < event?.eventMinParticipants
    ) {
      const remainingParticipants =
        event?.eventMinParticipants - (members?.length + 1);
      window.alert(
        `Please enter ${remainingParticipants} more ${
          remainingParticipants === 1 ? "participant" : "participants"
        }`
      );
      return;
    }
    const yes =
      event?.eventType === "group"
        ? window.confirm(
            `Do you want to confirm event registration with ${
              members?.length + 1
            }?`
          )
        : window.confirm("Do you want to confirm your ticket for this event?");
    if (yes) {
      setPurchaseLoading(true);
      const eventRegisterDetails = {
        eventId: event?._id,
        team: {
          name: event?.eventType === "group" ? finalTeamName : user.name,
          members: members,
        },
      };
      try {
        if (user.verified === false) {
          toast.error("Please verify your email address to continue.", {
            position: "top-right",
          });
          navigate("/verify-account", {
            state: {
              user,
              navigateTo: `/events/${event?._id}/register`,
              authToken: token,
              event: event,
            },
          });
        } else {
          const { data } = await RegisterEvent(eventRegisterDetails);
          // console.log(data);
          fetchUserProfile();
          setTimeout(() => {
            navigate(`/my-tickets/${data.ticket._id}`);
          }, 2000);
          toast.success(data.message);
        }
      } catch (error: any) {
        setPurchaseLoading(false);
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      }
    }
    // else {
    //   window.alert("Add other team members");
    // }
  };

  useEffect(() => {
    if (token) {
      const userData = getUserFromlocalStorage();
      if (userData) {
        checkIfKGEC(userData);
        setUser(userData);
        setMemberDetails([
          {
            name: userData.name,
            espektroId: userData.espektroId,
            verified: userData?.verified,
          },
        ]);
        // setMembers([{ espektroId: userData.espektroId }]);
      } else {
        window.location.reload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div className="container event-register-container">
      <div className="wrapper event-register-wrapper">
        <div className="register-details">
          <div className="top-title-bar">
            <h3 className="title-20">
              Register for {event?.title} <span>({event?.eventType})</span>
            </h3>
          </div>
          <div
            className="add-team-name"
            style={{ display: event?.eventType === "solo" ? "none" : "block" }}
          >
            <div className="details-info-form">
              <div className="form-detail">
                <label htmlFor="team">Team Name</label>
                <input
                  type="text"
                  name="team"
                  id="team"
                  className="form_input"
                  placeholder="team name"
                  required
                  autoComplete="off"
                  value={teamName}
                  onChange={(e) => {
                    setTeamName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setTeamName("");
                      setFinalTeamName(teamName);
                    }
                  }}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setTeamName("");
                  setFinalTeamName(teamName);
                }}
              >
                {finalTeamName !== "" ? "Change" : "Save"}
              </button>
            </div>
          </div>
          <div className="team-members">
            <div className="text-18 text-18-title">
              {event?.eventType === "solo"
                ? "Participant"
                : `Team ${finalTeamName}`}
            </div>
            <div className="members">
              {memberDetails.map((person: any, index: number) => (
                <div className="member-name" key={index}>
                  <p className="text-16">
                    <span>{index + 1}.</span> {person.name}
                  </p>
                  {person.verified ? (
                    <>
                      <img src={VerifiedIcon} alt="" />
                      <span>verified</span>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div
            className="add-members"
            style={{ display: event?.eventType === "solo" ? "none" : "block" }}
          >
            <div className="text-18 text-18-title">Add other team members</div>
            <div
              style={{
                fontSize: "12px",
                maxWidth: "400px",
                color: "#c0c0c0",
                marginTop: "0.25rem",
              }}
            >
              <i
                className="fa-solid fa-circle-exclamation"
                style={{ color: "#4a7fd4" }}
              ></i>{" "}
              Your friend's Espektro ID has to be entered here to add him/her in
              your team. Get the Espektro ID from register/login {">"} sidebar
              or sidebar {">"} user profile {"> "} Espektro ID.
            </div>
            <div className="details-info-form">
              <div className="form-detail">
                <label htmlFor="espektroId" style={{ lineHeight: "1.75" }}>
                  Team Member {teamSize + 1} (optional)
                </label>
                <input
                  type="text"
                  name="espektroId"
                  id="espektroId"
                  className="form_input"
                  placeholder="Espektro ID"
                  required
                  autoComplete="off"
                  value={person.espektroId}
                  onChange={(e) => {
                    setPerson({ espektroId: e.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      verifyMember(person.espektroId);
                    }
                  }}
                />
              </div>
              {verifyLoading ? (
                <BounceLoader
                  size={40}
                  color="#4a7fd4"
                  loading={verifyLoading}
                  speedMultiplier={0.5}
                />
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => verifyMember(person.espektroId)}
                >
                  Save
                </button>
              )}
            </div>
          </div>
          <div
            className="add-members"
            style={{ display: event?.eventType === "solo" ? "none" : "block" }}
          >
            <div className="text-18 text-18-title">Invite Friends</div>
            <div className="details-info-form">
              <div className="form-detail">
                <label htmlFor="email">Enter E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form_input"
                  placeholder="e-mail"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendInvitation(email);
                    }
                  }}
                />
              </div>
              {inviteLoading ? (
                <BounceLoader
                  size={40}
                  color="#4a7fd4"
                  loading={inviteLoading}
                  speedMultiplier={0.5}
                />
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => sendInvitation(email)}
                >
                  Invite
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="event-ticket-details">
          <Ticket event={event} user={user} eventPrice={eventPrice} />
          {purchaseLoading ? (
            <Loader loadingState={purchaseLoading} />
          ) : ticketPurchased ? (
            <div className="ticket-purchased">
              <img src={VerifiedIcon} alt="" />
              <span>purchased successfully</span>
            </div>
          ) : (
            <>
              <div className="ticket-purchased">
                {/* <img src={VerifiedIcon} alt="" /> */}
                {/* <FontAwesomeIcon
                  icon={faExclamationCircle}
                  size="2x"
                  color="#4a7fd4"
                /> */}
                <span>
                  <i
                    className="fa-solid fa-circle-exclamation"
                    style={{ color: "#4a7fd4" }}
                  ></i>{" "}
                  You may also come offline to the venue and then purchase this
                  ticket. We also support offline payment. But, online
                  registration is preferred.
                </span>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => registerForEvent()}
              >
                Purchase
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegister;
