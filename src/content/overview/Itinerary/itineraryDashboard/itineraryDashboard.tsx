import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { toast } from "sonner";
import Icon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import ItineraryForm from "./itineraryForm";
import ItineraryTable from "./itineraryTable";
import { Controller, useForm } from "react-hook-form";
import { AppDispatch } from "../../../../redux-store/stores/store";
import {
  itineraryCreate,
  itinerarys,
  updateitinerary,
} from "../../../../shared/service/itineraryService";
import { Delete } from "@mui/icons-material";
import { locations } from "../../../../shared/service/locationService";
import { hotels } from "../../../../shared/service/hotelService";
type DayPlan = {
  dayNumber: number;
  date: string;
  location: string;
  activities: string;
  hotelId: string;
  locationTicketId: string;
};

function ItineraryDashboard() {
  const itineraryList = useSelector((state: any) => state.itinerary.itinerary);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [itinerary, setItinerary] = useState({
    startDate: "",
    endDate: "",
    dailyPlans: [] as DayPlan[],
  });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { isDirty, isValid, errors },
  } = useForm({ mode: "onChange" });
  const hotelList = useSelector((state: any) => state.hotel.hotel);
  const locationTicketList = useSelector(
    (state: any) => state.location.location
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(hotels());
    dispatch(locations());
    dispatch(itinerarys());
  }, [dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
    setItinerary({
      startDate: "",
      endDate: "",
      dailyPlans: [
        {
          dayNumber: 1,
          date: "",
          location: "",
          activities: "",
          hotelId: "",
          locationTicketId: "",
        },
      ],
    });
  };

  const handleEdit = (itinerary: any) => {
    console.log("itinerary", itinerary);
    setItinerary(itinerary);
    setSelectedItinerary(itinerary);
    setIsEditMode(true);
    setOpen(true);
  };

  const submitForm = (data: any) => {
    const itineraries = {
      startDate: data.startDate,
      endDate: data.endDate,
      dailyPlans: itinerary.dailyPlans,
    };

    const payload = {
      ...itineraries,
    };

    if (isEditMode) {
      const payloadupdate = {
        ...itineraries,
        itineraryId: selectedItinerary.itinerary_id,
      };
      dispatch(updateitinerary(payloadupdate));
      toast.success("Itinerary updated successfully! 🎉");
      handleClose();
    } else {
      dispatch(itineraryCreate(payload));
      toast.success("Itinerary added successfully! 🎉");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItinerary(null);
    setIsEditMode(false);
    reset();
  };

  const handleChange = useCallback(
    (index: number, field: string, value: any) => {
      setItinerary((prev) => {
        const updatedPlans = [...prev.dailyPlans];
        updatedPlans[index] = { ...updatedPlans[index], [field]: value };
        return { ...prev, dailyPlans: updatedPlans };
      });

      setValue(`dailyPlans.${index}.${field}`, value);
    },
    [setValue]
  );

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

  useEffect(() => {
    if (selectedItinerary) {
      const formattedDailyPlans = selectedItinerary.dailyPlans.map(
        (plan: any) => {
          const hotel = hotelList.find(
            (h: any) => h.hotel_id === plan.hotel_id
          );
          const locationTicket = locationTicketList.find(
            (t: any) => t.location_ticket_id === plan.location_ticket_id
          );
          return {
            dayNumber: plan.day_number,
            date: plan.date?.slice(0, 10),
            location: plan.location,
            activities: plan.activities,
            hotelId: plan.hotel_id,
            hotelName: hotel?.hotel_name || null,
            locationTicketId: plan.location_ticket_id,
            locationTicketName: locationTicket?.location_name || null,
          };
        }
      );

      setItinerary({
        startDate: selectedItinerary.start_date.slice(0, 10),
        endDate: selectedItinerary.end_date.slice(0, 10),
        dailyPlans: formattedDailyPlans,
      });

      setValue("startDate", selectedItinerary.start_date.slice(0, 10));
      setValue("endDate", selectedItinerary.end_date.slice(0, 10));
      setValue("dailyPlans", formattedDailyPlans);
    } else {
      reset();
    }
  }, [selectedItinerary, setValue, reset]);

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
        Itinerary Dashboard
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
        Manage your itineraries here
      </h3>

      {!open && (
        <Grid spacing={{ xs: 0, md: 2 }}>
          <Grid item md={10} lg={0} mx="auto" alignItems="end">
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleClickOpen}
                size="large"
                variant="contained"
                sx={{ backgroundColor: "#261140" }}
              >
                <Icon fontSize="small" />
                New Itinerary
              </Button>
            </Box>
            <Grid item md={6} mt={2} mx="auto">
              <Card>
                <ItineraryTable
                  Itinerarys={itineraryList || []}
                  onEdit={handleEdit}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}

      {open && (
        <Card sx={{ p: 2, mb: 10, borderRadius: 1, mt: 4 }}>
          <form onSubmit={handleSubmit(submitForm)}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Add New Itinerary
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleClose}
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
                      {...register("startDate", { required: true })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      {...register("endDate", { required: true })}
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
                        {...register(`dailyPlans.${index}.date`, {
                          required: true,
                        })}
                        value={plan.date}
                        onChange={(e) =>
                          handleChange(index, "date", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Location"
                        fullWidth
                        {...register(`dailyPlans.${index}.location`, {
                          required: true,
                        })}
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
                        {...register(`dailyPlans.${index}.activities`, {
                          required: true,
                        })}
                        value={plan.activities}
                        onChange={(e) =>
                          handleChange(index, "activities", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Controller
                        name={`dailyPlans.${index}.hotelId`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Hotel</InputLabel>
                            <Select {...field} label="Hotel">
                              {hotelList.map((hotel: any) => (
                                <MenuItem
                                  key={hotel.hotel_id}
                                  value={hotel.hotel_id}
                                >
                                  {hotel.hotel_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Controller
                        name={`dailyPlans.${index}.locationTicketId`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Location</InputLabel>
                            <Select {...field} label="Location">
                              {locationTicketList.map((location: any) => (
                                <MenuItem
                                  key={location.location_ticket_id}
                                  value={location.location_ticket_id}
                                >
                                  {location.location_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
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
        </Card>
      )}
    </Container>
  );
}

export default ItineraryDashboard;
