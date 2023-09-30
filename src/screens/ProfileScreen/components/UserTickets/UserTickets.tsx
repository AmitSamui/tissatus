import React, { useState, useEffect } from "react";
import { AllTickets, getUserFromlocalStorage } from "../../../../api/api";
import Ticket from "../../../../components/Ticket/Ticket";
import "./UserTickets.scss";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader/Loader";
import { validateEventPrice } from "../../../Layout/Layout";

const UserTickets: React.FC<any> = () => {
  const [tickets, setTickets] = useState<any>([]);
  // const [event, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("UserAuthToken");
  // const user = JSON.parse(localStorage.getItem("user") || "");
  const [user, setUser] = useState<any>({});

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const { data } = await AllTickets();
      // console.log(data.tickets);
      setTickets(data.tickets);
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
    if (token) {
      const userData = getUserFromlocalStorage();
      // console.log(userData);
      if (userData) {
        setUser(userData);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAllTickets();
    }
  }, []);

  return (
    <div className="container user-tickets-container">
      <div className="wrapper user-tickets-wrapper">
        <h3 className="title-20">My Tickets</h3>
        {loading ? (
          <Loader />
        ) : tickets.length !== 0 ? (
          <div className="tickets-box">
            {tickets.map((ticket: any) => (
              <Ticket
                key={ticket._id}
                ticket={ticket}
                event={ticket.event[0]}
                user={user}
                eventPrice={
                  token === null
                    ? ticket.event[0].eventPrice
                    : validateEventPrice(user, ticket.event[0])
                }
              />
            ))}
          </div>
        ) : (
          <h4 style={{ textAlign: "center", fontWeight: 500 }}>
            No tickets events found
          </h4>
        )}
      </div>
    </div>
  );
};

export default UserTickets;
