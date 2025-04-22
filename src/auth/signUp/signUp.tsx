import { Box, Container, Card, TextField, Button } from "@mui/material";
import Logo from "../../assets/3.png";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux-store/stores/store";
import { signUp } from "../../shared/service/userSetting";

export default function SignUpForm() {
  const { success } = useSelector((state: any) => state.auth);
  const dispath: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors },
  } = useForm({ mode: "onChange" });

  const submitForm = async (payload: any) => {
    console.log("payload", payload);
    try {
      dispath(signUp(payload));
      toast.success("Travel Agency created successful! 🎉");
    } catch {
      toast.error("Travel Agency create failed. Please check your network.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Card sx={{ p: 2, mt: 2, mb: 2, borderRadius: 2 }}>
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
                Sign up
              </label>
              <label className="font-bold text-lg text-center pb-4">
                Already have an account?
                <Button href="/" color="primary">
                  {" "}
                  Sign in{" "}
                </Button>
              </label>
              <div className="pb-6">
                <TextField
                  className="w-full"
                  required
                  id="standard-required"
                  label="TravalAgency Name"
                  placeholder="Input User Name"
                  {...register('agencyName', { required: 'Agency name is required' })}
                />
              </div>
              <div className="my-4 pb-6">
                <TextField
                  className="w-full"
                  required
                  id="standard-required"
                  label="Email"
                  placeholder="Email"
                  {...register('agencyEmail', { required: 'Email is required' })}
                />
              </div>
              <div className="my-4 pb-6">
                <TextField
                  className="w-full"
                  required
                  id="standard-required"
                  label="Password"
                  placeholder="Input Password"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              <div className="my-4">
                <TextField
                  className="w-full"
                  required
                  id="standard-required"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === watch("password") || "Passwords do not match"
                  })}
                />
              </div>
              <div>
                <div className="mb-4">
                  <Button
                    type="submit"
                    sx={{ backgroundColor: "#4b52c4" }}
                    className="w-full bg-green-900"
                    variant="contained"
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Box>
      </Card>
    </Container>
  );
}