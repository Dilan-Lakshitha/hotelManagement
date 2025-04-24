import {
  Box,
  Button,
  Container,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Icon,
  Card,
  FormControlLabel,
  Checkbox,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux-store/stores/store";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  locationCreate,
  locations,
  updatelocation,
} from "../../../../shared/service/locationService";
import LocationTable from "./locationTable";
import { getDecodedToken } from "../../../../shared/service/managerService";
import { JwtPayload } from "jwt-decode";

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
  unique_name?: string;
  agency_id?: string;
}

function LocationDashboard() {
  const { success } = useSelector((state: any) => state.auth);
  const locationList = useSelector((state: any) => state.location.location);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [agencyName, setAgencyName] = useState<number | null>(null);

  const dispath: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    dispath(locations());
  }, [dispath]);

  useEffect(() => {
    const decoded = getDecodedToken();
    console.log(decoded, "decoded");
    if (decoded) {
      setAgencyName(
        (decoded as ExtendedJwtPayload).agency_id
          ? parseInt((decoded as ExtendedJwtPayload).agency_id || "0")
          : null
      );
    }
  }, []);

  const submitForm = async (data: any) => {
    try {
      const Payload = {
        locationName: data.locationName,
        description: data.description,
        adultPrice: data.adultPrice,
        childPrice: data.childPrice,
        agencyId: agencyName,
        locationTicketId: selectedLocation?.location_ticket_id,
      };
      if (isEditMode) {
        dispath(updatelocation(Payload));
        toast.success("Location updated successfully! 🎉");
      } else {
        dispath(locationCreate(Payload));
        toast.success("Location added successfully! 🎉");
      }
      handleClose();
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      console.log("selectedLocation", selectedLocation);
      setValue("locationName", selectedLocation.location_name);
      setValue("description", selectedLocation.description);
      setValue("adultPrice", selectedLocation.adult_price);
      setValue("childPrice", selectedLocation.child_price);
    } else {
      reset();
    }
  }, [selectedLocation, setValue, reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLocation(null);
    setIsEditMode(false);
    reset();
  };

  const handleEdit = (location: any) => {
    setSelectedLocation(location);
    setIsEditMode(true);
    setOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ textAlign: "center" }}>
      <h1
        style={{
          color: "black",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        Location Dashboard
      </h1>
      <h3
        style={{
          color: "black",
          fontSize: "1.5rem",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        Add and manage your locations here
      </h3>
      <Grid spacing={{ xs: 0, md: 2 }}>
        <Grid item md={10} lg={0} mx="auto" alignItems="end">
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleClickOpen}
              size="large"
              variant="contained"
              sx={{ backgroundColor: "#261140" }}
            >
              <PersonAddIcon />
              <Icon fontSize="small" />
              Add location
            </Button>
          </Box>
          <Grid item md={6} mt={2} mx="auto">
            <Card>
              <LocationTable
                Locations={locationList || []}
                onEdit={handleEdit}
              />
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: "#261140", color: "white" }}>
          <PersonAddIcon sx={{ marginRight: 1 }} />
          {isEditMode ? "Update Location" : "Add Location"}
        </DialogTitle>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col space-y-4"
        >
          <DialogContent>
            <DialogContentText>
              Please fill out the form to {isEditMode ? "update" : "add"} a
              location.
            </DialogContentText>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Location Name"
                variant="standard"
                {...register("locationName", {
                  required: "Location Name is required",
                })}
              />
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Adult Price"
                  variant="standard"
                  type="number"
                  defaultValue=""
                  {...register("adultPrice", {
                    required: "Adult price is required",
                    valueAsNumber: true,
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                ></TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Child price"
                  type="number"
                  variant="standard"
                  {...register("childPrice", {
                    required: "Child price is required",
                    valueAsNumber: true,
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Description"
                multiline
                variant="standard"
                {...register("description", {
                  required: "description is required",
                })}
              />
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "#261140" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#261140" }}
            >
              {isEditMode ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
export default LocationDashboard;
