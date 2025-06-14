'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HomePageComponent } from '@/components/home-page';

export default function Home({
  userEmail,
}: {
  userEmail: string;
}) {
  const router = useRouter();

  const signOutRequest = async (event: MouseEvent) => {
    event.preventDefault();
    await signOut({ redirect: false });
    router.replace('/signin');
  };

  return (
    <div>
      <HomePageComponent
        userEmail={userEmail}
        onSignOut={signOutRequest}
      />
    </div>
  );
}
