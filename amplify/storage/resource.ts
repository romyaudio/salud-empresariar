import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'budgetTrackerStorage',
  access: (allow) => ({
    'profile-images/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
    'company-logos/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ]
  })
});