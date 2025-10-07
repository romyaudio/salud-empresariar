import { Amplify } from 'aws-amplify';

// Configure Amplify using the outputs from amplify_outputs.json
export function configureAmplifyFromOutputs() {
  try {
    // Try to import amplify_outputs.json
    let amplifyOutputs;
    try {
      amplifyOutputs = require('../../amplify_outputs.json');
    } catch (importError) {
      console.warn('⚠️ amplify_outputs.json not found. Using environment variables or demo mode.');
      
      // Check if we have environment variables as fallback
      if (process.env.NEXT_PUBLIC_USER_POOL_ID && 
          !process.env.NEXT_PUBLIC_USER_POOL_ID.includes('XXXXXXXXX')) {
        
        // Create config from environment variables
        amplifyOutputs = {
          auth: {
            user_pool_id: process.env.NEXT_PUBLIC_USER_POOL_ID,
            aws_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
            user_pool_client_id: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
          },
          data: {
            url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
            aws_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
            default_authorization_type: 'AMAZON_COGNITO_USER_POOLS',
          }
        };
      } else {
        console.log('🎭 No valid AWS configuration found. Running in demo mode.');
        return false;
      }
    }

    // Use the amplify_outputs.json directly as it's already in the correct format
    Amplify.configure(amplifyOutputs);
    
    console.log('✅ Amplify configured successfully with real AWS resources');
    console.log('📊 GraphQL endpoint:', amplifyOutputs.data?.url);
    console.log('🔐 User Pool ID:', amplifyOutputs.auth?.user_pool_id);
    
    return true;
  } catch (error) {
    console.error('❌ Error configuring Amplify:', error);
    return false;
  }
}

// Check if we're using real AWS resources
export const isUsingRealAWS = () => {
  return !process.env.NEXT_PUBLIC_DEMO_MODE || process.env.NEXT_PUBLIC_DEMO_MODE === 'false';
};

// Get current configuration status
export const getConfigStatus = () => {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  let amplifyOutputs;
  try {
    amplifyOutputs = require('../../amplify_outputs.json');
  } catch (error) {
    // File doesn't exist, use environment variables
    amplifyOutputs = {
      auth: {
        user_pool_id: process.env.NEXT_PUBLIC_USER_POOL_ID,
      },
      data: {
        url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        aws_region: process.env.NEXT_PUBLIC_AWS_REGION,
      }
    };
  }
  
  const hasValidConfig = amplifyOutputs.auth?.user_pool_id && amplifyOutputs.data?.url;
  
  return {
    isDemoMode,
    hasValidConfig,
    userPoolId: amplifyOutputs.auth?.user_pool_id,
    graphqlEndpoint: amplifyOutputs.data?.url,
    region: amplifyOutputs.data?.aws_region,
  };
};