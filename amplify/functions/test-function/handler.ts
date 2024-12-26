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
  
  //Hard coded for now
  const options = {
    uri: 'https://lambda-furl-d2d1d8kuit8n8u.auth.ap-northeast-1.amazoncognito.com',
    // transform: _include_headers,
    method: 'POST',
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': 'Basic ' + secret_hash
    // },
    form: {
        'grant_type': 'authorization_code',
        'client_id': '3mkraeveoupe6pdobo977hjgr7',
        'code': code,
        'redirect_uri': 'https://main.d2d1d8kuit8n8u.amplifyapp.com/'
    }
  };

  try{
      const response = await fetch(options.uri, options);
      console.log(response);
  }
  catch {
      console.log("failed to exchange cognito code to token");
  }

  console.log('Code: ', code);
  console.log('Event: ', event);
  console.log('Context: ', context)

  return {event: event, context:context};
};