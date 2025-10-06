import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "689e86e9f91ac2c41b4b1b15", 
  requiresAuth: true // Ensure authentication is required for all operations
});
