import { Amplify } from 'aws-amplify';
import amplifyOutputs from '../../amplify_outputs.json';

// Configure Amplify using the outputs from amplify_outputs.json
export function configureAmplifyFromOutputs() {
  try {
    // Use the amplify_outputs.json directly as it's already in the correct format
    Amplify.configure(amplifyOutputs);
    
    console.log('✅ Amplify configured successfully with real AWS resources');
    console.log('📊 GraphQL endpoint:', amplifyOutputs.data.url);
    console.log('🔐 User Pool ID:', amplifyOutputs.auth.user_pool_id);
    
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
  const hasValidConfig = amplifyOutputs.auth.user_pool_id && amplifyOutputs.data.url;
  
  return {
    isDemoMode,
    hasValidConfig,
    userPoolId: amplifyOutputs.auth.user_pool_id,
    graphqlEndpoint: amplifyOutputs.data.url,
    region: amplifyOutputs.data.aws_region,
  };
};