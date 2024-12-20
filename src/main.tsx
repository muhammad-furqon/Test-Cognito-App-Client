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
  client_id: "5g5dpm896rndpqbdi7c94gc5uo",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
