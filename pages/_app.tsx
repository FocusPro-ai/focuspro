import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { store } from "../app/store";
import { Provider } from "react-redux";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-datepicker/dist/react-datepicker.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Head from "next/head";
// import Analytics from "@june-so/analytics-node";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  // const client = new Analytics("Kh1nkoO8kX6bKr2v");
  const queryClient = new QueryClient();
  // useEffect(()=> {
  //   client.identify({
  //     userId:'019mr8mf4r',
  //     traits : {
  //       name:"",
  //       email:"",

  //     }
  //   })
  // },[])
  <Head>
    <meta
      name="google-site-verification"
      content="vPUCxIZjnbYP--FUX0-WtP_y41HpjPhRy0giwRzIKko"
    />
  </Head>;
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
