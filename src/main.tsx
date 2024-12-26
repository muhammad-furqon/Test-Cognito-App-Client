import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
// app-client
import { AuthProvider } from "react-oidc-context";

Amplify.configure(outputs);

// app-client
const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_KYJVPWPTn",
  client_id: "3mkraeveoupe6pdobo977hjgr7",
  client_secret: 'g6dpi4qn5qgm1e81t6vmbfsda64bhfm8bhdfr6ngrhtg3kep6jg',
  redirect_uri: "https://main.d2d1d8kuit8n8u.amplifyapp.com/", //hard coded for now
  // redirect_uri: "http://localhost:5173/", // for dev in local
  response_type: "code",
  scope: "email openid",
  // scope: "aws.cognito.signin.user.admin email openid",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
