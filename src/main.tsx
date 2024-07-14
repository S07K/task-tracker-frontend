import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import AppRouter from "./AppRouter.tsx";

const theme = extendTheme({
  fonts: {
    heading: "'Montserrat Regular', sans-serif",
    body: "'Montserrat Regular', sans-serif",
  },
  styles: {
    global: {
      body: {
        color: "#333",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
