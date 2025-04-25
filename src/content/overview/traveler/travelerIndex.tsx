import {  Container, Card } from '@mui/material';

import TravelerDashboard from './travelerDashboard/travelerDashboard';

function travelerOverview() {
  return (
      <Container maxWidth="xl" className='mt-2'>
        <Card sx={{ p: 2, mb: 10, borderRadius: 1 }}>
          <TravelerDashboard />
        </Card>
      </Container>
  );
}

export default travelerOverview;
