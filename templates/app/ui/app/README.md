# Templates UI - Authentication Template

This is a minimal Next.js 15 template with authentication and GraphQL capabilities, stripped down to the essentials for use as a starting point for future applications.

## Features

- **Next.js 15**: Latest Next.js with App Router and modern features
- **Authentication**: Google OAuth integration using NextAuth.js v5
- **GraphQL**: URQL client with subscription support via GraphQL WebSocket
- **Database Integration**: Hasura GraphQL engine with JWT authentication
- **UI Components**: Radix UI components with Tailwind CSS styling
- **TypeScript**: Full TypeScript support with modern configuration

## What's Included

### Core Authentication
- Google OAuth provider configuration
- JWT token generation for Hasura
- Session management with NextAuth.js
- Protected routes and session validation

### GraphQL Setup
- URQL client with cache, fetch, and subscription exchanges
- WebSocket client for real-time subscriptions
- Hasura JWT token integration
- API endpoint for token generation

### UI Components
- Clean sign-in page with Google OAuth
- Basic home page with user info and sign-out
- Radix UI components (Button, Dialog, etc.)
- Tailwind CSS for styling

### File Structure
```
src/
├── app/
│   ├── api/
│   │   └── hasura/          # JWT token generation
│   ├── signin/              # Sign-in page
│   ├── home.tsx             # Home component
│   ├── page.tsx             # Main page with auth logic
│   ├── providers.tsx        # NextAuth and URQL providers
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Radix UI components
│   ├── home-page.tsx        # Home page component
│   └── classy-green-sign-in-page.tsx  # Sign-in component
└── lib/
    ├── auth.ts              # NextAuth configuration
    └── utils.ts             # Utility functions
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret

# Database
DB_USERS_ENDPOINT=your_hasura_endpoint
DB_USERS_SECRET=your_hasura_admin_secret

# Hasura JWT
HASURA_GRAPHQL_JWT_SECRET=your_jwt_secret

# Public endpoints for client-side GraphQL
NEXT_PUBLIC_DB_POTION_ENDPOINT_WS=wss://your-hasura-endpoint/v1/graphql
NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP=https://your-hasura-endpoint/v1/graphql
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables in `.env.local`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5001](http://localhost:5001) in your browser

## What Was Removed & Updated

This template was cleaned up from a larger application by:

**Removed:**
- Pocket integration
- Notion integration  
- Kindle integration
- Ocean components
- Chakra UI dependency
- Unused API endpoints and utilities

**Updated:**
- Upgraded to Next.js 15.3.3 with latest features
- Migrated to NextAuth.js v5 with modern authentication patterns
- Updated all dependencies to latest compatible versions
- Modernized configuration files (next.config.js, tsconfig.json)

## Next Steps

This template provides a solid foundation for building authenticated applications with GraphQL. You can extend it by:
- Adding your own components and pages
- Implementing your GraphQL schema
- Adding more authentication providers
- Customizing the UI theme
- Adding additional API endpoints 