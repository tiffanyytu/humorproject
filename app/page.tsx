import { supabase } from "@/lib/supabaseClient";

// 1. Define what a "Caption" looks like, now including the joined image data
type Caption = {
    id: string;
    content: string;
    images?: { url: string } | null;
};

// 2. Fetch data from Supabase
async function getCaptions() {
    // We update the select statement to pull the image URL via the foreign key
    const { data, error } = await supabase.from("captions").select("*, images(url)");

    if (error) {
        console.error("Error fetching captions:", error);
        return [];
    }
    return data as Caption[];
}

// 3. Render the list
export default async function Home() {
    const captions = await getCaptions();

    return (
        <div className="flex min-h-screen flex-col items-center p-8 bg-black text-white">

            {/* --- NEW HEADER SECTION --- */}
            <div className="w-full max-w-md flex justify-end mb-4">
                <a
                    href="/login"
                    className="bg-blue-600 px-4 py-2 rounded text-sm font-bold hover:bg-blue-500 transition"
                >
                    Go to Login / VIP Area &rarr;
                </a>
            </div>
            {/* -------------------------- */}

            <h1 className="text-3xl font-bold mb-8">Community Feed</h1>

            <ul className="w-full max-w-md space-y-6">
                {captions.map((caption) => (
                    <li
                        key={caption.id}
                        className="p-4 border border-gray-700 rounded-lg bg-gray-900 flex flex-col gap-4"
                    >
                        {/* THE NEW IMAGE SECTION */}
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

                        <span className="text-sm font-medium">{caption.content}</span>
                    </li>
                ))}

                {captions.length === 0 && (
                    <p className="text-gray-400">No captions found (or check your database connection!)</p>
                )}
            </ul>
        </div>
    );
}