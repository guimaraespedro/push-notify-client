import React from "react";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { Main } from "../pages/Main";
import { useAuth } from "../hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

const AuthRedirector = ({ element: Element, ...rest }) => {
  const { sessionData } = useAuth();

  return sessionData && sessionData.token && sessionData.user ? (
    <Navigate to={{ pathname: "/main" }} />
  ) : (
    <Outlet />
  );
};

const PrivateRoute = () => {
  const { sessionData } = useAuth();

  return sessionData && sessionData.token && sessionData.user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthRedirector />}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/main/" element={<Main />} />
      </Route>
    </>
  )
);
