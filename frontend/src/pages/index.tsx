import React from "react";
import MainCard from "../components/MainCard";
import Navbar from "../components/Navbar";

function Index() {
  return (
    <div className="app_body ">
      <Navbar />
      <div className="d-flex justify-content-center px-2">
        <MainCard />
      </div>
    </div>
  );
}

export default Index;
