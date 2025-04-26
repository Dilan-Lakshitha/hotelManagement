import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  TextField,
  MenuItem,
  Button,
  TableContainer,
  TableBody,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../../../redux-store/stores/store";
import { hotels } from "../../../../shared/service/hotelService";
import { guides } from "../../../../shared/service/guideService";
import { drivers } from "../../../../shared/service/driverService";
import { locations } from "../../../../shared/service/locationService";
import { travelers } from "../../../../shared/service/travelerService";
import { bookingtourCreate } from "../../../../shared/service/bookingtourService";
import { toast } from "sonner";

function BookingDashboard() {
  const guideList = useSelector((state: any) => state.guide.guide);
  const hotelList = useSelector((state: any) => state.hotel.hotel);
  const driverList = useSelector((state: any) => state.driver.driver);
  const locationList = useSelector((state: any) => state.location.location);
  const travelerList = useSelector((state: any) => state.traveler.traveler);
  const dispatch: AppDispatch = useDispatch();

  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [nights, setNights] = useState<number>(1);

  // ✅ Multiple Hotels and Locations
  const [hotelBookings, setHotelBookings] = useState<
    { hotel: any; nights: number }[]
  >([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [selectedHotelNights, setSelectedHotelNights] = useState<number>(1);

  const [locationTickets, setLocationTickets] = useState<
    { location: any; days: number }[]
  >([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedLocationDays, setSelectedLocationDays] = useState<number>(1);
  const [selectedTraveler, setSelectedTraveler] = useState<any>(null);

  useEffect(() => {
    dispatch(hotels());
    dispatch(guides());
    dispatch(drivers());
    dispatch(locations());
    dispatch(travelers());
  }, [dispatch]);

  const calculateTotal = () => {
    const driverPrice = selectedDriver
      ? selectedDriver.vehiclePricePerKm * distanceKm
      : 0;

    const totalHotelPrice = hotelBookings.reduce(
      (acc, booking) => acc + booking.hotel.hotelRates[0].rate * booking.nights,
      0
    );

    const guidePrice = selectedGuide ? selectedGuide.pricePerDay * nights : 0;

    const locationTicketPrice = locationTickets.reduce(
      (acc, loc) => acc + loc.location.adult_price * loc.days,
      0
    );

    return driverPrice + totalHotelPrice + guidePrice + locationTicketPrice;
  };

  const addHotelBooking = () => {
    const hotel = hotelList.find((h: any) => h.hotel_id === selectedHotelId);
    if (hotel && selectedHotelNights > 0) {
      setHotelBookings([
        ...hotelBookings,
        { hotel, nights: selectedHotelNights },
      ]);
      setSelectedHotelId("");
      setSelectedHotelNights(1);
    }
  };

  const addLocationTicket = () => {
    const location = locationList.find(
      (l: any) => l.location_ticket_id === selectedLocationId
    );
    if (location && selectedLocationDays > 0) {
      setLocationTickets([
        ...locationTickets,
        { location, days: selectedLocationDays },
      ]);
      setSelectedLocationId("");
      setSelectedLocationDays(1);
    }
  };

  const handleBookTour = () => {
    if (!selectedTraveler) {
      toast.error("Please select a traveler.");
      return;
    }

    const payload = {
      travelerId: selectedTraveler.traveler_id,
      driverId: selectedDriver?.driverId || null,
      guideId: selectedGuide?.guideId || null,
      totalAmount: calculateTotal(),

      hotelBookings: hotelBookings.map((h) => ({
        hotel_id: h.hotel.hotel_id,
        nights: h.nights,
      })),

      locationTickets: locationTickets.map((l) => ({
        location_id: l.location.location_ticket_id,
        days: l.days,
      })),
    };

    submitForm(payload);
  };

  const submitForm = (data: any) => {
    dispatch(bookingtourCreate(data));
    toast.success("Itinerary updated successfully! 🎉");

    setSelectedTraveler(null);
    setSelectedDriver(null);
    setSelectedGuide(null);
    setDistanceKm(0);
    setNights(1);
    setHotelBookings([]);
    setLocationTickets([]);
  };

  return (
    <Container maxWidth="xl" className="mt-2">
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        Main Dashboard
      </Typography>
      <Typography variant="h6" sx={{ color: "black", mb: 4 }}>
        Overview of travel agency
      </Typography>

      <Box mt={6}>
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Create Invoice
          </Typography>
          <Grid container spacing={3}>
            {/* Selections */}

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Select Traveler"
                onChange={(e) =>
                  setSelectedTraveler(
                    travelerList.find(
                      (t: any) => t.traveler_id === e.target.value
                    )
                  )
                }
              >
                {travelerList.map((traveler: any) => (
                  <MenuItem
                    key={traveler.traveler_id}
                    value={traveler.traveler_id}
                  >
                    {traveler.name} ({traveler.email})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Select Driver"
                onChange={(e) =>
                  setSelectedDriver(
                    driverList.find((d: any) => d.driverId === e.target.value)
                  )
                }
              >
                {driverList.map((driver: any) => (
                  <MenuItem key={driver.driverId} value={driver.driverId}>
                    {driver.name} - {driver.vehiclePricePerKm} /km
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Select Guide"
                onChange={(e) =>
                  setSelectedGuide(
                    guideList.find((g: any) => g.guideId === e.target.value)
                  )
                }
              >
                {guideList.map((guide: any) => (
                  <MenuItem key={guide.guideId} value={guide.guideId}>
                    {guide.name} - {guide.pricePerDay} /day
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                type="number"
                label="Total Nights (for guide)"
                fullWidth
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
              />
            </Grid>

            {/* Distance */}
            <Grid item xs={12} md={6}>
              <TextField
                type="number"
                label="Distance (km)"
                fullWidth
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
              />
            </Grid>

            {/* Hotel Booking Section */}
            <Grid item xs={6} md={3}>
              <TextField
                select
                fullWidth
                label="Select Hotel"
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(e.target.value)}
              >
                {hotelList.map((hotel: any) => (
                  <MenuItem key={hotel.hotel_id} value={hotel.hotel_id}>
                    {hotel.hotel_name} - {hotel.hotelRates[0].rate} /night
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                type="number"
                label="Nights"
                fullWidth
                value={selectedHotelNights}
                onChange={(e) => setSelectedHotelNights(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                onClick={addHotelBooking}
                sx={{ mt: 1 }}
              >
                Add
              </Button>
            </Grid>

            {/* Location Ticket Section */}
            <Grid item xs={6} md={3}>
              <TextField
                select
                fullWidth
                label="Select Location"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
              >
                {locationList.map((loc: any) => (
                  <MenuItem
                    key={loc.location_ticket_id}
                    value={loc.location_ticket_id}
                  >
                    {loc.location_name} - {loc.adult_price} /day
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                type="number"
                label="Days"
                fullWidth
                value={selectedLocationDays}
                onChange={(e) =>
                  setSelectedLocationDays(Number(e.target.value))
                }
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                onClick={addLocationTicket}
                sx={{ mt: 1 }}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Item</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Qty</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Rate</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Subtotal</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDriver && (
                  <TableRow>
                    <TableCell>Driver</TableCell>
                    <TableCell>{selectedDriver.name}</TableCell>
                    <TableCell align="right">{distanceKm} km</TableCell>
                    <TableCell align="right">
                      ${selectedDriver.vehiclePricePerKm}
                    </TableCell>
                    <TableCell align="right">
                      $
                      {(selectedDriver.vehiclePricePerKm * distanceKm).toFixed(
                        2
                      )}
                    </TableCell>
                  </TableRow>
                )}

                {selectedGuide && (
                  <TableRow>
                    <TableCell>Guide</TableCell>
                    <TableCell>{selectedGuide.name}</TableCell>
                    <TableCell align="right">{nights} nights</TableCell>
                    <TableCell align="right">
                      ${selectedGuide.pricePerDay}
                    </TableCell>
                    <TableCell align="right">
                      ${(selectedGuide.pricePerDay * nights).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}

                {hotelBookings.map((h, i) => (
                  <TableRow key={`hotel-${i}`}>
                    <TableCell>Hotel</TableCell>
                    <TableCell>{h.hotel.hotel_name}</TableCell>
                    <TableCell align="right">{h.nights} nights</TableCell>
                    <TableCell align="right">
                      ${h.hotel.hotelRates[0].rate}
                    </TableCell>
                    <TableCell align="right">
                      ${(h.nights * h.hotel.hotelRates[0].rate).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {locationTickets.map((l, i) => (
                  <TableRow key={`location-${i}`}>
                    <TableCell>Location</TableCell>
                    <TableCell>{l.location.location_name}</TableCell>
                    <TableCell align="right">{l.days} days</TableCell>
                    <TableCell align="right">
                      ${l.location.adult_price}
                    </TableCell>
                    <TableCell align="right">
                      ${(l.days * l.location.adult_price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total Row */}
                <TableRow>
                  <TableCell rowSpan={1} />
                  <TableCell colSpan={3} align="right">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${calculateTotal().toFixed(2)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBookTour}
              sx={{ mt: 4 }}
            >
              Book Tour
            </Button>
          </TableContainer>
        </Card>
      </Box>
    </Container>
  );
}

export default BookingDashboard;
