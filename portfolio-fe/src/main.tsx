import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app";
import { Auth0Provider } from "@auth0/auth0-react";
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Auth0Provider
        domain="tsakirisportfolio.ca.auth0.com"
        clientId="qo9QOXlv7SKw8iilG9pkBm0q7M9O8KU0"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://tsakirisportfolio.ca.auth0.com/api/v2/"
        }}
      >
        <App />
      </Auth0Provider>
    </I18nextProvider>
  </StrictMode>
);
