import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { CustomAuthStack } from './custom-auth';

import { CognitoIdentityProviderClient, UpdateUserPoolClientCommand } from "@aws-sdk/client-cognito-identity-provider";

//Test function
import { testFunction } from './functions/test-function/resource';;

const backend = defineBackend({
  auth,
  data,
  testFunction,
});

// app-client
// extract L1 CfnUserPool resources
const { cfnUserPool } = backend.auth.resources.cfnResources;

// modify cfnUserPool directly
const userPoolId = cfnUserPool.attrUserPoolId;

// Reference the existing Cognito User Pool
const customAuth = new CustomAuthStack(backend.createStack("CustomAuth"), 'CustomAuth', {
  userPoolId:userPoolId,
});

// Custom function to update User Pool Client
// async function updateUserPoolClient(userPoolId: string, clientId: string) {
//   const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

//   const params = {
//     ClientId: clientId,
//     UserPoolId: userPoolId,
//     CallbackURLs: ["http://localhost:5173/","https://main.d2d1d8kuit8n8u.amplifyapp.com/"],
//     // LogoutURLs: ["http://localhost:5173/","https://main.d2d1d8kuit8n8u.amplifyapp.com/"],
//     // SupportedIdentityProviders: ["COGNITO"],
//   };

//   try {
//     const command = new UpdateUserPoolClientCommand(params);
//     const response = await client.send(command);
//     console.log("User Pool Client updated successfully:", response);
//   } catch (error) {
//     console.error("Error updating User Pool Client:", error);
//   }
// }

// const userPoolId = backend.auth.resources.userPool.userPoolId;
// const userPoolId = 'ap-northeast-1_KYJVPWPTn';  //hard coded for now
// const clientId = '5g5dpm896rndpqbdi7c94gc5uo'; //hard coded for now
// await updateUserPoolClient(userPoolId, clientId);
