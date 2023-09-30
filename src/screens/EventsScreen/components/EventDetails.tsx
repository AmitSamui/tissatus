import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import CoinImg from "../../../assets/coin.png";
import EventImg from "../../../assets/event-img.png";
import AboutIcon from "../../../assets/about.png";
import SponsorIcon from "../../../assets/handshake-solid.jpg";
import PrizesIcon from "../../../assets/prizes.png";
import RulesIcon from "../../../assets/rules-icon.png";
import LeaderboardIcon from "../../../assets/leaderboard-icon.png";
import "../EventDetails.scss";
import { getUserFromlocalStorage, SingleEvent } from "../../../api/api";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import { ScrollPageToTop, validateEventPrice } from "../../Layout/Layout";

const EventDetails: React.FC = () => {
  const params = useParams();
  const eventId = params.eventId;
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<any>({});
  const [eventTimeType, setEventTimeType] = useState<string>("");

  const token = localStorage.getItem("UserAuthToken");

  const fetchEventDeatils = async (eventId: string) => {
    setLoading(true);
    try {
      const { data } = await SingleEvent(eventId);
      // console.log(data.event);
      setEvent(data.event);
      if (new Date(data.event.endTime) < new Date()) {
        setEventTimeType("Past");
      } else if (new Date(data.event.startTime) > new Date()) {
        setEventTimeType("Upcoming");
      } else {
        setEventTimeType("Ongoing");
      }
      setLoading(false);
      //toast.success(data.message);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDeatils(eventId);
    }
    ScrollPageToTop();
  }, [eventId]);

  useEffect(() => {
    if (token) {
      const userData = getUserFromlocalStorage();
      if (userData) {
        setUser(userData);
      }
    }
  }, [token]);

  return (
    <div className="container event-details-page-container">
      <div className="wrapper event-details-page-wrapper">
        {loading ? (
          <Loader loadingState={loading} />
        ) : (
          <>
            <span className="back-icon back-btn" onClick={() => navigate("/")}>
              <i className="fa-solid fa-arrow-left"></i>
            </span>
            <div className="event-details-top">
              <img
                src={
                  event.eventImages?.length !== 0
                    ? event.eventImages?.[0].url
                    : EventImg
                }
                className="event-bg"
                alt=""
              />
              <div className="event-title-bar">
                <div className="event-title-tagline">
                  <h3 className="title-26">{event.title}</h3>
                  <span className="title-tagline">{event.tagLine}</span>
                </div>
                <span className="text-18">{eventTimeType}</span>
              </div>
              <div className="coin-details" style={{ fontSize: "20px" }}>
                <span>
                  {token === null
                    ? event.eventPrice
                    : validateEventPrice(location?.state?.user, event)}
                </span>
                <img
                  src={CoinImg}
                  className="coin-icon img-icon img-icon-medium"
                  alt=""
                  style={{ marginLeft: "0.25rem" }}
                />
                <span>coins</span>
              </div>
              <div className="events-page-timeline">
                <div className="timeline-box">
                  <h5 className="text-16">Event Date</h5>
                  <p className="text-18">
                    {moment(new Date(event.startTime))
                      .subtract("330", "minutes")
                      .format("ll")}
                  </p>
                </div>
                <div className="timeline-box">
                  <h5 className="text-16">End Date</h5>
                  <p className="text-18">
                    {moment(new Date(event.endTime))
                      .subtract("330", "minutes")
                      .format("ll")}
                  </p>
                </div>
              </div>
              <div className="events-page-timeline">
                <div className="timeline-box">
                  <h5 className="text-16">Starts at</h5>
                  <p className="text-18">
                    {moment(new Date(event.startTime))
                      .subtract("330", "minutes")
                      .format("LT")}
                  </p>
                </div>
                <div className="timeline-box">
                  <h5 className="text-16">Ends at</h5>
                  <p className="text-18">
                    {moment(new Date(event.endTime))
                      .subtract("330", "minutes")
                      .format("LT")}
                  </p>
                </div>
              </div>
              <div className="events-page-timeline">
                <div className="timeline-box">
                  <h5 className="text-16">Venue</h5>
                  <p className="text-18">{event.eventVenue}</p>
                </div>
                <div className="timeline-box">
                  <h5 className="text-16">Type</h5>
                  <p className="text-18">{event.eventType}</p>
                </div>
              </div>
              {/* <div className="events-page-timeline">
                
              </div>
              <div className="event-pages-timeline">
                
              </div> */}
            </div>
            <div className="event-about">
              <div className="event-details-title-bar">
                <div className="img-icon img-icon-medium">
                  <img src={AboutIcon} alt="" />
                </div>
                <h4 className="title-20">About This Event</h4>
              </div>
              <div className="event-desc text-16 text-16-para">
                {parse(event?.description || "")}
              </div>
              <div className="events-page-timeline">
                <div className="timeline-box">
                  <h5 className="text-16">Organiser Club</h5>
                  <div className="text-18 image-detail">
                    {" "}
                    <img src={event.eventOrganiserClub?.image} alt="" />
                    {event.eventOrganiserClub?.name}
                  </div>
                </div>
                {/* <div className="timeline-box">
                  <h5 className="text-16">Event Sponsors</h5>
                  {event.sponsors?.length !== 0
                    ? event.sponsors?.map((sponsor: any, index: number) => (
                        <div className="text-18 image-detail" key={index}>
                          {" "}
                          <img src={sponsor?.image} alt="" />
                          {sponsor?.name}
                        </div>
                      ))
                    : null}
                </div> */}
                <div
                  className="timeline-box"
                  style={{
                    display: event.eventType === "solo" ? "none" : "",
                  }}
                >
                  <h5 className="text-16">Participants</h5>
                  <p className="text-18">
                    {event.eventMinParticipants +
                      " to " +
                      event.eventMaxParticipants}
                  </p>
                </div>
              </div>
              <div className="events-page-timeline">
                <div
                  className="timeline-box"
                  style={
                    event.eventCoordinators?.length === 0
                      ? { display: "none" }
                      : { display: "initial" }
                  }
                >
                  <h5 className="text-16">Event Coordinators</h5>

                  {event.eventCoordinators?.length !== 0
                    ? event.eventCoordinators?.map(
                        (coordinator: any, index: number) => (
                          <p className="text-18" key={index}>
                            {coordinator.name + " " + `(${coordinator.phone})`}
                          </p>
                        )
                      )
                    : null}
                </div>
              </div>
            </div>
            <div className="event-rules">
              <div className="event-details-title-bar">
                <div className="img-icon img-icon-medium">
                  <img src={RulesIcon} alt="" />
                </div>
                <h4 className="title-20">Rules</h4>
              </div>
              <div className="event-desc text-16 text-16-para">
                {parse(event.rules || "")}
              </div>
            </div>
            <div className="event-prizes">
              <div className="event-details-title-bar">
                <div className="img-icon img-icon-medium">
                  <img src={PrizesIcon} alt="" />
                </div>
                <h4 className="title-20">Prizes</h4>
              </div>
              <div className="event-desc text-16 text-16-para">
                {parse(event.prizes || "")}
              </div>
            </div>
            {event.sponsors?.length !== 0 ? (
              <div className="event-sponsors">
                <div className="event-details-title-bar">
                  <div className="img-icon img-icon-medium">
                    <img src={SponsorIcon} alt="" />
                  </div>
                  <h4 className="title-20">Event Sponsors</h4>
                </div>
                {event.sponsors?.map((sponsor: any, index: number) => (
                  <div className="sponsor-company" key={index}>
                    <h4 className="text-18">{sponsor?.type} :</h4>
                    <div className="sponsor-detail">
                      <img src={sponsor?.image} alt="" />
                      {sponsor?.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="event-register">
              {token !== null && eventTimeType === "Past" ? (
                <div>
                  {event?.eventWinList?.length !== 0 ? (
                    <>
                      <div
                        className="event-details-title-bar"
                        style={{ marginBottom: "2rem" }}
                      >
                        <div className="img-icon img-icon-medium">
                          <img src={LeaderboardIcon} alt="" />
                        </div>
                        <h4 className="title-20">Leaderboard</h4>
                      </div>
                      <div className="leaderboard-table-container">
                        <div className="leaderboard-table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Prize</th>
                              </tr>
                            </thead>
                            <tbody>
                              {event?.eventWinList?.map(
                                (winner: any, index: number) => (
                                  <tr key={index}>
                                    <td>{winner?.position}.</td>
                                    <td>{winner?.userName}</td>
                                    <td>{winner?.prize}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <h4 className="text-16 text-16-para">
                    Thank you for attending{" "}
                    <span style={{ fontWeight: "bold" }}>{event.title}</span>{" "}
                    and making it a success!
                    <br />
                    We hope you enjoyed the experience. Looking forward to
                    meeting you again next time. Thank You.
                  </h4>
                </div>
              ) : (
                // ) : location.state === "Upcoming" ? (
                //   <h4>
                //     Registration will start from{" "}
                //     {moment(new Date(event.startTime)).format("ll")}
                //   </h4>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (token === null) {
                      navigate("/login");
                    } else {
                      if (user?.verified === false) {
                        navigate("/verify-account", {
                          state: {
                            locationHistory: location.pathname,
                          },
                        });
                      } else {
                        if (
                          event.otherPlatformUrl &&
                          event.otherPlatformUrl !== ""
                        ) {
                          window.open(event.otherPlatformUrl, "_blank");
                        } else if (event.isRegistered) {
                          navigate(`/my-tickets/${event.ticketId}`);
                        } else {
                          navigate("register", { state: event });
                        }
                      }
                    }
                  }}
                >
                  {event.isRegistered ? "View Ticket" : "Register"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
