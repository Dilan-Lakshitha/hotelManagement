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
import { guideCreate, guides, updateGuide } from "../../../../shared/service/guideService";
import GuideTable from "./tourplanTable";
import { getDecodedToken } from "../../../../shared/service/managerService";
import { JwtPayload } from "jwt-decode";

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
  unique_name?: string;
  agency_id?: string;
}

function touplanDashboard() {
  const { success } = useSelector((state: any) => state.auth);
  const guideList = useSelector((state: any) => state.guide.guide);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
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
    dispath(guides());
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
        dispath(updateGuide({ ...selectedGuide, ...payload }));
        toast.success("Guide updated successfully! 🎉");
      } else {
        dispath(guideCreate(payload));
        toast.success("Guide added successfully! 🎉");
      }
      handleClose();
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  useEffect(() => {
    if (selectedGuide) {
      console.log("selectedGuide", selectedGuide);
      setValue("name", selectedGuide.name);
      setValue("speakingLanguages", selectedGuide.speakingLanguages);
      setValue("pricePerDay", selectedGuide.pricePerDay);
      setValue("phone", selectedGuide.phone);
      setValue("email", selectedGuide.email);
      setValue("licenseNumber", selectedGuide.licenseNumber);
      setValue("yearsOfExperience", selectedGuide.yearsOfExperience);
      setValue("isAvailable", selectedGuide.isAvailable);
      setValue("notes", selectedGuide.notes);
    } else {
      reset();
    }
  }, [selectedGuide, setValue, reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedGuide(null);
    setIsEditMode(false);
    reset();
  };

  const handleEdit = (guide: any) => {
    setSelectedGuide(guide);
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
        Guide Dashboard
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
        Add and manage your guides here
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
              Add guide
            </Button>
          </Box>
          <Grid item md={6} mt={2} mx="auto">
            <Card>
              <GuideTable Guides={guideList || []} onEdit={handleEdit} />
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: "#261140", color: "white" }}>
          <PersonAddIcon sx={{ marginRight: 1 }} />
          {isEditMode ? "Update Guide" : "Add Guide"}
        </DialogTitle>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col space-y-4"
        >
          <DialogContent>
            <DialogContentText>
              Please fill out the form to {isEditMode ? "update" : "add"} a
              guide.
            </DialogContentText>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Guide Name"
                  variant="standard"
                  {...register("name", { required: "Guide Name is required" })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Language"
                  variant="standard"
                  defaultValue=""
                  {...register("speakingLanguages", {
                    required: "Language is required",
                  })}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="German">German</MenuItem>
                  <MenuItem value="Russian">Russian</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Price"
                  type="number"
                  variant="standard"
                  {...register("pricePerDay", {
                    required: "Price per Day is required",
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
                  {...register("phone", { required: "Phone is required" })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  type="email"
                  variant="standard"
                  {...register("email", { required: "Email is required" })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="License Number"
                  variant="standard"
                  {...register("licenseNumber", {
                    required: "License Number is required",
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Experience"
                  variant="standard"
                  {...register("yearsOfExperience", {
                    required: "Experience Model is required",
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox {...register("isAvailable")} />}
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
                  {...register("notes")}
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
export default touplanDashboard;