'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface HomePageComponentProps {
    userEmail: string;
    onSignOut: (event: MouseEvent) => void;
}

export function HomePageComponent({ userEmail, onSignOut }: HomePageComponentProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-6 p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {userEmail}
                    </p>
                </div>

                <Button
                    onClick={onSignOut}
                    variant="outline"
                    className="w-full"
                >
                    Sign Out
                </Button>
            </div>
        </div>
    );
} 