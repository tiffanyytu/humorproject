import { supabase } from "@/lib/supabaseClient";

// 1. Define what a "Caption" looks like
type Caption = {
    id: string;
    content: string;
};

// 2. Fetch data from Supabase
async function getCaptions() {
    const { data, error } = await supabase.from("captions").select("*");

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
            <h1 className="text-3xl font-bold mb-8">Captions List</h1>

            <ul className="w-full max-w-md space-y-4">
                {captions.map((caption) => (
                    <li
                        key={caption.id}
                        className="p-4 border border-gray-700 rounded-lg bg-gray-900"
                    >
                        {caption.content}
                    </li>
                ))}

                {captions.length === 0 && (
                    <p className="text-gray-400">No captions found (or check your database connection!)</p>
                )}
            </ul>
        </div>
    );
}