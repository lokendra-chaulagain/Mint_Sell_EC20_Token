import React, { useContext } from "react";
import { FaBeer } from "react-icons/fa";
import MainCard from "../components/MainCard";
import Navbar from "../components/Navbar";

function Index() {
  return (
    <div className="app_body ">
      <Navbar />
      <div className="d-flex justify-content-center">
        <MainCard />
      </div>
    </div>
  );
}

export default Index;
