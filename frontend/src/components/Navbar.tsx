import React, { useContext } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { CrowdsaleContext } from "../context/Crowdsale";

const Navbar = () => {
  const { connectWallet, currentAccount, accountBalance, loading } = useContext(CrowdsaleContext);

  return (
    <div className="pt-3 px-4 d-flex container justify-content-end">
      <button
        onClick={connectWallet}
        type="button"
        className="custom_button d-flex align-items-center justify-content-center btn px-4 py-2 rounded-pill">
        {loading && !currentAccount ? <BeatLoader color="#1e5262" /> : currentAccount ? "Connected" : "Connect Wallet"}
      </button>
    </div>
  );
};

export default Navbar;
