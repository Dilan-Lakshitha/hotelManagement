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
  hotelCreate,
  hotels,
  updateHotel,
} from "../../../../shared/service/hotelService";
import { getDecodedToken } from "../../../../shared/service/managerService";
import { JwtPayload } from "jwt-decode";
import HotelTable from "./hotelTable";
import { mt } from "date-fns/locale";

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
  unique_name?: string;
  agency_id?: string;
}

function HotelDashboard() {
  const { success } = useSelector((state: any) => state.auth);
  const hotelList = useSelector((state: any) => state.hotel.hotel);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [agencyName, setAgencyName] = useState<number | null>(null);
  const [rateList, setRateList] = useState<any[]>([
    { rateType: "", startDate: "", endDate: "", ratePrice: 0 },
  ]);
  const rateTypes = ["RO", "HB", "BB", "FB", "AI"];

  const dispath: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    dispath(hotels());
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
      const hotelPayload = {
        HotelName: data.hotelName,
        HotelEmail: data.hotelEmail,
        HotelAddress: data.hotelAddress,
        HotelContactNo: data.hotelContactNo,
        AgencyId: agencyName,
        HotelRates: rateList,
        HotelId: selectedHotel?.hotel_id,
      };

      if (isEditMode) {
        dispath(updateHotel(hotelPayload));
        toast.success("Hotel updated successfully! 🎉");
      } else {
        dispath(hotelCreate(hotelPayload));
        toast.success("Hotel added successfully! 🎉");
      }

      handleClose();
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  useEffect(() => {
    if (selectedHotel) {
      setValue("hotelName", selectedHotel.hotel_name);
      setValue("hotelAddress", selectedHotel.hotel_address);
      setValue("hotelEmail", selectedHotel.hotel_email);
      setValue("hotelContactNo", selectedHotel.hotel_Contactno);

      if (selectedHotel.hotelRates && selectedHotel.hotelRates.length > 0) {
        const rates = selectedHotel.hotelRates.map((rate: any) => ({
          rateType: rate.rate_type || "",
          startDate: rate.start_date?.split("T")[0] || "",
          endDate: rate.end_date?.split("T")[0] || "",
          ratePrice: rate?.rate,
        }));
        setRateList(rates);
      } else {
        setRateList([
          { rateType: "", startDate: "", endDate: "", ratePrice: 0 },
        ]);
      }
    } else {
      reset();
      setRateList([{ rateType: "", startDate: "", endDate: "", ratePrice: 0 }]);
    }
  }, [selectedHotel, setValue, reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedHotel(null);
    setIsEditMode(false);
    reset();
  };

  const handleEdit = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleRateChange = (index: number, field: keyof any, value: string) => {
    const updatedList = [...rateList];
    updatedList[index][field] = field === "ratePrice" ? Number(value) : value;
    setRateList(updatedList);
  };

  const addRateRow = () => {
    setRateList([
      ...rateList,
      { rateType: "", startDate: "", endDate: "", ratePrice: 0 },
    ]);
  };

  const removeRateRow = (index: number) => {
    const updatedList = [...rateList];
    updatedList.splice(index, 1);
    setRateList(updatedList);
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
        Hotel Dashboard
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
        Add and manage your hotels here
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
              Add hotel
            </Button>
          </Box>
          <Grid item md={6} mt={2} mx="auto">
            <Card>
              <HotelTable Hotels={hotelList || []} onEdit={handleEdit} />
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: "#261140", color: "white" }}>
          <PersonAddIcon sx={{ marginRight: 1 }} />
          {isEditMode ? "Update Hotel" : "Add Hotel"}
        </DialogTitle>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col space-y-4"
        >
          <DialogContent>
            <DialogContentText>
              Please fill out the form to {isEditMode ? "update" : "add"} a
              hotel.
            </DialogContentText>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Hotel Name"
                  variant="standard"
                  {...register("hotelName", {
                    required: "Hotel Name is required",
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Phone"
                  variant="standard"
                  {...register("hotelContactNo", {
                    required: "Phone is required",
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  type="email"
                  variant="standard"
                  {...register("hotelEmail", { required: "Email is required" })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Address"
                  variant="standard"
                  {...register("hotelAddress", {
                    required: "Address is required",
                  })}
                ></TextField>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: 6 }}>
              <h4 style={{ marginTop: "20px" }}>Rate List</h4>
            </Grid>

            {rateList.map((rate, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                sx={{ mt: index !== 0 ? 2 : 0 }}
              >
                <Grid item xs={12} sm={2}>
                  <TextField
                    select
                    label="Rate Type"
                    value={rate.rateType}
                    fullWidth
                    variant="standard"
                    onChange={(e) =>
                      handleRateChange(index, "rateType", e.target.value)
                    }
                  >
                    {rateTypes.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="date"
                    fullWidth
                    variant="standard"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    value={rate.startDate}
                    onChange={(e) =>
                      handleRateChange(index, "startDate", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="date"
                    fullWidth
                    variant="standard"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    value={rate.endDate}
                    onChange={(e) =>
                      handleRateChange(index, "endDate", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Rate"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={rate.ratePrice}
                    onChange={(e) =>
                      handleRateChange(index, "ratePrice", e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Button onClick={() => removeRateRow(index)} color="error">
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                onClick={addRateRow}
                variant="outlined"
                sx={{ borderColor: "#261140", mt: 3 }}
              >
                <p style={{ color: "#261140" }}>Add Another Rate</p>
              </Button>
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
export default HotelDashboard;
