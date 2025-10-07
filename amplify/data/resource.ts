import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Transaction: a
    .model({
      type: a.enum(['INCOME', 'EXPENSE']),
      amount: a.float().required(),
      description: a.string().required(),
      category: a.string().required(),
      subcategory: a.string(),
      date: a.date().required(),
      paymentMethod: a.enum(['CASH', 'CARD', 'TRANSFER', 'CHECK', 'OTHER']),
      reference: a.string(),
      tags: a.string().array(),
      attachments: a.string().array(),
    })
    .authorization((allow) => [allow.owner()]),

  Category: a
    .model({
      name: a.string().required(),
      type: a.enum(['INCOME', 'EXPENSE']),
      subcategories: a.string().array().required(),
      color: a.string().required(),
      icon: a.string(),
      isDefault: a.boolean().required(),
    })
    .authorization((allow) => [allow.owner()]),

  Budget: a
    .model({
      name: a.string().required(),
      category: a.string().required(),
      amount: a.float().required(),
      period: a.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
      startDate: a.date().required(),
      endDate: a.date().required(),
      spent: a.float().required(),
      isActive: a.boolean().required(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});