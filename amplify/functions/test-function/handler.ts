import type { Handler } from 'aws-lambda';
// import { post } from 'aws-amplify/api';

export type LambdaResult = {
  event: any;    // 'any' because the shape of event depends on the trigger
  context: any;  // 'any' for the same reason
  tokenResponse: any;
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
      code: code,
      client_id: clientId,
      // client_secret: clientSecret,
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

    async function readStream(readableStream: any) {
      for await (const chunk of readableStream) {
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(chunk);
        return JSON.parse(text);
      }
    }

    try{
        console.log('options', options);
        const response = await fetch('https://lambda-furl-d2d1d8kuit8n8u.auth.ap-northeast-1.amazoncognito.com/oauth2/token', options);  
        console.log(response);
        const tokenResponse = await readStream(response.body);
        console.log('response token', tokenResponse)
        return {event: event, context:context, tokenResponse: tokenResponse};
    }
    catch (error){
        console.log("failed to exchange cognito code to token");
        console.log('Error: ', error);
    }
  } catch (error) {
    console.log('Error: ', error);
    console.error(error);
  }

  console.log('Code: ', code);
  console.log('Event: ', event);
  console.log('Context: ', context)

  return {event: event, context:context, tokenResponse: null};
};