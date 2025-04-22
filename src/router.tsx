import { Navigate, RouteObject } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import SidebarLayout from "./layouts/SidebarLayout";
import { lazy, Suspense } from "react";
import SuspenseLoader from "./components/SuspenseLoader";
import SignInForm from "./auth/signIn/signIn";
import SignUpForm from "./auth/signUp/signUp";
import MainDashboard from "./content/main-dashboard/main-dashboard";

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
            path: 'patinet',
            // element: <PatientDashboard />
          },
          {
            path: 'supplier',
            // element: <SupplierDashboard />
          },
          {
            path: 'drugs',
            // element: <DrugsDashboard />
          },
          {
            path: 'purchase',
            // element: <InvoiceComponent/>
          }
    ]
  }
  ];
  
  export default routes;
  