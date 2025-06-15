# state

## Description

database graphql api

## Recurrent problem

- In Hasura console, if data is not available, make sure to port forward port 9693

## How to Call the Hasura API with TypeScript

You can interact with the Hasura GraphQL API from your TypeScript application using the `graphql-request` library. Below is a simple example that demonstrates how to send a query to Hasura, using a string literal for the GraphQL query.

### 1. Install Dependencies

```bash
npm install graphql-request
```

### 2. Example: Querying Hasura with TypeScript

Here's a minimal example of how to call the Hasura API:

```typescript
import { GraphQLClient, gql } from "graphql-request";

// Replace with your Hasura endpoint and admin secret
const HASURA_ENDPOINT = "http://localhost:9693/v1/graphql";
const HASURA_ADMIN_SECRET = "your-admin-secret";

// Create a GraphQL client
const client = new GraphQLClient(HASURA_ENDPOINT, {
  headers: {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
  },
});

// Define your GraphQL query as a string literal
const query = gql`
  query GetUsers {
    users {
      id
      email
      givenName
      familyName
    }
  }
`;

// Call the API
async function fetchUsers() {
  try {
    const data = await client.request(query);
    console.log(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

fetchUsers();
```

### 3. Notes

- Replace `HASURA_ENDPOINT` and `HASURA_ADMIN_SECRET` with your actual Hasura endpoint and secret.
- You can use the same pattern for mutations or other queries—just change the string literal in the `gql` template.
- For production, consider using environment variables to store secrets.