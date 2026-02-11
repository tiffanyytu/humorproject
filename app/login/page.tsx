"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
    const handleGoogleLogin = async () => {
        // 1. Get the current URL so we can redirect back correctly
        const origin = window.location.origin;

        // 2. Call Supabase Auth
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                // This is the specific Google Client ID from your assignment
                queryParams: {
                    access_type: "offline",
                    prompt: "consent",
                    client_id: "388960353527-fh4grc6mla425lg0e3g1hh67omtrdihd.apps.googleusercontent.com"
                },
                // The detailed instructions said redirect to /auth/callback
                redirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-black">
            <div className="p-8 bg-gray-900 rounded-lg border border-gray-700">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Login Required</h1>
                <button
                    onClick={handleGoogleLogin}
                    className="bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-200 flex items-center gap-2"
                >
                    {/* Simple Google Icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}