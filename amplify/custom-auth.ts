import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

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
    // const existingClient = cognito.UserPoolClient.fromUserPoolClientId(
    //     this,
    //     'ExistingUserPoolClient',
    //     '5g5dpm896rndpqbdi7c94gc5uo' //hard coded for now
    // );

    userPool.addClient

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
            callbackUrls: ['https://main.d2d1d8kuit8n8u.amplifyapp.com/'], //hard coded for now
            flows: {
            authorizationCodeGrant: true,
            },
            scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        },
    }); 

    new cognito.UserPoolDomain(this, 'CustomUserPoolDomain',{
        userPool,
        cognitoDomain:{
            domainPrefix: 'lambda-furl-d2d1d8kuit8n8u' //hard coded for now
        }
    });

    // const userPoolClient = userPool.addClient('',{
    //     userPoolClientName: 'MyCustomClient',
    //     generateSecret: true,
    //     oAuth: {
    //         flows: {
    //             authorizationCodeGrant: true,
    //         },
    //         scopes: [ cognito.OAuthScope.OPENID ],
    //         callbackUrls: [ 'https://main.d2d1d8kuit8n8u.amplifyapp.com/' ] //hard coded for now
    //     },
    // });

    // const userPoolDomain = userPool.addDomain('CustomUserPoolDomain',{
    //     cognitoDomain:
    //     {
    //       domainPrefix: 'lambda-furl-d2d1d8kuit8n8u' //hard coded for now
    //     }
    // });

    // const signInUrl = userPoolDomain.signInUrl(userPoolClient, {
    //     redirectUri: 'https://main.d2d1d8kuit8n8u.amplifyapp.com/', //hard coded for now
    // });
  }
}
