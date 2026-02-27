import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
            created_datetime_utc: now,
            modified_datetime_utc: now
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
            <h1 className="text-3xl font-bold mb-4 text-green-400">VIP Voting Area 🗳️</h1>
            <div className="mb-6">
                <a href="/protected/upload" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-colors shadow-lg">
                    + Upload New Image
                </a>
            </div>
            <p className="mb-8 text-gray-400">Welcome, {user.email}! Cast your votes below.</p>

            <ul className="w-full max-w-md space-y-6">
                {captions?.map((caption) => (
                    <li key={caption.id} className="p-4 border border-gray-700 rounded-lg bg-gray-900 flex flex-col gap-4">

                        {/* THE NEW IMAGE SECTION */}
                        {/* We use optional chaining (?.) just in case the RLS policy hides the image or it was deleted */}
                        {caption.images?.url ? (
                            <img
                                src={caption.images.url}
                                alt="Context for caption"
                                className="w-full max-h-64 object-contain rounded bg-black/50"
                            />
                        ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-800 rounded text-gray-500 text-sm">
                                Image unavailable
                            </div>
                        )}

                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm font-medium">{caption.content}</span>

                            <form action={castVote} className="flex gap-2 shrink-0">
                                <input type="hidden" name="captionId" value={caption.id} />

                                <button
                                    type="submit"
                                    name="voteType"
                                    value="up"
                                    className="bg-gray-700 hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors"
                                >
                                    👍
                                </button>
                                <button
                                    type="submit"
                                    name="voteType"
                                    value="down"
                                    className="bg-gray-700 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
                                >
                                    👎
                                </button>
                            </form>
                        </div>
                    </li>
                ))}

                {(!captions || captions.length === 0) && (
                    <p className="text-gray-400">No captions available to vote on right now.</p>
                )}
            </ul>
        </div>
    );
}