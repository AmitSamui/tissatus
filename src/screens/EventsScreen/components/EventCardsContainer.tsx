import React from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";

const EventCardsContainer: React.FC<any> = ({ state, events, user }) => {
  return (
    <>
      {events.length !== 0 ? (
        <div className="event-cards">
          {events.map((event: any, index: number) => (
            <EventCard key={index} event={event} state={state} user={user} />
          ))}
        </div>
      ) : (
        <h4 style={{ textAlign: "center", fontWeight: 500 }}>
          No {state} events found
        </h4>
      )}
    </>
  );
};

export default EventCardsContainer;
