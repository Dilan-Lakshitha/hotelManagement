import { Box, Container, Card, TextField, Button } from "@mui/material";
import Logo from "../../assets/3.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux-store/stores/store";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signIn } from "../../shared/service/userSetting";
import { useNavigate } from "react-router-dom";

export default function SignInForm() {
  const { success } = useSelector((state: any) => state.auth);
  const dispath: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();

  const submitForm = async (payload: any) => {
    console.log("payload", payload);
    try {
      const response=await dispath(signIn(payload)).unwrap();
      toast.success("Travel Agency created successful! 🎉");

      navigate("/");
    } catch {
      toast.error("Travel Agency create failed. Please check your network.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Card sx={{ p: 2, mt: 5, mb: 2, borderRadius: 2 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          className="bg-gray"
        >
          <div className="flex flex-col space-y-4">
            <form
              onSubmit={handleSubmit(submitForm)}
              className="flex flex-col space-y-4"
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: "auto",
                  height: "250px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <label className="font-bold text-lg text-center pb-4">
                Sign in to TravelEsay
              </label>
              <div className="pb-6">
                <TextField
                  className="w-full"
                  required
                  id="standard-required"
                  label="Agency Email"
                  placeholder="Agnecy Email"
                  {...register('agencyEmail', { required: 'Email is required' })}
                />
              </div>
              <div className="my-4">
                <TextField
                  className="w-full"
                  required
                  id="standard-required"
                  label="Password"
                  placeholder="Input Password"
                  {...register('password', { required: 'password is required' })}
                />
              </div>
              <div>
                <div className="mb-4">
                  <Button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    sx={{ backgroundColor: "#4b52c4" }}
                    className="w-full text-white"
                    variant="contained"
                  >
                    Sign In
                  </Button>
                </div>
                <label>
                  Don't have an account?{" "}
                  <Button href="signUp" color="primary">
                    Sign up
                  </Button>
                </label>
              </div>
            </form>
          </div>
        </Box>
      </Card>
    </Container>
  );
}
