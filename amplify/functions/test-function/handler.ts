import type { Handler } from 'aws-lambda';

export const handler: Handler = async (event, context) => {
  // your function code goes here
  console.log('Event: ', event);
  console.log('Context: ', context)

  return {results: {event, context}};
};