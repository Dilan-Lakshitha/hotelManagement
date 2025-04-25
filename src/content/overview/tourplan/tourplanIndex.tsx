import {  Container, Card } from '@mui/material';

import TourplanDashboard from './tourplanDashboard/tourplanDashboard';

function tourplanOverview() {
  return (
      <Container maxWidth="xl" className='mt-2'>
        <Card sx={{ p: 2, mb: 10, borderRadius: 1 }}>
          <TourplanDashboard />
        </Card>
      </Container>
  );
}

export default tourplanOverview;
