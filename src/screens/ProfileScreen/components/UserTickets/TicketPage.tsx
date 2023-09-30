import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import EventImg from "../../../../assets/event-img.png";
import DSCLogo from "../../../../assets/dsc-logo.png";
import EspektroLogo from "../../../../assets/espektro-small-logo.svg";
import EspektroImg from "../../../../assets/espektro-black-logo.png";
import { QRCode } from "react-qrcode-logo";
import "./TicketPage.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getUserFromlocalStorage,
  SingleEvent,
  SingleTicket,
} from "../../../../api/api";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader/Loader";
import { useReactToPrint } from "react-to-print";

const TicketPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const ticketId = params.ticketId;
  const location = useLocation();
  const [ticket, setTicket] = useState<any>({});
  const [event, setEvent] = useState<any>({});
  const token = localStorage.getItem("UserAuthToken");
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  // const fetchEventDeatils = async (eventId: string) => {
  //   try {
  //     const { data } = await SingleEvent(eventId);
  //     // console.log(data.event);
  //     setEvent(data.event);
  //     setLoading(false);
  //     toast.success(data.message);
  //   } catch (error: any) {
  //     setLoading(false);
  //     toast.error(error.response.data.message, {
  //       position: "top-center",
  //     });
  //   }
  // };

  const ticketRef = useRef<any>();
  const handleTicketPrint = useReactToPrint({
    content: () => ticketRef.current,
    removeAfterPrint: false,
    documentTitle: `${user?.name}-${event?.title}-Ticket`,
    pageStyle:
      "@media print {html, body { width: 100%; height: 100vh; margin: 0 !important; padding: 0 !important; overflow: hidden; display: flex; -items: center; justify-content: center; position: relative;} @page {scale: unset}}",
  });

  const fetchTicketDetails = async (ticketId: string) => {
    setLoading(true);
    try {
      const { data } = await SingleTicket(ticketId);
      // console.log(data);
      setTicket(data.ticket);
      setEvent(data.event);
      // setTimeout(() => setLoading(false), 1000);
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
    if (ticketId) {
      fetchTicketDetails(ticketId);
    }
  }, [ticketId]);

  useEffect(() => {
    if (token) {
      const userData = getUserFromlocalStorage();
      // console.log(userData);
      if (userData) {
        setUser(userData);
      }
    }
  }, [token]);

  return (
    <div className="container ticket-page-container">
      <div className="wrapper ticket-page-wrapper">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="ticket-page-cta-buttons">
              <span
                className="back-icon circular-btn back-btn"
                onClick={() => navigate("/my-tickets")}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </span>
              <span
                className="circular-btn download-btn"
                onClick={() => {
                  if (ticketId) {
                    fetchTicketDetails(ticketId);
                  }
                }}
                // onClick={() => {
                //   // console.log(user, event);
                //   handleTicketPrint();
                // }}
              >
                <i className="fa-solid fa-arrows-rotate"></i>
              </span>
            </div>
            <div className="ticket-page-details">
              {ticket?.checkedIn ? (
                <div className="checked-in">
                  <h4 className="text-16">Ticket No : </h4>
                  <h4
                    className="text-16 text-blue"
                    style={{ fontWeight: "600" }}
                  >
                    {ticket?.ticketNumber}
                  </h4>
                </div>
              ) : null}
              <div className="ticket-page" ref={ticketRef}>
                <div className="event-column">
                  <img src={EspektroImg} alt="" className="ticket-bg-img" />
                  <div className="event-img">
                    <div className="fest-detail">
                      <h3 className="title-20">Espektro-KGEC</h3>
                      <span>2023</span>
                    </div>
                    <img
                      src={
                        event.eventImages?.length !== 0
                          ? event.eventImages?.[0].url
                          : EventImg
                      }
                      alt=""
                    />
                  </div>
                  <h3 className="title-20">{event?.title}</h3>
                  <div className="ticket-detail">
                    <span className="label">Organizer:</span>
                    <span className="text">
                      {event?.eventOrganiserClub?.name}
                    </span>
                  </div>
                  <div className="event-details">
                    <p className="text-16">
                      <i className="fa-solid fa-calendar"></i>{" "}
                      {moment(new Date(event?.startTime))
                        .subtract("330", "minutes")
                        .format("LL")}
                    </p>
                    <p className="text-16">
                      <i className="fa-solid fa-location-dot"></i>{" "}
                      {event?.eventVenue}
                    </p>
                    <p className="text-16">
                      <i className="fa-solid fa-clock"></i>{" "}
                      {moment(new Date(event?.startTime))
                        .subtract("330", "minutes")
                        .format("LT")}{" "}
                      IST
                    </p>
                  </div>
                  <div className="clubs">
                    <div className="club-detail">
                      <img
                        src={
                          event?.eventOrganiserClub?.image
                            ? event?.eventOrganiserClub?.image
                            : DSCLogo
                        }
                        alt=""
                      />
                      <span>{event?.eventOrganiserClub?.name}</span>
                    </div>
                    <span>X</span>
                    <div className="club-detail">
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          display: "grid",
                          placeContent: "center",
                          backgroundColor: "black",
                        }}
                      >
                        <img
                          src={EspektroLogo}
                          style={{ width: "20px" }}
                          alt=""
                        />
                      </div>
                      <span>Espektro KGEC</span>
                    </div>
                  </div>
                </div>
                <div className="QR-column">
                  <h3 className="title-20">{ticket?.team?.name}</h3>
                  {event?.eventType === "group" ? (
                    <div className="event-team-members">
                      {ticket?.team?.members?.map(
                        (member: any, index: number) => (
                          <p key={index}>
                            {index + 1}. {member.name}
                          </p>
                        )
                      )}
                    </div>
                  ) : null}
                  <div className="ticket-qr-img-box">
                    <QRCode
                      value={ticket?._id}
                      ecLevel="H"
                      size={100}
                      quietZone={25}
                      qrStyle="dots"
                      eyeRadius={10}
                      removeQrCodeBehindLogo={true}
                      // logoImage={KGECImg}
                      // logoWidth={35}
                      // logoHeight={35}
                      // bgColor="#fff"
                      // fgColor="#4a7fd4"
                      // bgColor="#33c75a"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
