import React, { useEffect, useState } from "react";
import moment from "moment";
import EventImg from "../../../assets/event-img.png";
import CoinImg from "../../../assets/coin.png";
import { useNavigate } from "react-router-dom";
import { validateEventPrice } from "../../Layout/Layout";
import { getUserFromlocalStorage } from "../../../api/api";

const EventCard: React.FC<any> = ({ event, state, user }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("UserAuthToken");

  return (
    <div className="event-card">
      <div
        className="image"
        style={{
          backgroundImage:
            event.eventImages?.length !== 0
              ? `url(${event.eventImages?.[0].url})`
              : "none",
        }}
      >
        <img
          src={
            event.eventImages?.length !== 0
              ? event.eventImages?.[0].url
              : EventImg
          }
          alt=""
        />
      </div>
      <div className="details">
        <span
          className="left-border-element"
          style={{
            backgroundColor:
              state === "Past"
                ? "#ff7272"
                : state === "Ongoing"
                ? "#4a7fd4"
                : state === "Upcoming"
                ? "#af70ff"
                : "#fff",
          }}
        ></span>
        <div className="event-title-tagline">
          <h3 className="text-16">{event.title}</h3>
          <span className="title-tagline title-tagline-small">
            {event.tagLine}
          </span>
        </div>
        <div className="timeline">
          <div className="text-details-row">
            <div className="text-details">
              <span className="label">Type:</span>
              <span className="text">{event.eventType}</span>
            </div>
            <div className="text-details">
              <span className="label">Price:</span>
              <div className="coin-details text">
                <span>
                  {token === null
                    ? event.eventPrice
                    : validateEventPrice(user, event)}
                </span>
                {/* {(!event.eventPriceForKGEC)?"(" + event.eventPriceForKGEC + " for KGEC) ":" "}</span>                 */}
                <img src={CoinImg} className="coin-icon" alt="" />
                <span> coins</span>
              </div>
            </div>
          </div>
          <div className="text-details">
            <span className="label">Organiser Club:</span>
            <div className="text image-detail">
              {" "}
              <img src={event.eventOrganiserClub?.image} alt="" />
              {event.eventOrganiserClub?.name}
            </div>
          </div>
          <div className="text-details-row">
            <div className="text-details">
              <span className="label">Start Date:</span>
              <span className="text">
                {moment(new Date(event.startTime))
                  .subtract("330", "minutes")
                  .format("ll")}
              </span>
            </div>
            <div className="text-details">
              <span className="label">Time:</span>
              <span className="text">
                {moment(new Date(event.startTime))
                  .subtract("330", "minutes")
                  .format("LT")}
              </span>
            </div>
          </div>
          <div className="text-details-row">
            <div className="text-details">
              <span className="label">End Date:</span>
              <span className="text">
                {moment(new Date(event.endTime))
                  .subtract("330", "minutes")
                  .format("ll")}
              </span>
            </div>
            <div className="text-details">
              <span className="label">Time:</span>
              <span className="text">
                {moment(new Date(event.endTime))
                  .subtract("330", "minutes")
                  .format("LT")}
              </span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(event._id, {
              state: {
                eventTimeType: state,
                user: user,
              },
            })
          }
        >
          View Event
        </button>
      </div>
    </div>
  );
};

export default EventCard;
