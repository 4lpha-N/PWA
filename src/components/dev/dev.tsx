// import React from 'react';
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler'
import { DiaTextReveal } from "@/components/ui/dia-text-reveal"
import { Box, Container, Grid, Typography } from '@mui/material'
// import Colors from './colors'

const Dev = () => {
  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid
            size={{ xs: 8 }}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography variant="h6" component="h6" sx={{ fontWeight: 'bold' }}>
              <DiaTextReveal text="4lpha" colors={["var(--primary)"]} duration={2} delay={0} />
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 4 }}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <AnimatedThemeToggler duration={1250} />
          </Grid>
        </Grid>
      </Container>
    {/* <Colors /> */}
      <Container
        maxWidth="xl"
        style={{ height: "75%", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Grid container spacing={4}>
          <Grid
            size={{ xs: 12 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <AnimatedThemeToggler duration={1250} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Dev;
