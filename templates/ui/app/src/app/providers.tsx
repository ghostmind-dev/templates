'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import {
  Client,
  Provider,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql';
import { createClient as createWSClient } from 'graphql-ws';
import { useState, useEffect } from 'react';

///////////////////////////////////////////////////////////////////////////////////////
// PROPS
///////////////////////////////////////////////////////////////////////////////////////

type Props = {
  children?: React.ReactNode;
};

type UrlqProviderProps = {
  children?: React.ReactNode;
  publicEnvVar: {
    NEXT_PUBLIC_DB_POTION_ENDPOINT_WS?: string;
    NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP?: string;
  };
};

///////////////////////////////////////////////////////////////////////////////////////
// NEXT-AUTH
///////////////////////////////////////////////////////////////////////////////////////

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

///////////////////////////////////////////////////////////////////////////////////////
// URQL
///////////////////////////////////////////////////////////////////////////////////////

export const UrlqProvider = ({ children, publicEnvVar }: UrlqProviderProps) => {
  const endpointWS = publicEnvVar.NEXT_PUBLIC_DB_POTION_ENDPOINT_WS;
  const endpointHTTPS = publicEnvVar.NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP;
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const res = await fetch('/api/hasura');
      const tokenGenerated = await res.json();

      setToken(tokenGenerated.hasura_token);
    }
    getToken();
  }, []);

  const secret = `Bearer ${token}`;

  // Setup WebSocket Client for Subscriptions
  const wsClient = createWSClient({
    url: endpointWS || '',
    connectionParams: () => {
      return {
        headers: { authorization: secret ? `${secret}` : '' },
      };
    },
  });

  // Setup URQL Client for Queries and Mutations
  const client = new Client({
    url: endpointHTTPS || '',
    fetchOptions: () => {
      return {
        headers: { authorization: secret ? `${secret}` : '' },
      };
    },
    exchanges: [
      cacheExchange,
      fetchExchange,
      subscriptionExchange({
        forwardSubscription(request) {
          const input = { ...request, query: request.query || '' };
          return {
            subscribe(sink) {
              const unsubscribe = wsClient.subscribe(input, sink);
              return { unsubscribe };
            },
          };
        },
      }),
    ],
  });

  return <Provider value={client}>{children}</Provider>;
};

///////////////////////////////////////////////////////////////////////////////////////
// THE END
///////////////////////////////////////////////////////////////////////////////////////
