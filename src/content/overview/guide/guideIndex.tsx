import {  Container, Card } from '@mui/material';

import GuideDashboard from './guideDashboard/guideDashboard';

function driverOverview() {
  return (
      <Container maxWidth="xl" className='mt-2'>
        <Card sx={{ p: 2, mb: 10, borderRadius: 1 }}>
          <GuideDashboard />
        </Card>
      </Container>
  );
}

export default driverOverview;
