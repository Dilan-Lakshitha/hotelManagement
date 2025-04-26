import {  Container, Card } from '@mui/material';

import BookingDashboard from './bookingDashboard/bookingDashboard';

function bookingOverview() {
  return (
      <Container maxWidth="xl" className='mt-2'>
        <Card sx={{ p: 2, mb: 10, borderRadius: 1 }}>
          <BookingDashboard />
        </Card>
      </Container>
  );
}

export default bookingOverview;