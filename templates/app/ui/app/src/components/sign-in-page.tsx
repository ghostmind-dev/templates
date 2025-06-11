'use client'

import React from 'react';
import { Button } from "@/components/ui/button"

interface SignInPageProps {
  onSignIn: () => void;
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Templates UI
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to continue
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={onSignIn}
            className="w-full"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  )
}