import React from "react";
import { ChakraProvider, background, extendTheme } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./error-page.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import Login from "./Login.tsx";
import Register from "./Register.tsx";

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

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <App />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
