import { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";
import { contractAbi, contractAddress } from "../utils/Constants";
import { ethers } from "ethers";

export const CrowdsaleContext = createContext();

export const CrowdsaleContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [accountBalance, setAccountBalance] = useState("");
  const [loading, setLoading] = useState(false);



  const connectionSuccess = () =>
    toast.success("Wallet connected Successfully ", {
      className: "toast_message_success",
    });
  const alreadyConnected = () =>
    toast.warning("Wallet Already Connected ! ", {
      className: "toast_message_success",
    });

  // This function runs on every page refresh and gets connected wallet address
  useEffect(() => {
    const getCurrentlyConnectedWalletAddress = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          // get first account
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);

            // account present then get balance
            const balance = await window.ethereum.request({ method: "eth_getBalance", params: [currentAccount, "latest"] });
            console.log("Balance not formatted :", balance);

            setAccountBalance(ethers.utils.formatEther(balance));
            console.log("Balance not formatted ether:", accountBalance);
          } else {
            console.log("Wallet is not connected please try again once ");
          }
        } catch (error) {
          console.log("Please install metamask");
        }
      }
    };
    getCurrentlyConnectedWalletAddress();
  }, [accountBalance, currentAccount]);

  console.log(accountBalance);

  // Connect wallet function
  const connectWallet = async () => {
    setLoading(true);
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);

        setLoading(false);

        {
          currentAccount ? alreadyConnected() : connectionSuccess();
        }


        console.log(`Wallet connected successfully and wallet address is ${accounts[0]}`);
      } catch (error) {
        setLoading(true);
        console.log(error);
      }
    } else {
      setLoading(false);
      console.log("Please install metamask");
    }
  };

  // Function that listen on account changed
  useEffect(() => {
    !currentAccount && setCurrentAccount("");
    !currentAccount && setAccountBalance("");
    const walletRemovedOrWalletChangedListener = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        window.ethereum.on("accountsChanged", (accounts) => {
          setCurrentAccount(accounts[0]);
        });
      } else {
        console.log("Please install metamask");
      }
    };
    walletRemovedOrWalletChangedListener();
  }, [currentAccount]);

  return <CrowdsaleContext.Provider value={{ connectWallet, currentAccount, accountBalance, loading }}>{children}</CrowdsaleContext.Provider>;
};
