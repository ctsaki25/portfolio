// import { Auth0Provider } from "@auth0/auth0-react";
// import { useNavigate } from "react-router-dom";

// export const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
//     const navigate = useNavigate();

//     const domain = "your-auth0-domain.auth0.com";
//     const clientId = "your-client-id";
//     const redirectUri = "http://localhost:5173/callback";

//     const onRedirectCallback = (appState: any) => {
//         navigate(appState?.returnTo || window.location.pathname);
//     };

//     return (
//         <Auth0Provider
//             domain={domain}
//             clientId={clientId}
//             authorizationParams={{
//                 redirect_uri: redirectUri,
//                 audience: "http://localhost:8080",
//                 scope: "openid profile email"
//             }}
//             onRedirectCallback={onRedirectCallback}
//         >
//             {children}
//         </Auth0Provider>
//     );
// };