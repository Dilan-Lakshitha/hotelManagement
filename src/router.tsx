import { Navigate, RouteObject } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import SidebarLayout from "./layouts/SidebarLayout";
import SignInForm from "./auth/signIn/signIn";
import SignUpForm from "./auth/signUp/signUp";
import MainDashboard from "./content/main-dashboard/main-dashboard";
import DriverDashboard from "./content/overview/driver/driverDashboard/driverDashboard";
import GuideDashboard from "./content/overview/guide/guideDashboard/guideDashboard";
import HotelDashboard from "./content/overview/Hotel/hotelDashboard/hotelDashboard";
import LocationDashboard from "./content/overview/location/locationDashboard/locationDashboard";
import TravelerDashboard from "./content/overview/traveler/travelerDashboard/travelerDashboard";

const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/signIn" replace />,
      },
      {
        path: 'signIn',
        element: <SignInForm />,
      },
      {
        path: 'signUp',
        element: <SignUpForm />,
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
        ]
      },
    ]
  },
  {
    path: '',
    element: isAuthenticated() ? <SidebarLayout /> : <Navigate to="/signIn" />,
    children: [
      {
        path: 'dashboard',
        element: <MainDashboard />,
      },
          {
            path: 'driver',
            element: <DriverDashboard />
          },
          {
            path: 'guide',
            element: <GuideDashboard />
          },
          {
            path: 'hotel',
            element: <HotelDashboard />
          },
          {
            path: 'location',
            element: <LocationDashboard/>
          },
          {
            path: 'traveler',
            element: <TravelerDashboard/>
          }
    ]
  }
  ];
  
  export default routes;
  