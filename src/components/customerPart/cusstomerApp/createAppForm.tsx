import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { OrderType } from "../../tsTypes.js";
import { CustomerCreateApp } from "../customerOrders/customerCreateApp.jsx";
import { AppCustomerDriverPart } from "./appCustomerDriverPart.jsx";
import { AppFormExtra } from "../../documents/appFormExtra.jsx";
import "./customerApps.sass";

interface AppFormProps {
  order: OrderType;
}

export const CreateAppForm = ({ order }: AppFormProps) => {
  const dispatch: any = useDispatch();

  const user = useSelector((state: any) => state.oderReducer.currentUser);
  const customerOrders = useSelector(
    (state: any) => state.customerReducer.customerOrders
  );

  const [isNewApp, setIsNewApp] = useState<boolean>(true);
  const [appId, setAppId] = useState<number | null>(null);
  const [showPrintForm, setShowPrintForm] = useState<boolean>(false);

  const handleClickSaveApp = () => {
    console.log("Запускаем AppFormExtra");
    setIsNewApp(false);
  };
  useEffect(() => {
    if (isNewApp) {
      let id = order._id;
      let check = customerOrders.find((app: any) => app.orderId == id);
      if (check) {
        setIsNewApp(false);
        setAppId(check._id);
      } else {
        setIsNewApp(true);
      }
    } else {
      console.log("Добавлен заказ");
      let id = order._id;
      let check = customerOrders.find((app: any) => app.orderId == id);
      setAppId(check._id);
      setShowPrintForm(true);
    }
  }, [customerOrders]);
  return (
    <React.Fragment>
      {!showPrintForm ? (
        isNewApp ? (
          <CustomerCreateApp
            user={user}
            order={order}
            saveApp={handleClickSaveApp}
          >
            <AppCustomerDriverPart order={order} />
          </CustomerCreateApp>
        ) : (
          <CustomerCreateApp
            id={appId}
            user={user}
            closeWindow={handleClickSaveApp}
          >
            <AppCustomerDriverPart id={appId} />
          </CustomerCreateApp>
        )
      ) : (
        <AppFormExtra
          id={appId}
          isLogistApp={true}
          orderId={order._id}
          order={order}
        />
      )}
    </React.Fragment>
  );
};
