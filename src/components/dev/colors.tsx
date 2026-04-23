import { Box, Container, Grid } from '@mui/material'

const Colors = () => {
    const colorsLight = ['var(--c-light-3)', 'var(--c-light-2)', 'var(--c-light-1)', 'var(--c-light-d1)', 'var(--c-light-d2)', 'var(--c-light-d3)'];
    const colorsDark = ['var(--c-dark-3)', 'var(--c-dark-2)', 'var(--c-dark-1)', 'var(--c-dark-d1)', 'var(--c-dark-d2)', 'var(--c-dark-d3)'];

    return (
        <Container maxWidth="xl">
        <Grid container spacing={4}>
            <Grid
                    size={{ xs: 12 }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ backgroundColor: 'var(--c-light)', height: '50px', color: 'var(--primary)' }}
          >
            <Box>
              {'var(--c-light)'}
            </Box>
            </Grid>
            {colorsLight.map((c, i) => (
                <Grid
                    key={i}
                    size={{ xs: 2 }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ backgroundColor: c, height: '125px', color: 'var(--primary)' }}
          >
            <Box>
              {c}
            </Box>
            </Grid>))}
            <Grid
                    size={{ xs: 12 }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ backgroundColor: 'var(--c-dark)', height: '50px', color: 'var(--primary)' }}
          >
            <Box>
              {'var(--c-dark)'}
            </Box>
            </Grid>
             {colorsDark.map((c, i) => (
                <Grid
                    key={i}
                    size={{ xs: 2 }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ backgroundColor: c, height: '125px', color: 'var(--primary)' }}
          >
            <Box>
              {c}
            </Box>
            </Grid>))}
          </Grid>
      </Container>
    )
}

export default Colors;