import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { CrowdsaleContextProvider } from "../context/Crowdsale";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("bootstrap");
  }, []);
  return (
    <CrowdsaleContextProvider>
      <Component {...pageProps} />
    </CrowdsaleContextProvider>
  );
}

export default MyApp;
