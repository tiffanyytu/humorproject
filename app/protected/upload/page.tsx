"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>("Waiting for file...");
    const [captions, setCaptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus("File selected. Ready to upload!");
        }
    };

    const runPipeline = async () => {
        if (!file) return;
        setIsLoading(true);
        setCaptions([]);

        try {
            setStatus("Authenticating...");
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const userId = session?.user.id;

            if (!token || !userId) {
                throw new Error("You must be logged in to do this.");
            }

            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            // --- STEP 1: Generate Presigned URL ---
            setStatus("Step 1: Generating AWS Presigned URL...");
            const res1 = await fetch("https://api.almostcrackd.ai/pipeline/generate-presigned-url", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ contentType: file.type })
            });
            if (!res1.ok) throw new Error("Failed to generate presigned URL");
            const { presignedUrl, cdnUrl } = await res1.json();

            // --- STEP 2: Upload Image Bytes directly to AWS S3 ---
            setStatus("Step 2: Uploading image to cloud storage...");
            const res2 = await fetch(presignedUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file
            });
            if (!res2.ok) throw new Error("Failed to upload image to S3");

            // --- STEP 3: Register Image in the Pipeline ---
            setStatus("Step 3: Registering image in the database...");
            const res3 = await fetch("https://api.almostcrackd.ai/pipeline/upload-image-from-url", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    imageUrl: cdnUrl,
                    isCommonUse: false,
                    created_by_user_id: userId,
                    modified_by_user_id: userId
                })
            });
            if (!res3.ok) throw new Error("Failed to register image");
            const { imageId } = await res3.json();

            // --- STEP 4: Generate Captions ---
            setStatus("Step 4: AI is generating funny captions...");
            const res4 = await fetch("https://api.almostcrackd.ai/pipeline/generate-captions", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    imageId: imageId,
                    created_by_user_id: userId,
                    modified_by_user_id: userId
                })
            });
            if (!res4.ok) throw new Error("Failed to generate captions");

            const generatedCaptions = await res4.json();
            setCaptions(generatedCaptions);
            setStatus("Success! AI generation complete.");

        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center p-8 bg-black text-white font-sans relative">
            <h1 className="text-3xl font-bold mb-8 text-blue-400">Generate AI Captions 🤖</h1>

            <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg border border-gray-700 flex flex-col gap-6 relative z-10">
                {/* File Input */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                        Select an Image (JPEG, PNG, WEBP, GIF, HEIC)
                    </label>
                    <input
                        type="file"
                        accept="image/jpeg, image/jpg, image/png, image/webp, image/gif, image/heic"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-colors"
                    />
                </div>

                {/* Upload Button - TERMINOLOGY UPDATED HERE */}
                <button
                    onClick={runPipeline}
                    disabled={!file || isLoading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded font-bold transition-colors"
                >
                    {isLoading ? "Generating..." : "Generate AI Jokes!"}
                </button>

                {/* Status Tracker */}
                <div className="p-3 bg-black border border-gray-800 rounded text-sm text-gray-400 font-mono">
                    &gt; Status: {status}
                </div>
            </div>

            {/* Results Display */}
            {captions.length > 0 && (
                <div className="w-full max-w-md mt-8 relative z-10">
                    <h2 className="text-xl font-bold mb-4 text-green-400">Generated Captions:</h2>
                    <ul className="space-y-3">
                        {captions.map((cap, index) => (
                            <li key={index} className="bg-gray-800 p-4 rounded border border-gray-700 shadow-lg text-sm font-medium">
                                "{cap.content || cap.caption_context || JSON.stringify(cap)}"
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <a href="/protected" className="mt-12 text-gray-400 hover:text-white underline relative z-10 transition-colors">
                &larr; Back to VIP Voting Area
            </a>

            {/* --- FULL SCREEN LOADING OVERLAY --- */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
                    {/* The animated spinning wheel */}
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mb-6"></div>

                    {/* The highly visible status text */}
                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Working Magic...</h2>
                    <p className="text-blue-300 font-mono text-sm max-w-md text-center px-4 animate-pulse">
                        {status}
                    </p>
                </div>
            )}
            {/* ----------------------------------- */}

        </div>
    );
}