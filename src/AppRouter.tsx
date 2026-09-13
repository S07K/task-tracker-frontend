import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./error-page.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "./redux/eventActions.ts";
import LandingPage from "./LandingPage.tsx";
import UpcomingPage from "./pages/UpcomingPage.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";

const AppRouter: React.FC = () => {
  const token = useSelector((state: any) => state.event.token) || localStorage.getItem("token");
  const userId = useSelector((state: any) => state.event.userId) || localStorage.getItem("id");
  const dispatch = useDispatch();
  useEffect(() => {
    if(token) {
      dispatch(setToken(token));
    } else {
      dispatch(setToken(''));
    }

    if(userId) {
      dispatch(setUser(userId));
    } else {
      dispatch(setUser(''));
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to={"/home"} /> : <LandingPage /> } />
        <Route path="/login" element={token ? <Navigate to={"/home"} /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={token ? <App /> : <Navigate to={"/login"} />}>
          <Route index element={<UpcomingPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/*" element={<Navigate to={"/error"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
