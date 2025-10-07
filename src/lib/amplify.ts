import { configureAmplifyFromOutputs, isUsingRealAWS, getConfigStatus } from './amplifyConfig';

// Configure Amplify using the new configuration
export function configureAmplify() {
  try {
    const success = configureAmplifyFromOutputs();
    if (success) {
      console.log('✅ Amplify configured with AWS DynamoDB');
    } else {
      console.log('❌ Failed to configure Amplify');
    }
  } catch (error) {
    console.error('Error configuring Amplify:', error);
  }
}

// Check if we're in demo mode
export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

// Export configuration utilities
export { isUsingRealAWS, getConfigStatus };