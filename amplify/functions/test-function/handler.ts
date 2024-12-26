import type { Handler } from 'aws-lambda';
// import { post } from 'aws-amplify/api';

export type LambdaResult = {
  event: any;    // 'any' because the shape of event depends on the trigger
  context: any;  // 'any' for the same reason
};

// var _include_headers = function(body:any, response:any, resolveWithFullResponse) {
//   return {'headers': response.headers, 'body': body};
// };

export const handler: Handler = async (event, context): Promise<LambdaResult> => {
  // your function code goes here
  const { code } = event.arguments;
  
  try{
    //Hard coded for now
    const clientId = '3mkraeveoupe6pdobo977hjgr7';
    const clientSecret = 'g6dpi4qn5qgm1e81t6vmbfsda64bhfm8bhdfr6ngrhtg3kep6jg';
    const credentials = `${clientId}:${clientSecret}`;

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      client_secret: clientSecret,
      // redirect_uri: 'http://localhost:5173/'
      redirect_uri: 'https://main.d2d1d8kuit8n8u.amplifyapp.com/'
    });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(credentials).toString('base64')}`,
      },
      body: body.toString()
    }

    try{
        console.log('options', options);
        const response = await fetch('https://lambda-furl-d2d1d8kuit8n8u.auth.ap-northeast-1.amazoncognito.com/oauth2/token', options);  
        console.log(response);
    }
    catch {
        console.log("failed to exchange cognito code to token");
    }
  } catch (error) {
    console.error(error)
  }

  console.log('Code: ', code);
  console.log('Event: ', event);
  console.log('Context: ', context)

  return {event: event, context:context};
};