"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // 1. Supabase automatically detects the #access_token in the URL
        // and saves it to the cookie using the client we just set up.

        // 2. We verify we have a session, then redirect.
        const handleAuth = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (session) {
                router.push("/protected");
            } else {
                console.error("Login failed or no session found", error);
                // Optional: Redirect back to login if it fails
                // router.push("/login");
            }
        };

        handleAuth();
    }, [router]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                <p>Finalizing Login...</p>
            </div>
        </div>
    );
}