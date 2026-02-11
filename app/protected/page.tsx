import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
    // 1. Check if user is logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 2. If no user, kick them out (Server-side protection)
    if (!user) {
        return redirect("/login");
    }

    // 3. Render the secret content
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-green-900 text-white">
            <h1 className="text-4xl font-bold mb-4">VIP Area 🔓</h1>
            <p className="text-xl mb-8">Welcome, {user.email}!</p>

            <div className="bg-black/30 p-6 rounded-lg max-w-lg">
                <p>You have successfully authenticated with Google.</p>
                <p className="mt-4 text-sm text-gray-300">User ID: {user.id}</p>
            </div>

            {/* Logout Button (Server Action would be better, but this works for now) */}
            <form action="/auth/signout" method="post" className="mt-8">
                <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                    Sign Out
                </button>
            </form>
        </div>
    );
}