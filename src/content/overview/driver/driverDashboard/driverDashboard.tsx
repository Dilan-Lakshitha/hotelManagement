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
  driverCreate,
  drivers,
  updateDriver,
} from "../../../../shared/service/driverService";
import DriverTable from "./driverTable";
import { getDecodedToken } from "../../../../shared/service/managerService";
import { JwtPayload } from "jwt-decode";
import { set } from "date-fns";

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
  unique_name?: string;
  agency_id?: string;
}

function DriverDashboard() {
  const { success } = useSelector((state: any) => state.auth);
  const driverList = useSelector((state: any) => state.driver.driver);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
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
    dispath(drivers());
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
      const payload = {
        ...data,
        agencyId: agencyName,
      };
      if (isEditMode) {
        dispath(updateDriver({ ...selectedDriver, ...data }));
        toast.success("driver updated successfully! 🎉");
      } else {
        dispath(driverCreate(payload));
        toast.success("driver added successfully! 🎉");
      }
      handleClose();
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  useEffect(() => {
    if (selectedDriver) {
      console.log("selectedDriver", selectedDriver);
      setValue("Name", selectedDriver.name);
      setValue("VehicleType", selectedDriver.vehicleType);
      setValue("VehiclePricePerKm", selectedDriver.vehiclePricePerKm);
      setValue("Phone", selectedDriver.phone);
      setValue("Email", selectedDriver.email);
      setValue("LicenseNumber", selectedDriver.licenseNumber);
      setValue("VehicleModel", selectedDriver.vehicleModel);
      setValue("VehicleNumber", selectedDriver.vehicleNumber);
      setValue("VehicleCapacity", selectedDriver.vehicleCapacity);
      setValue("IsAvailable", selectedDriver.isAvailable);
      setValue("Notes", selectedDriver.notes);
    } else {
      reset();
    }
  }, [selectedDriver, setValue, reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDriver(null);
    setIsEditMode(false);
    reset();
  };

  const handleEdit = (driver: any) => {
    setSelectedDriver(driver);
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
        Driver Dashboard
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
        Add and manage your drivers here
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
              Add driver
            </Button>
          </Box>
          <Grid item md={6} mt={2} mx="auto">
            <Card>
              <DriverTable Drivers={driverList || []} onEdit={handleEdit} />
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: "#261140", color: "white" }}>
          <PersonAddIcon sx={{ marginRight: 1 }} />
          {isEditMode ? "Update Driver" : "Add Driver"}
        </DialogTitle>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col space-y-4"
        >
          <DialogContent>
            <DialogContentText>
              Please fill out the form to {isEditMode ? "update" : "add"} a
              driver.
            </DialogContentText>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Driver Name"
                  variant="standard"
                  {...register("Name", { required: "Driver Name is required" })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Vehicle Type"
                  variant="standard"
                  defaultValue=""
                  {...register("VehicleType", {
                    required: "Vehicle Type is required",
                  })}
                >
                  <MenuItem value="Car">Car</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                  <MenuItem value="Bus">Bus</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Price per Km"
                  type="number"
                  variant="standard"
                  {...register("VehiclePricePerKm", {
                    required: "Price per Km is required",
                    valueAsNumber: true,
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Phone"
                  variant="standard"
                  {...register("Phone", { required: "Phone is required" })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  type="email"
                  variant="standard"
                  {...register("Email", { required: "Email is required" })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="License Number"
                  variant="standard"
                  {...register("LicenseNumber", {
                    required: "License Number is required",
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Vehicle Model"
                  variant="standard"
                  {...register("VehicleModel", {
                    required: "Vehicle Model is required",
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Vehicle Number"
                  variant="standard"
                  {...register("VehicleNumber", {
                    required: "Vehicle Number is required",
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Vehicle Capacity"
                  type="number"
                  variant="standard"
                  {...register("VehicleCapacity", {
                    required: "Vehicle Capacity is required",
                    valueAsNumber: true,
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox {...register("IsAvailable")} />}
                  label="Available"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  variant="standard"
                  {...register("Notes")}
                />
              </Grid>
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
export default DriverDashboard;
