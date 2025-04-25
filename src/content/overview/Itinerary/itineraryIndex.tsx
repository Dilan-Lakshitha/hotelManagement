import {  Container, Card } from '@mui/material';

import TravelerDashboard from './itineraryDashboard/itineraryDashboard';

function itineraryOverview() {
  return (
      <Container maxWidth="xl" className='mt-2'>
        <Card sx={{ p: 2, mb: 10, borderRadius: 1 }}>
          <TravelerDashboard />
        </Card>
      </Container>
  );
}

export default itineraryOverview;