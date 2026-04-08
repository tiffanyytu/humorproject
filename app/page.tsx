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
        <div className="flex min-h-screen flex-col items-center p-8 bg-black text-white font-sans">

            {/* --- NEW HERO / ONBOARDING SECTION --- */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between bg-gray-900 border border-gray-800 p-8 rounded-xl mb-12 shadow-2xl gap-8 relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-green-500"></div>

                <div className="max-w-2xl z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Almost Crack'd</span> 🤖
                    </h1>
                    <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                        The ultimate AI-powered joke generator. We take your ordinary photos and turn them into unhinged, hilarious content.
                    </p>
                    <p className="text-sm text-gray-400 font-medium bg-black/40 inline-block px-4 py-2 rounded-lg border border-gray-700">
                        👇 Scroll down to view the community's creations, or log in to upload your own and vote!
                    </p>
                </div>

                <div className="flex-shrink-0 z-10 w-full md:w-auto">
                    <a
                        href="/login"
                        className="flex items-center justify-center gap-2 bg-blue-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 w-full"
                    >
                        Enter VIP Area &rarr;
                    </a>
                </div>
            </div>
            {/* -------------------------------------- */}

            {/* FEED HEADER */}
            <div className="w-full max-w-6xl flex items-center justify-start mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    🔥 Community Feed
                </h2>
            </div>

            {/* THE GRID (Implemented in Step 1) */}
            <ul className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {captions.map((caption) => (
                    <li
                        key={caption.id}
                        className="p-4 border border-gray-700 rounded-lg bg-gray-900 flex flex-col gap-4 transition-transform hover:scale-[1.02] hover:border-gray-500 duration-300"
                    >
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

                        <span className="text-sm font-medium text-gray-200 leading-relaxed">{caption.content}</span>
                    </li>
                ))}

                {captions.length === 0 && (
                    <p className="text-gray-400 col-span-full text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                        No captions found yet. Be the first to generate one in the VIP Area!
                    </p>
                )}
            </ul>
        </div>
    );
}