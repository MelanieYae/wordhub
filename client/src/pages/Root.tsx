import { Outlet, useLocation } from "react-router-dom";
import { UserProvider } from "../providers/UserProvider";
import DefaultNav from "../components/nav/DefaultNav";
import { useEffect } from "react";


export default function Root() {

  return (
    <UserProvider>
      <DefaultNav />
      <div className="pt-[75px]">
        <Outlet />
      </div>
    </UserProvider>
  );
}
