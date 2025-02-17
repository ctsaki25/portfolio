import { BrowserRouter } from "react-router";
import Router from "./pages/router";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import Navbar from "./components/navbar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Auth0Provider } from "@auth0/auth0-react";
import LanguageSwitcher from "./components/LanguageSwitcher";

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MantineProvider theme={theme}>
        <Auth0Provider
          domain="tsakirisportfolio.ca.auth0.com"
          clientId="qo9QOXlv7SKw8iilG9pkBm0q7M9O8KU0"
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://tsakirisportfolio.ca.auth0.com/api/v2/",
            scope: "openid profile email read:roles"
          }}
          useRefreshTokens={true}
          cacheLocation="localstorage"
        >
          <BrowserRouter>
            <LanguageSwitcher />
            <Navbar />
            <div className="app-content">
              <Router />
            </div>
          </BrowserRouter>
        </Auth0Provider>
      </MantineProvider>
    </LocalizationProvider>
  );
}

export default App;

