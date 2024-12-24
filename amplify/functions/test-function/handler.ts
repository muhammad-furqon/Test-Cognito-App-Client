import type { Handler } from 'aws-lambda';

export type LambdaResult = {
  event: any;    // 'any' because the shape of event depends on the trigger
  context: any;  // 'any' for the same reason
};

export const handler: Handler = async (event, context): Promise<LambdaResult> => {
  // your function code goes here
  const { code } = event.arguments;
  
  console.log('Code: ', code);
  console.log('Event: ', event);
  console.log('Context: ', context)

  return {event: event, context:context};
};