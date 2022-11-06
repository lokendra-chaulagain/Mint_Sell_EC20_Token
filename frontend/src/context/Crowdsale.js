import { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";
import { contractAbi, contractAddress } from "../utils/Constants";
import { ethers } from "ethers";

export const CrowdsaleContext = createContext();

export const CrowdsaleContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [accountBalance, setAccountBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [amount, setAmount] = useState(0);

  const connectionSuccess = () =>
    toast.success("Wallet connected Successfully ", {
      className: "toast_message_success",
    });
  const alreadyConnected = () =>
    toast.warning("Wallet Already Connected ! ", {
      className: "toast_message_success",
    });












  // Fetch contract and provider on every page refresh
  useEffect(() => {
    const onLoad = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const contract = new ethers.Contract(contractAddress, contractAbi, provider);
        setContract(contract);
      } catch (error) {
        console.log(error);
      }
    };
    onLoad();
  }, []);
  console.log("Provider :", provider);
  console.log("Contract :", contract);

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

        // const signer=provider.getSigner()
        // setSigner(signer)
        // console.log("Signer",signer);

        // const address=signer.getAddress()
        // setSignerAddress(address)
        // console.log("SignerAddress",signerAddress);
        getSigner(provider).then((signer) => {
          setSigner(signer);
        });

   





      } catch (error) {
        setLoading(true);
        console.log(error);
      }
    } else {
      setLoading(false);
      console.log("Please install metamask");
    }
  };



  const getSigner = async provider => {
    const signer = provider.getSigner();

    signer.getAddress()
      .then((address) => {
        setSignerAddress(address)
      })

    return signer;
  }


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

  // helper function to convert ethers to wei
  const toWei = (ether) => ethers.utils.parseEther(ether);

  // const buyToken = async () => {
  //   const wei = toWei(amount);
  //   await contract.connect(signer).buyToken(signerAddress, { value: wei });
  // };

  const buyTokens = async () => {
    const wei = toWei(amount);
    await contract.connect(signer).buyTokens(signerAddress, { value: wei });
  };

  return <CrowdsaleContext.Provider value={{ connectWallet, currentAccount, accountBalance, loading ,buyTokens,amount, setAmount}}>{children}</CrowdsaleContext.Provider>;
};
