import { RouteObject, Navigate } from "react-router-dom";
import EventDetails from "./screens/EventsScreen/components/EventDetails";
import EventRegister from "./screens/EventsScreen/components/EventRegister";
import EventsPage from "./screens/EventsScreen/EventsPage";
import Layout from "./screens/Layout/Layout";
import LoginPage from "./screens/LoginScreen/LoginPage";
import UserInfo from "./screens/ProfileScreen/components/UserInfo/UserInfo";
import UserQR from "./screens/ProfileScreen/components/UserQR/UserQR";
import TicketPage from "./screens/ProfileScreen/components/UserTickets/TicketPage";
import UserTickets from "./screens/ProfileScreen/components/UserTickets/UserTickets";
import UserWallet from "./screens/ProfileScreen/components/UserWallet/UserWallet";
import RegisterPage from "./screens/RegisterScreen/RegisterPage";
import ResetPasswordScreen from "./screens/ResetPasswordScreen/ResetPasswordScreen";
import VerifyAccountScreen from "./screens/VerifyAccountScreen/VerifyAccountScreen";

const routeConfig: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={"/events"} />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/events/:eventId",
        element: <EventDetails />,
      },
      {
        path: "/events/:eventId/register",
        element: <EventRegister />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordScreen />,
      },
      {
        path: "/verify-account",
        element: <VerifyAccountScreen />,
      },
      {
        path: "/my-qr-code",
        element: <UserQR />,
      },
      {
        path: "/my-info",
        element: <UserInfo />,
      },
      {
        path: "/my-wallet",
        element: <UserWallet />,
      },
      {
        path: "/my-tickets",
        element: <UserTickets />,
      },
      {
        path: "/my-tickets/:ticketId",
        element: <TicketPage />,
      },
    ],
  },
];

export default routeConfig;
