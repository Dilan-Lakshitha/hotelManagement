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
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  travelerCreate,
  travelers,
  updatetraveler,
} from "../../../../shared/service/travelerService";
import TravelerTable from "./travelerTable";
import { getDecodedToken } from "../../../../shared/service/managerService";
import { JwtPayload } from "jwt-decode";

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
  unique_name?: string;
  agency_id?: string;
}

function TravelerDashboard() {
  const { success } = useSelector((state: any) => state.auth);
  const travelerList = useSelector((state: any) => state.traveler.traveler);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState<any>(null);
  const [agencyName, setAgencyName] = useState<number | null>(null);
  const dispath: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { isDirty, isValid, errors },
  } = useForm({ mode: "onChange" });
  const travelerTypes = [
    { value: "solo", label: "Solo" },
    { value: "couple", label: "Couple" },
    { value: "group", label: "Group" },
  ];
  const travelerType = useWatch({ control, name: "travelerType" });

  useEffect(() => {
    dispath(travelers());
  }, [dispath]);

  useEffect(() => {
    const decoded = getDecodedToken();
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
      const travelerPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passportNumber: data.passportNumber,
        nationality: data.nationality,
        dateOfBirth: data.dateOfBirth,
        travelerType: data.travelerType,
        group:
          data.travelerType === "group"
            ? {
                number_adults: parseInt(data.group?.adults) || 0,
                number_child: parseInt(data.group?.children) || 0,
                notes: data.group?.notes || "",
              }
            : null,
        agencyId: agencyName,
        travelerId: selectedTraveler?.traveler_id,
      };
      if (isEditMode) {
        dispath(updatetraveler(travelerPayload));
        toast.success("traveler updated successfully! 🎉");
      } else {
        dispath(travelerCreate(travelerPayload));
        toast.success("traveler added successfully! 🎉");
      }
      handleClose();
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  useEffect(() => {
    if (selectedTraveler) {
      console.log("selectedTraveler", selectedTraveler);
      setValue("name", selectedTraveler.name);
      setValue("email", selectedTraveler.email);
      setValue("phone", selectedTraveler.phone);
      setValue("dateOfBirth", selectedTraveler.date_of_birth);
      setValue("nationality", selectedTraveler.nationality);
      setValue("travelerType", selectedTraveler.traveler_type);
      setValue("group.adults", selectedTraveler.group?.number_adults);
      setValue("group.children", selectedTraveler.group?.number_child);
      setValue("notes", selectedTraveler.group?.notes);
      setValue("passportNumber", selectedTraveler.passport_number);
    } else {
      reset();
    }
  }, [selectedTraveler, setValue, reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTraveler(null);
    setIsEditMode(false);
    reset();
  };

  const handleEdit = (traveler: any) => {
    setSelectedTraveler(traveler);
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
        Traveler Dashboard
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
        Add and manage your travelers here
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
              Add traveler
            </Button>
          </Box>
          <Grid item md={6} mt={2} mx="auto">
            <Card>
              <TravelerTable
                Travelers={travelerList || []}
                onEdit={handleEdit}
              />
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: "#261140", color: "white" }}>
          <PersonAddIcon sx={{ marginRight: 1 }} />
          {isEditMode ? "Update Traveler" : "Add Traveler"}
        </DialogTitle>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col space-y-4"
        >
          <DialogContent>
            <DialogContentText>
              Please fill out the form to {isEditMode ? "update" : "add"} a
              traveler.
            </DialogContentText>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="traveler Name"
                  variant="standard"
                  {...register("name", {
                    required: "traveler Name is required",
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  variant="standard"
                  defaultValue=""
                  {...register("email", {
                    required: "Language is required",
                  })}
                ></TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  variant="standard"
                  {...register("phone", {
                    required: "Phone Number is required",
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Passport Number"
                  variant="standard"
                  {...register("passportNumber", {
                    required: "passportNumber is required",
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nationality"
                  variant="standard"
                  {...register("nationality", {
                    required: "nationality is required",
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Date of Birth"
                  type="date"
                  variant="standard"
                  {...register("dateOfBirth", {
                    required: "Birthday is required",
                  })}
                />
              </Grid>
            </Grid>

            <Grid container mt={4}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="travelerType"
                  control={control}
                  rules={{ required: "Traveler Type is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Traveler Type"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    >
                      {travelerTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            {travelerType === "group" && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Number of Adults"
                      type="number"
                      variant="standard"
                      fullWidth
                      {...register("group.adults", {
                        required: "Number of adults is required",
                        min: 1,
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Number of Children"
                      type="number"
                      variant="standard"
                      fullWidth
                      {...register("group.children", {
                        min: 0,
                      })}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Note"
                    variant="standard"
                    fullWidth
                    multiline
                    rows={2}
                    {...register("group.notes")}
                  />
                </Grid>
              </>
            )}
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
export default TravelerDashboard;
