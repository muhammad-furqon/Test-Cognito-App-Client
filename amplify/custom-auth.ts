import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

type CustomAuthProps = {
    userPoolId: string;
};

export class CustomAuthStack extends Construct {
    constructor(scope: Construct, id: string, props: CustomAuthProps) {
    super(scope, id);

    // Reference the existing Cognito User Pool
    const userPool = cognito.UserPool.fromUserPoolId(
        this,
        'ExistingUserPool',
        props.userPoolId
    );

    // Reference the existing User Pool Client
    const existingClient = cognito.UserPoolClient.fromUserPoolClientId(
        this,
        'ExistingUserPoolClient',
        '5g5dpm896rndpqbdi7c94gc5uo' //hard coded for now
    );

    // New User Pool Client
    new cognito.UserPoolClient(this, 'CustomUserPoolClient', {
        userPool,
        userPoolClientName: 'MyCustomClient',
        generateSecret: false,
        authFlows: {
          userPassword: true,
          adminUserPassword: true,
        },
        oAuth: {
          callbackUrls: ['https://main.d2d1d8kuit8n8u.amplifyapp.com/'],
          flows: {
            authorizationCodeGrant: true,
          },
          scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        },
      }); 
  }
}
