import { Amplify } from 'aws-amplify';

// AWS Amplify configuration
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  },
};

// Configure Amplify
export function configureAmplify() {
  try {
    // Only configure if we have valid credentials
    if (process.env.NEXT_PUBLIC_USER_POOL_ID && 
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID &&
        !process.env.NEXT_PUBLIC_USER_POOL_ID.includes('XXXXXXXXX')) {
      Amplify.configure(amplifyConfig);
      console.log('Amplify configured successfully');
    } else {
      console.log('Amplify configuration skipped - using demo mode');
    }
  } catch (error) {
    console.error('Error configuring Amplify:', error);
  }
}

// Check if we're in demo mode
export const isDemoMode = () => {
  return !process.env.NEXT_PUBLIC_USER_POOL_ID || 
         process.env.NEXT_PUBLIC_USER_POOL_ID.includes('XXXXXXXXX') ||
         process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};