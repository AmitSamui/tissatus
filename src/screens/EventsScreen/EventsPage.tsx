import "./EventsPage.scss";

import React, { useEffect, useMemo, useState } from "react";

import moment from "moment";
import { BounceLoader } from "react-spinners";
// @ts-ignore
import { toast } from "react-toastify";

import {
  AllEvents,
  AllEventsForClub,
  getUserFromlocalStorage,
  InviteUser,
} from "../../api/api";
import Loader from "../../components/Loader/Loader";
import { validateEmail } from "../Layout/Layout";
import EventCardsContainer from "./components/EventCardsContainer";
import { useLocation, useNavigate } from "react-router-dom";
import EspektroText from "../../assets/espektro-big-text.png";
import CoinImg from "../../assets/coin.png";

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const club = urlParams.get("club");

  const [state, setState] = useState<string>("Upcoming");
  const [loading, setLoading] = useState<boolean>(false);

  const [clubs, setClubs] = useState<string[]>([
    "GDSC KGEC",
    "KGEC Robotics Society",
    "KeyGEnCoders",
    "CHITRANK",
    "INFINITIO",
    "RIYAZ",
    "ELYSIUM",
    "Litmus",
    "SHUTTERBUG",
    "SAC-KGEC",
    "Les Quizerables",
    "noScope",
  ]);

  const token = localStorage.getItem("UserAuthToken");
  const [user, setUser] = useState<any>({});

  const [filters, setFilters] = useState<filtersParams>({
    club: "",
    query: "",
  });

  // const [events, setEvents] = useState<any>([]);

  const [pastEvents, setPastEvents] = useState<any>([]);
  const [ongoingEvents, setOngoingEvents] = useState<any>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any>([]);

  // const [organiserClub, setOrganiserClub] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);

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

  // const fetchUserProfile = async () => {
  //   try {
  //     const { data } = await UserProfile();
  //     localStorage.setItem("user", JSON.stringify(data.user));
  //     // window.location.reload();
  //     setLoading(false);
  //     //toast.success(data.message);
  //   } catch (error: any) {
  //     setLoading(false);
  //     toast.error(error.response.data.message, {
  //       position: "top-center",
  //     });
  //   }
  // };

  // const filterEvents = (eventsData: any) => {
  //   let fetchedEvents: [] = [];
  //   const eventsList = eventsData;
  //   if (filters.club !== "") {
  //     fetchedEvents = eventsList?.filter(
  //       (event: any) =>
  //         event.eventOrganiserClub.name?.toLowerCase().trim() ===
  //         filters.club?.toLowerCase().trim()
  //     );
  //   } else if (filters.query !== "") {
  //     fetchedEvents = eventsList?.filter((event: any) =>
  //       event.title.includes(filters.query)
  //     );
  //   } else {
  //     if (filters.club === "" && filters.query === "") {
  //       fetchedEvents = eventsList;
  //     } else {
  //       fetchedEvents = eventsList?.filter(
  //         (event: any) =>
  //           event.eventOrganiserClub.name?.toLowerCase().trim() ===
  //             filters.club?.toLowerCase().trim() &&
  //           event.title.includes(filters.query)
  //       );
  //     }
  //   }
  //   const pastEventsList = fetchedEvents?.filter(
  //     (event: any) => new Date(event.endTime) < new Date()
  //   );
  //   const ongoingEventsList = fetchedEvents?.filter(
  //     (event: any) =>
  //       new Date(event.startTime) <= new Date() &&
  //       new Date() <= new Date(event.endTime)
  //   );
  //   const upcomingEventsList = fetchedEvents?.filter(
  //     (event: any) => new Date(event.startTime) > new Date()
  //   );
  //   setPastEvents(pastEventsList);
  //   setOngoingEvents(ongoingEventsList);
  //   setUpcomingEvents(upcomingEventsList);
  // };

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      //check if 'club' is present in params
      let data: any = {};
      if (club) {
        const response = await AllEventsForClub(club);
        data = response.data;
        setFilters({ ...filters, club: club });
      } else {
        const response = await AllEvents();
        data = response.data;
      }

      // // console.log(location.state);

      // const clubName = location?.state?.club;
      // if (clubName && clubName !== "") {
      //   // console.log(clubName);
      //   setFilters({ ...filters, club: clubName });
      // }

      const fetchedEvents = data.events.documents;
      const pastEventsList = fetchedEvents?.filter(
        (event: any) =>
          moment(new Date(event.endTime)).subtract("330", "minutes") <
          moment(new Date())
      );
      const ongoingEventsList = fetchedEvents?.filter(
        (event: any) =>
          moment(new Date(event.startTime)).subtract("330", "minutes") <=
            moment(new Date()) &&
          moment(new Date()) <=
            moment(new Date(event.endTime)).subtract("330", "minutes")
      );
      const upcomingEventsList = fetchedEvents?.filter(
        (event: any) =>
          moment(new Date(event.startTime)).subtract("330", "minutes") >
          moment(new Date())
      );
      setPastEvents(pastEventsList);
      setOngoingEvents(ongoingEventsList);
      setUpcomingEvents(upcomingEventsList);

      // setClubs(
      //   (
      //     fetchedEvents.map((event: any) => event?.eventOrganiserClub.name) ||
      //     []
      //   ).filter(
      //     (value: string, index: number, array: string[]) =>
      //       array.indexOf(value) === index
      //   )
      // );
      // }
      //fetchUserProfile();
      // setTimeout(() => {
      setLoading(false);
      //toast.success("Events fetched successfully");
      // }, 2000);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message, {
        position: "top-center",
      });
    }
  };

  // useEffect(() => {
  //   const config = {
  //     params: {
  //       "eventOrganiserClub.name": organiserClub,
  //     },
  //   };
  //   fetchAllEvents(config);
  // }, [organiserClub]);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const club = urlParams.get("club");
  //   if (filters.club === club) {
  //     // console.log(filters.club, club);
  //     navigate("/", { state: club });
  //   }
  // }, [filters.club]);

  useEffect(() => {
    if (token) {
      const userData = getUserFromlocalStorage();
      if (userData) {
        setUser(userData);
      }
    }
  }, [token]);

  const filteredEventList = useMemo(() => {
    let eventList =
      (state === "Past" && pastEvents) ||
      (state === "Ongoing" && ongoingEvents) ||
      (state === "Upcoming" && upcomingEvents) ||
      [];
    if (filters.club !== "") {
      eventList = eventList.filter(
        (event: any) =>
          event.eventOrganiserClub.name?.toLowerCase().trim() ===
          filters.club?.toLowerCase().trim()
      );
    }
    if (filters.query !== "") {
      eventList = eventList.filter((event: any) =>
        event.title
          ?.toLowerCase()
          .trim()
          .includes(filters.query.toLowerCase().trim())
      );
    }
    return eventList;
  }, [
    state,
    pastEvents,
    ongoingEvents,
    upcomingEvents,
    filters.club,
    filters.query,
  ]);

  return (
    <div className="container events-page-container">
      <div className="wrapper events-page-wrapper">
        <div className="container-top-bar">
          <h3 className="title-26">
            {/* <span>Welcome</span> to{" "} */}
            <div className="espketro-text">
              <img src={EspektroText} alt="" />
            </div>
          </h3>
          <p className="text-16 home-description">
            {/* ESPEKTRO is the official Annual Techno-Management cum Cultural fest
            of Kalyani Government Engineering College. Do register and
            participate in various exciting events. <br /> */}
            <div className="info-detail">
              <span className="info-icon">
                <i
                  className="fa-solid fa-exclamation"
                  // style={{ marginRight: "4px" }}
                ></i>
              </span>{" "}
              1 INR ={" "}
              <div
                className="coin-details"
                style={{ display: "inline-flex", marginLeft: "4px" }}
              >
                <span>10 </span>
                <img src={CoinImg} className="coin-icon" alt="" />
                <span>coins</span>
              </div>
              <span
                className="wallet-icon"
                onClick={() => {
                  if (token !== null) {
                    navigate("/my-wallet");
                  } else {
                    navigate("/register");
                  }
                }}
              >
                <i className="fa-solid fa-wallet"></i>
              </span>
            </div>
          </p>
          <div className="events-page-timeline">
            <div className="timeline-box">
              <h5 className="text-16">Today</h5>
              <p className="text-18">
                {moment(new Date()).format("dddd")}{" "}
                {moment(new Date()).format("ll")}
              </p>
            </div>
            <div className="timeline-box">
              <h5 className="text-16">Next Event at</h5>
              <p className="text-18">
                {upcomingEvents?.length !== 0
                  ? moment(new Date(upcomingEvents[0].startTime))
                      .subtract("330", "minutes")
                      .format("LT")
                  : moment(new Date()).format("LT")}
              </p>
            </div>
          </div>
        </div>
        <div className="action-forms">
          {token !== null ? (
            <div className="form-info-box">
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
          ) : null}
          {/* <div className="form-info-box">
            <div className="text-18 text-18-title">Search Event</div>
            <div className="details-info-form">
              <div className="form-detail">
                <label htmlFor="club">Select Club</label>
                <select
                  name="gender"
                  id="gender"
                  className="form_input"
                  required
                  value={organiserClub}
                  onChange={(e) => setOrganiserClub(e.target.value)}
                >
                  <option value="">All</option>
                  {EventClubs.map((club: any, index: number) => (
                    <option value={club} key={index}>
                      {club}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div> */}
        </div>
        <div className="event-tabs">
          <span
            className={`event-tab-item ${state === "Past" ? "active" : ""}`}
            onClick={() => setState("Past")}
          >
            Past
          </span>
          <span
            className={`event-tab-item ${state === "Ongoing" ? "active" : ""}`}
            onClick={() => setState("Ongoing")}
          >
            Ongoing
          </span>
          <span
            className={`event-tab-item ${state === "Upcoming" ? "active" : ""}`}
            onClick={() => setState("Upcoming")}
          >
            Upcoming
          </span>
        </div>
        <div className="container-topbar-sticky">
          <h2 className="title-26">
            <span
              style={{
                color:
                  state === "Past"
                    ? "#ff7272"
                    : state === "Ongoing"
                    ? "#4a7fd4"
                    : state === "Upcoming"
                    ? "#af70ff"
                    : "#fff",
              }}
            >
              {state}
            </span>{" "}
            Events
          </h2>
          <div className="events-filter-form">
            <div className="form-detail">
              <label
                htmlFor="club"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                Filter Events{" "}
                <span
                  className="text-blue"
                  onClick={() => {
                    if (filters.club !== "") {
                      if (club) {
                        navigate("/");
                      }
                      setFilters({ ...filters, club: "" });
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Clear filter
                </span>
              </label>
              <select
                name="gender"
                id="gender"
                className="form_input"
                required
                value={filters.club}
                onChange={(e) => {
                  if (e.target.value === "" && club) {
                    navigate("/");
                  }
                  setFilters({ ...filters, club: e.target.value });
                }}
              >
                <option value="">All Clubs</option>
                {clubs.map((club: any, index: number) => (
                  <option value={club} key={index}>
                    {club}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-detail">
              <label
                htmlFor="events"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                Search Events{" "}
                <span
                  className="text-blue"
                  onClick={() => {
                    if (filters.query !== "") {
                      setFilters({ ...filters, query: "" });
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Clear search
                </span>
              </label>
              <input
                type="text"
                name="events"
                id="events"
                className="form_input"
                placeholder="search"
                required
                autoComplete="off"
                value={filters.query}
                onChange={(e) =>
                  setFilters({ ...filters, query: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        {loading ? (
          // <div
          //   style={{
          //     minHeight: "200px",
          //     display: "grid",
          //     placeContent: "center",
          //   }}
          // >
          <Loader loadingState={loading} />
        ) : (
          // </div>
          <EventCardsContainer
            events={filteredEventList}
            state={state}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default EventsPage;
