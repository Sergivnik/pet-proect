import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { App } from "../App.jsx";
import { SomeComponent } from "./someComponent/someComonent.jsx";
import { Oders } from "./oders/oders.jsx";
import { Auth } from "./auth/auth.jsx";
import { useSelector, useDispatch } from "react-redux";
import { authGetUser } from "../actions/auth.js";
import { CustomerOrders } from "./customerPart/customerOrders/customerOrders.jsx";

export const Router = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authGetUser());
  }, [dispatch]);

  const user = useSelector((state) => state.oderReducer.currentUser);
  const checkUser = !!user?.name;

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/something"
        element={checkUser ? <SomeComponent /> : <Auth />}
      />
      <Route
        path="/oders"
        element={
          checkUser &&
          (["admin", "accounter", "logist"].includes(user.role)) ? (
            <Oders />
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/customer"
        element={
          checkUser &&
          (["admin", "customerBoss", "customerManager"].includes(user.role)) ? (
            <CustomerOrders />
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/auth"
        element={
          user.role === "admin" || !checkUser ? <Auth /> : <App />
        }
      />
    </Routes>
  );
};
