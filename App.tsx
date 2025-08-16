
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { generateVideoPromptsFromImage } from './services/geminiService';
import type { GeneratedPrompts } from './types';
import { SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<GeneratedPrompts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (dataUrl: string) => {
    setImageBase64(dataUrl);
    setPrompts(null);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!imageBase64) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrompts(null);

    try {
      // The Data URL is in the format "data:image/jpeg;base64,LzlqLzRB...". 
      // We need to extract just the Base64 part.
      const base64Data = imageBase64.split(',')[1];
      if (!base64Data) {
        throw new Error("Invalid image data format.");
      }

      const generatedPrompts = await generateVideoPromptsFromImage(base64Data);
      setPrompts(generatedPrompts);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Image-to-Video Prompt Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Tải ảnh lên để AI tạo prompt giúp chuyển ảnh tĩnh thành video động với các chuyển động tự nhiên.
          </p>
        </header>

        <main className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={imageBase64} />
            
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={handleGenerateClick}
                disabled={!imageBase64 || isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Generate Prompts
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          <PromptDisplay prompts={prompts} isLoading={isLoading} />
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
