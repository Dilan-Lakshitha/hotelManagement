import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  IconButton,
  Box,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux-store/stores/store";
import { hotels } from "../../../../shared/service/hotelService";
import { locations } from "../../../../shared/service/locationService";
type DayPlan = {
  dayNumber: number;
  date: string;
  location: string;
  activities: string;
  hotelId: string;
  locationTicketId: string;
};

type ItineraryFormProps = {
  onSubmit: (itinerary: any) => void;
  isEditMode: boolean;
};

const ItineraryForm = ({ onSubmit, isEditMode}: ItineraryFormProps) => {
    const [itinerary, setItinerary] = useState({
        startDate: "",
        endDate: "",
        dailyPlans: [] as DayPlan[],
      });

  const hotelList = useSelector((state: any) => state.hotel.hotel);
  const locationTicketList = useSelector(
    (state: any) => state.location.location
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(hotels());
    dispatch(locations());
  }, [dispatch]);

  const handleChange = useCallback((index: number, field: any, value: any) => {
    setItinerary((prev) => {
      const updatedPlans = [...prev.dailyPlans];
      updatedPlans[index] = { ...updatedPlans[index], [field]: value };
      return { ...prev, dailyPlans: updatedPlans };
    });
  }, []);

  const handleAddDay = () => {
    setItinerary({
      ...itinerary,
      dailyPlans: [
        ...itinerary.dailyPlans,
        {
          dayNumber: itinerary.dailyPlans.length + 1,
          date: "",
          location: "",
          activities: "",
          hotelId: "",
          locationTicketId: "",
        },
      ],
    });
  };

  const handleRemoveDay = (index: number) => {
    const updatedPlans = itinerary.dailyPlans.filter((_, i) => i !== index);
    const reIndexed = updatedPlans.map((item, i) => ({
      ...item,
      dayNumber: i + 1,
    }));
    setItinerary({ ...itinerary, dailyPlans: reIndexed });
  };

  console.log("itinerary", itinerary);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(itinerary);
      }}
    >
      <Box component="form"  >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Add New Itinerary
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            // onClick={onClose}
            size="small"
            variant="contained"
            sx={{ backgroundColor: "#261140" }}
          >
            Itinerary list
          </Button>
        </Box>

        <Card sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={itinerary.startDate}
                onChange={(e) =>
                  setItinerary({ ...itinerary, startDate: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={itinerary.endDate}
                onChange={(e) =>
                  setItinerary({ ...itinerary, endDate: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </Card>

        {itinerary.dailyPlans.map((plan, index) => (
          <Card key={index} sx={{ mb: 4, p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={1.5}>
                <TextField
                  label="Day"
                  fullWidth
                  value={plan.dayNumber}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={plan.date}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Location"
                  fullWidth
                  value={plan.location}
                  onChange={(e) =>
                    handleChange(index, "location", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Activities"
                  fullWidth
                  value={plan.activities}
                  onChange={(e) =>
                    handleChange(index, "activities", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel id={`hotel-select-label-${index}`}>
                    Hotel
                  </InputLabel>
                  <Select
                    labelId={`hotel-select-label-${index}`}
                    value={plan.hotelId}
                    label="Hotel"
                    onChange={(e) =>
                      handleChange(index, "hotelId", e.target.value)
                    }
                  >
                    {hotelList?.map((hotel: any) => (
                      <MenuItem key={hotel.hotel_id} value={hotel.hotel_id}>
                        {hotel.hotel_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel id={`ticket-select-label-${index}`}>
                    Location Ticket
                  </InputLabel>
                  <Select
                    labelId={`ticket-select-label-${index}`}
                    value={plan.locationTicketId}
                    label="Location Ticket"
                    onChange={(e) =>
                      handleChange(index, "locationTicketId", e.target.value)
                    }
                  >
                    {locationTicketList?.map((ticket: any) => (
                      <MenuItem
                        key={ticket.location_ticket_id}
                        value={ticket.location_ticket_id}
                      >
                        {ticket.location_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={0.5}>
                <Box display="flex" justifyContent="center">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleRemoveDay(index)}
                    disabled={itinerary.dailyPlans.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Card>
        ))}

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            sx={{ borderColor: "#261140" }}
            onClick={handleAddDay}
          >
            <p style={{ color: "#261140" }}>Add Day</p>
          </Button>

          <Button
            size="small"
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#261140" }}
          >
            Submit Itinerary
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default ItineraryForm;
