'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getConfigStatus } from '@/lib/amplifyConfig';

const LIST_TRANSACTIONS = `
  query ListTransactions {
    listTransactions {
      items {
        id
        type
        amount
        description
        category
        date
        owner
        createdAt
        updatedAt
      }
    }
  }
`;

export function DatabaseConnectionDebug() {
  const { user, isAuthenticated } = useAuthStore();
  const [connectionStatus, setConnectionStatus] = useState<{
    amplifyConfig: boolean;
    userAuth: boolean;
    graphqlConnection: boolean;
    error?: string;
    transactionCount?: number;
  }>({
    amplifyConfig: false,
    userAuth: false,
    graphqlConnection: false,
  });

  const testConnection = async () => {
    console.log('🔍 Testing database connection...');
    
    // 1. Check Amplify configuration
    const configStatus = getConfigStatus();
    const amplifyConfigOk = configStatus.hasValidConfig && !configStatus.isDemoMode;
    
    console.log('📊 Config status:', configStatus);
    
    // 2. Check user authentication
    let userAuthOk = false;
    let currentUser = null;
    try {
      currentUser = await getCurrentUser();
      userAuthOk = !!currentUser;
      console.log('👤 Current user:', currentUser);
    } catch (error) {
      console.log('❌ No authenticated user:', error);
    }

    // 3. Test GraphQL connection
    let graphqlOk = false;
    let transactionCount = 0;
    let errorMessage = '';
    
    if (amplifyConfigOk && userAuthOk) {
      try {
        const client = generateClient();
        const response = await client.graphql({
          query: LIST_TRANSACTIONS,
        }) as any;
        
        graphqlOk = true;
        transactionCount = response.data?.listTransactions?.items?.length || 0;
        console.log('✅ GraphQL connection successful, transactions:', transactionCount);
      } catch (error: any) {
        console.error('❌ GraphQL error:', error);
        errorMessage = error.message;
      }
    } else {
      errorMessage = 'Configuration or authentication failed';
    }

    setConnectionStatus({
      amplifyConfig: amplifyConfigOk,
      userAuth: userAuthOk,
      graphqlConnection: graphqlOk,
      error: errorMessage,
      transactionCount,
    });
  };

  useEffect(() => {
    // Test connection when component mounts or auth state changes
    if (isAuthenticated) {
      testConnection();
    }
  }, [isAuthenticated]);

  const getStatusIcon = (status: boolean) => status ? '✅' : '❌';
  const getStatusText = (status: boolean) => status ? 'OK' : 'FAILED';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        🔍 Database Connection Status
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Amplify Configuration:</span>
          <span className="font-mono">
            {getStatusIcon(connectionStatus.amplifyConfig)} {getStatusText(connectionStatus.amplifyConfig)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>User Authentication:</span>
          <span className="font-mono">
            {getStatusIcon(connectionStatus.userAuth)} {getStatusText(connectionStatus.userAuth)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>GraphQL Connection:</span>
          <span className="font-mono">
            {getStatusIcon(connectionStatus.graphqlConnection)} {getStatusText(connectionStatus.graphqlConnection)}
          </span>
        </div>

        {connectionStatus.transactionCount !== undefined && (
          <div className="flex items-center justify-between">
            <span>Transactions in DB:</span>
            <span className="font-mono text-blue-600">
              {connectionStatus.transactionCount}
            </span>
          </div>
        )}

        {connectionStatus.error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-xs">
              <strong>Error:</strong> {connectionStatus.error}
            </p>
          </div>
        )}

        {user && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700 text-xs">
              <strong>User:</strong> {user.email} (ID: {user.id})
            </p>
          </div>
        )}
      </div>

      <button
        onClick={testConnection}
        className="mt-3 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
      >
        🔄 Test Connection
      </button>
    </div>
  );
}