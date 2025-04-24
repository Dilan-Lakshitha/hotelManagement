import {  Container, Card } from '@mui/material';

import HotelDashboard from './hotelDashboard/hotelDashboard';

function hotelOverview() {
  return (
      <Container maxWidth="xl" className='mt-2'>
        <Card sx={{ p: 2, mb: 10, borderRadius: 1 }}>
          <HotelDashboard />
        </Card>
      </Container>
  );
}

export default hotelOverview;
