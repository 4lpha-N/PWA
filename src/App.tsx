import React from 'react'
import './App.scss'
import { Box } from '@mui/material'
import Dev from './components/dev/dev'
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'

const isDarkTheme = document.documentElement.classList.contains('dark');

function App() {
  const [isDark, setIsDark] = React.useState(isDarkTheme);

  React.useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);


  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        primary: { main: '#dc143c' },
        secondary: { main: isDark ? '#ece9e6' : '#2c271f' }
      }
    })
  , [isDark]);


  return (
    <MUIThemeProvider theme={theme}>
      <Box className="app" sx={{ height: '100dvh', width: '100dvw'}}>
        <Box className="app-wrapper" sx={{ height: '100%', width: '100%'}}>
          <Dev />
        </Box>
      </Box>
    </MUIThemeProvider>
  )
}

export default App
