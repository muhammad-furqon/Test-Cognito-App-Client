// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
import { useAuth } from "react-oidc-context";
import outputs from "../amplify_outputs.json"
import { Amplify } from "aws-amplify"
import { CognitoJwtVerifier } from "aws-jwt-verify";

Amplify.configure(outputs)
// const client = generateClient<Schema>()

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
async function testFunction(access_token: string){
  try {
    console.log(access_token);
    // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
      userPoolId: "ap-northeast-1_KYJVPWPTn",
      tokenUse: "access",
      clientId: "3mkraeveoupe6pdobo977hjgr7",
    });

    try {
      const payload = await verifier.verify(
        access_token // the JWT as string
      );
      console.log("<CLIENT SIDE> Token is valid. Payload:", payload);
      console.log("<CLIENT SIDE> Cognito user id (sub):", payload.sub);
    } catch {
      console.log("Token not valid!");
    }


    //Call testFunction 
    // const response = await client.queries.testFunction(
    //   {
    //     code: code 
    //   },
    //   // { 
    //   //   authMode: 'oidc'
    //   // }
    // )
    // console.log('Backend Response: ',response);
    // if(response.data){
    //   console.log('Backend Context: ',JSON.parse(response.data?.context));
    //   console.log('Backend Event: ',JSON.parse(response.data?.event));
    //   console.log('Backend Token Response: ',JSON.parse(response.data?.tokenResponse));
    // }

    //Client side token retrieval
    //

    //Hard coded for now
    // const options = {
    //   // uri: 'https://lambda-furl-d2d1d8kuit8n8u.auth.ap-northeast-1.amazoncognito.com/oauth2/token',
    //   // transform: _include_headers,
    //   method: 'POST',
    //   headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       // 'Authorization': 'Basic ' + secret_hash
    //   },
    //   body: {
    //       'grant_type': 'authorization_code',
    //       'client_id': '3mkraeveoupe6pdobo977hjgr7',
    //       'code': code,
    //       'redirect_uri': 'https://main.d2d1d8kuit8n8u.amplifyapp.com/'
    //   }
    // };

    //Hard coded for now
    // const clientId = '3mkraeveoupe6pdobo977hjgr7';
    // const clientSecret = 'g6dpi4qn5qgm1e81t6vmbfsda64bhfm8bhdfr6ngrhtg3kep6jg';
    // const credentials = `${clientId}:${clientSecret}`;

    // const body = new URLSearchParams({
    //   grant_type: 'authorization_code',
    //   client_id: clientId,
    //   code: code,
    //   redirect_uri: 'http://localhost:5173/', 
    //   // redirect_uri: 'https://main.d2d1d8kuit8n8u.amplifyapp.com/'
    // });
    
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': `Basic ${btoa(credentials)}`,
    //   },
    //   body: body.toString()
    // }

    // async function readStream(readableStream: any) {
    //   for await (const chunk of readableStream) {
    //     const decoder = new TextDecoder('utf-8');
    //     const text = decoder.decode(chunk);
    //     return JSON.parse(text);
    //   }
    // }

    // try{
    //     console.log('options', options);
    //     const response = await fetch('https://lambda-furl-d2d1d8kuit8n8u.auth.ap-northeast-1.amazoncognito.com/oauth2/token', options);  
    //     console.log('response cognito', response);
    //     const tokenResponse = await readStream(response.body);
    //     console.log('response token', tokenResponse)
    // }
    // catch (error){
    //     console.log("failed to exchange cognito code to token");
    //     console.log('error',error);
    // }
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
    // const cognitoDomain = "https://main.d2d1d8kuit8n8u.amplifyapp.com/";
    const cognitoDomain = "http://localhost:5173/";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Use auth sign in instead
  // const signInRedirect = () => {
  //   const clientId = "3mkraeveoupe6pdobo977hjgr7";
  //   // const redirectUri = "https://main.d2d1d8kuit8n8u.amplifyapp.com/";
  //   const redirectUri = "http://localhost:5173/";
  //   window.location.assign(`https://lambda-furl-d2d1d8kuit8n8u.auth.ap-northeast-1.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${redirectUri}`);
  // };

  console.log(`Code ${code}`);
  console.log(`ID Token: ${auth.user?.id_token},\nAccess Token: ${auth.user?.access_token},\nRefresh Token: ${auth.user?.refresh_token}`);
  if(auth.isAuthenticated){
    const access_token = auth.user?.access_token;
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        {/* <pre> Code: {code} </pre> */}
        {/* <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre> */}

        {access_token && (
          <button onClick={() => testFunction(access_token)}>Test function</button>
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