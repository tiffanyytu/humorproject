import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import LogoutButton from "@/app/LogoutButton"; // <-- MAKE SURE THIS PATH MATCHES WHERE YOU SAVED IT!

export default async function ProtectedPage() {
    const supabase = await createClient();

    // 1. Verify the user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // 2. Fetch the captions AND the associated image URL using a Supabase join
    const { data: captions, error: fetchError } = await supabase
        .from("captions")
        .select("*, images(url)");

    if (fetchError) {
        console.error("Error fetching captions:", fetchError);
    }

    // 3. The "Mutator" Function (Server Action)
    async function castVote(formData: FormData) {
        "use server";

        const captionId = formData.get("captionId") as string;
        const voteType = formData.get("voteType") as string;

        // Re-verify the user securely
        const actionSupabase = await createClient();
        const { data: { user: actionUser } } = await actionSupabase.auth.getUser();

        if (!actionUser) {
            console.error("Must be logged in to vote!");
            return;
        }

        // Capture the exact current time in the standard format Supabase expects
        const now = new Date().toISOString();

        // INSERT THE ROW INTO SUPABASE
        const { error } = await actionSupabase.from("caption_votes").insert({
            caption_id: captionId,
            profile_id: actionUser.id,
            vote_value: voteType === "up" ? 1 : -1,
            // NEW REQUIRED FIELDS:
            created_by_user_id: actionUser.id,
            modified_by_user_id: actionUser.id
        });

        if (error) {
            console.error("Database Insert Error:", error.message);
        } else {
            console.log("Vote successfully cast!");
        }

        // Refresh the page data
        revalidatePath("/protected");
    }

    return (
        <div className="flex min-h-screen flex-col items-center p-8 bg-black text-white">

            {/* --- NEW GLOBAL NAVIGATION BAR --- */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 bg-gray-900 p-4 rounded-lg border border-gray-800 gap-4">

                {/* User Info (Left Side) */}
                <div className="flex items-center gap-4">
                    <span className="text-2xl">🗳️</span>
                    <div>
                        <h1 className="text-xl font-bold text-green-400">VIP Area</h1>
                        <p className="text-gray-400 text-xs mt-1">Logged in as: <span className="text-white">{user.email}</span></p>
                    </div>
                </div>

                {/* Actions (Right Side) */}
                <div className="flex items-center gap-4">
                    <a href="/protected/upload" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-colors shadow-lg">
                        + Upload New Image
                    </a>
                    <LogoutButton />
                </div>
            </div>
            {/* --------------------------------- */}

            {/* --- THE GRID --- */}
            <ul className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {captions?.map((caption) => (
                    <li key={caption.id} className="p-4 border border-gray-700 rounded-lg bg-gray-900 flex flex-col gap-4 justify-between">

                        <div className="flex flex-col gap-4">
                            {caption.images?.url ? (
                                <img
                                    src={caption.images.url}
                                    alt="Context for caption"
                                    className="w-full h-48 object-cover rounded bg-black/50"
                                />
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center bg-gray-800 rounded text-gray-500 text-sm">
                                    Image unavailable
                                </div>
                            )}

                            <span className="text-sm font-medium">{caption.content}</span>
                        </div>

                        <div className="flex justify-end items-center pt-2 border-t border-gray-800 mt-2">
                            <form action={castVote} className="flex gap-2 shrink-0">
                                <input type="hidden" name="captionId" value={caption.id} />

                                <button
                                    type="submit"
                                    name="voteType"
                                    value="up"
                                    className="bg-gray-700 hover:bg-green-600 px-4 py-2 rounded text-sm transition-colors"
                                >
                                    👍
                                </button>
                                <button
                                    type="submit"
                                    name="voteType"
                                    value="down"
                                    className="bg-gray-700 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors"
                                >
                                    👎
                                </button>
                            </form>
                        </div>
                    </li>
                ))}

                {(!captions || captions.length === 0) && (
                    <p className="text-gray-400 col-span-full text-center">No captions available to vote on right now.</p>
                )}
            </ul>
        </div>
    );
}