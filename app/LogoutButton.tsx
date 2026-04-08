"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        // 1. Tell Supabase to end the session
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Error logging out:", error.message);
            return;
        }

        // 2. Teleport the user back to the Community Feed and refresh the router
        router.push("/");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm font-bold transition-colors shadow-lg"
        >
            Log Out
        </button>
    );
}