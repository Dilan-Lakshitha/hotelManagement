import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import HotelIcon from "@mui/icons-material/Hotel";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { guides } from "../../shared/service/guideService";
import { useEffect } from "react";
import { hotels } from "../../shared/service/hotelService";
import { drivers } from "../../shared/service/driverService";
import { AppDispatch } from "../../redux-store/stores/store";
import { bookingtours } from "../../shared/service/bookingtourService";
import BookingtourTable from "./bookingTable";
import { travelers } from "../../shared/service/travelerService";

function MainDashboard() {
  const guideList = useSelector((state: any) => state.guide.guide);
  const hotelList = useSelector((state: any) => state.hotel.hotel);
  const driverList = useSelector((state: any) => state.driver.driver);
  const bookingList = useSelector((state: any) => state.bookingtour.bookingtour);
  const travelerList = useSelector((state: any) => state.traveler.traveler);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(hotels());
    dispatch(guides());
    dispatch(drivers());
    dispatch(bookingtours());
    dispatch(travelers());
  }, [dispatch]);

  const stats = [
    {
      title: "Drivers",
      count: driverList?.length || 0,
      icon: <DirectionsBusIcon fontSize="large" />,
      color: "#f39c12",
    },
    {
      title: "Guides",
      count: guideList?.length || 0,
      icon: <EmojiPeopleIcon fontSize="large" />,
      color: "#27ae60",
    },
    {
      title: "Hotels",
      count: hotelList?.length || 0,
      icon: <HotelIcon fontSize="large" />,
      color: "#2980b9",
    },
  ];

  return (
    <Container maxWidth="xl" className="mt-2">
      <Typography
        variant="h4"
        style={{
          color: "#211a52",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        Main Dashboard
      </Typography>
      <Typography variant="h6" sx={{ color: "black", mb: 4 }}>
        Overview of travel agency
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 4,
                backgroundColor: item.color,
                color: "white",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h5">{item.title}</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {item.count}
                    </Typography>
                  </Box>
                  <Box>{item.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6}>
        <Card sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
          <Outlet />
          <BookingtourTable 
          Bookingtours={bookingList || []} 
          driverList={driverList || []}
          guideList={guideList || []}
          travelerList={travelerList || []}
          />
        </Card>
      </Box>
    </Container>
  );
}

export default MainDashboard;