import {  Container, Card } from '@mui/material';

import DriverDashboard from './driverDashboard/driverDashboard';

function driverOverview() {
  return (
      <Container maxWidth="xl" className='mt-2'>
        <Card sx={{ p: 2, mb: 10, borderRadius: 1 }}>
          <DriverDashboard />
        </Card>
      </Container>
  );
}

export default driverOverview;
