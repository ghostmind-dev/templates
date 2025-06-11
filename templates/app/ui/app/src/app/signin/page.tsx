"use client";

import React from 'react';
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SignInPage } from "@/components/sign-in-page";

export default function Login() {
  const { data: session } = useSession();

  if (session && session.user) {
    redirect("/");
  }

  function signInRequest() {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <>
      {!session?.user && session !== undefined && (
        <div>
          <SignInPage onSignIn={signInRequest} />
        </div>
      )}
    </>
  );
}
