import moment from "moment";
import React, { useEffect, useState } from "react";
import EventImg from "../../assets/event-img.png";
import CoinImg from "../../assets/coin.png";
import EspektroImg from "../../assets/espektro-black-logo.png";
import "./Ticket.scss";
import { useLocation, useNavigate } from "react-router-dom";

const Ticket: React.FC<any> = ({ ticket, event, user, eventPrice }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (    
    <div className="ticket" onClick={() => navigate(ticket._id)}>
      <div className="event-column">
        <img src={EspektroImg} alt="" className="ticket-bg-img" />
        <div className="event-img">
          <img
            src={
              event.eventImages?.length !== 0
                ? event.eventImages?.[0].url
                : EventImg
            }
            alt=""
          />
        </div>
        <div className="ticket-title-bar">
          <h3 className="title-20">{event.title}</h3>
          {location.pathname === "/my-tickets" ? (
            <span className="view-btn" onClick={() => navigate(ticket._id)}>
              <i className="fa-solid fa-eye"></i>
            </span>
          ) : null}
        </div>
        <div className="ticket-detail">
          <span className="label">Organizer:</span>
          <span className="text">{event.eventOrganiserClub.name}</span>
        </div>
        <div className="event-details">
          <p className="text-16">
            <i className="fa-solid fa-calendar"></i>{" "}
            {moment(new Date(event.startTime)).subtract("330", "minutes").format("LL")}
          </p>
          <p className="text-16">
            <i className="fa-solid fa-location-dot"></i> {event.eventVenue}
          </p>
          <p className="text-16">
            <i className="fa-solid fa-clock"></i>{" "}
            {moment(new Date(event.startTime)).subtract("330", "minutes").format("LT")} IST
          </p>
        </div>
      </div>
      {/* <span className="seperator"></span> */}      
      <div className="user-detail-column">
        <h4 className="fest-title">#espektro'23</h4>
        <h3 className="title-20">{user.name}</h3>
        <div className="ticket-detail">
          <span className="label">Event Type:</span>
          <span className="text">{event.eventType}</span>
            {
              event.eventType === "group" ? (
                <>
                  ({event.eventMinParticipants} - {event.eventMaxParticipants})
                </>
              ):null
            }
        </div>
        <div className="price-detail">
          <p className="text-18 text-18-title">Price</p>
          <div className="coin-detail">
            <span>{eventPrice}</span>
            <img src={CoinImg} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
