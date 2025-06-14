'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { UrlqProvider } from '@/app/providers';

import Home from './home';

export default async function Main() {
  const session = await auth();

  if (!session) {
    redirect('/signin');
  }

  const userEmail = session.user?.email;

  if (!userEmail) {
    redirect('/signin');
  }

  // let publicEnvVar = {
  //   NEXT_PUBLIC_DB_POTION_ENDPOINT_WS:
  //     process.env.NEXT_PUBLIC_DB_POTION_ENDPOINT_WS,
  //   NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP:
  //     process.env.NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP,
  // };

  return (

    <Home
      userEmail={userEmail}
    />
    // </UrlqProvider>
  );
}
