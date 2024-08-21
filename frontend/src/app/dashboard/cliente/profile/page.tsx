"use client";

import DashboardProfile from "@/components/DashboardComponent/DashboardProfile";
import { useAuthContext } from "@/context/auth.context";
import { Spinner } from "@material-tailwind/react";

const Profile = () => {


  const { session, authLoading } = useAuthContext();
  //! Obtener token de usuario
  return (
    authLoading ? <div className="flex items-center justify-center h-screen">
    <Spinner
      color="teal"
      className="h-12 w-12"
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  </div> :
    <DashboardProfile session={session} />
  );
};

export default Profile;