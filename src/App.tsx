// import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuth } from "react-oidc-context";
import outputs from "../amplify_outputs.json"
import { Amplify } from "aws-amplify"
import { CognitoJwtVerifier } from "aws-jwt-verify";

Amplify.configure(outputs)
const client = generateClient<Schema>()

// Get query variable
function getQueryVariable(variable: string)
{
  var query = window.location.search.substring(1);
  // console.log(query)//"app=article&act=news_content&aid=160990"
  var vars = query.split("&");
  // console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    // console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
    if(pair[0] == variable){return pair[1];}
  }
    return(null);
}

//Call backend testFunction using the queries
async function testFunction(accessToken: string){
  try {
    console.log(accessToken);
    // Verifier that expects valid access tokens:
    // Hard coded for now
    const verifier = CognitoJwtVerifier.create({
      userPoolId: "ap-northeast-1_KYJVPWPTn",
      tokenUse: "access",
      clientId: "3mkraeveoupe6pdobo977hjgr7",
    });

    try {
      const payload = await verifier.verify(
        accessToken // the JWT as string
      );
      console.log("<CLIENT SIDE> Token is valid. Payload:", payload);
      console.log("<CLIENT SIDE> Cognito user id (sub):", payload.sub);
    } catch {
      console.log("Token not valid!");
    }

    //Call testFunction
    //Get token verification
    const response = await client.queries.testFunction(
      {
        accessToken: accessToken 
      },
      // { 
      //   authMode: 'oidc'
      // }
    )
    console.log('Backend Response: ',response);
    if(response.data){
      // console.log('Backend Context: ',JSON.parse(response.data?.context));
      // console.log('Backend Event: ',JSON.parse(response.data?.event));
      const payloadServer = JSON.parse(response.data?.tokenResponse);
      console.log('<SERVER SIDE> Token is valid. Payload: ', payloadServer);
      console.log("<SERVER SIDE> Cognito user id (sub):", payloadServer.sub);
    }

    } catch (error) {
      console.error(error);
      console.log('error',error);
    }
}

// function getCookieValue(name:string){
//   console.log(document.cookie);
//   const cookies = document.cookie.split('; ');
//   const cookie = cookies.find(row => row.startsWith(`${name}=`));
//   return cookie ? cookie.split('=')[1] : null;
// };

// app-client
// App.js
function App() {
  const code = getQueryVariable('code');
  // const code = getCookieValue('code')

  // dev: use auth
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "3mkraeveoupe6pdobo977hjgr7";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://main.d2d1d8kuit8n8u.amplifyapp.com/";
    // const cognitoDomain = "http://localhost:5173/";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  console.log(`Code ${code}`);
  // console.log(`ID Token: ${auth.user?.id_token},\nAccess Token: ${auth.user?.access_token},\nRefresh Token: ${auth.user?.refresh_token}`);
  if(auth.isAuthenticated){
    const accessToken = auth.user?.access_token;
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        {/* <pre> Code: {code} </pre> */}
        {/* <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.accessToken} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre> */}

        {accessToken && (
          <button onClick={() => testFunction(accessToken)}>Test function</button>
        )}

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}
  
export default App;