import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography, Box } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicationIcon from "@mui/icons-material/Medication";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";

function MainDashboard() {

  return (
    <Container maxWidth="xl" className="mt-2">
      <h1
        style={{
          color: "#211a52",
          fontSize: "2rem",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        Main Dashboard
      </h1>
      <h3
        style={{
          color: "black",
          fontSize: "1.5rem",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        Overview of travel agency
      </h3>
      <Card sx={{ p: 2, mb: 10, borderRadius: 1 }}>
        <Outlet />
      </Card>
    </Container>
  );
}

export default MainDashboard;