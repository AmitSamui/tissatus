import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import "./App.scss";
import routeConfig from "./routes";

const App: React.FC = () => {
  const routes = useRoutes(routeConfig);

  // useEffect(() => {
  //   // console.log("hello");
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, []);

  return <div className="App">{routes}</div>;
};

export default App;
