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
  client_id: "5klenrf64bb1nv9egl2t2ktb4g",
  redirect_uri: "https://main.d2d1d8kuit8n8u.amplifyapp.com/", //hard coded for now
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
