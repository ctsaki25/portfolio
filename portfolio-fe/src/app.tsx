import { BrowserRouter } from "react-router";
import Router from "./pages/router";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import Navbar from "./components/navbar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  colors: {
    lionRed: [
      "#a53939",
      "#a53939",
      "#a53939",
      "#a53939",
      "#a53939",
      "#a53939",
      "#a53939",
      "#a53939",
      "#a53939",
      "#a53939",
    ],
    lionGold: [
      "#ecba4b",
      "#ecba4b",
      "#ecba4b",
      "#ecba4b",
      "#ecba4b",
      "#ecba4b",
      "#ecba4b",
      "#ecba4b",
      "#ecba4b",
      "#ecba4b",
    ],
  },
});

function App() {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MantineProvider theme={theme}>
          <BrowserRouter>
            <LanguageSwitcher />
            <Navbar />
            <div className="app-content">
              <Router />
            </div>
          </BrowserRouter>
        </MantineProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;

