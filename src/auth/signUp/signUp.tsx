import { Box, Container, Card, TextField, Button } from '@mui/material';
import Logo from '../../assets/pharmacyicon.png';

export default function SignUpForm() {

    return (
        <Container maxWidth="xs">
            <Card sx={{ p: 2, mt: 2, mb: 2, borderRadius: 2 }}>
                <Box display="flex" justifyContent="center" alignItems="center" className="bg-gray">
                    <div className='flex flex-col space-y-4'>
                        <img src={Logo} alt="Logo" style={{ width: 'auto', height: '250px', alignItems: "center", justifyContent: "center" }} />
                        <label className='font-bold text-lg text-center pb-4'>Sign up</label>
                        <label className='font-bold text-lg text-center pb-4'>Already have an account?<Button href="/" color="primary"> Sign in </Button></label>
                        <div className='pb-6'>
                            <TextField className='w-full'
                                required
                                id="standard-required"
                                label="Pharmarcy Name"
                                defaultValue="Input User Name"
                            />
                        </div>
                        <div className='my-4 pb-6'>
                            <TextField className='w-full'
                                required
                                id="standard-required"
                                label="Email"
                                defaultValue="Input Password"
                            />
                        </div>
                        <div className='my-4 pb-6'>
                            <TextField className='w-full'
                                required
                                id="standard-required"
                                label="Password"
                                defaultValue="Input Password"
                            />
                        </div>
                        <div className='my-4'>
                            <TextField className='w-full'
                                required
                                id="standard-required"
                                label="Confirm Password"
                                defaultValue="Input Password"
                            />
                        </div>
                        <div>
                            <div className='mb-4'>
                                <Button  sx={{ backgroundColor: '#064e3b' }}
                                    className='w-full bg-green-900'
                                    variant="contained"
                                >
                                    Sign up
                                </Button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Card>
        </Container>
    );
}

