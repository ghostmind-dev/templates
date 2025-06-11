declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GOOGLE_OAUTH_CLIENT_ID: string;
    GOOGLE_OAUTH_CLIENT_SECRET: string;
    DB_USERS_ENDPOINT: string;
    DB_USERS_SECRET: string;
    HASURA_GRAPHQL_JWT_SECRET: string;
    NEXT_PUBLIC_DB_POTION_ENDPOINT_WS: string;
    NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP: string;
  }
}
