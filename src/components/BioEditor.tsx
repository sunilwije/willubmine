import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { enhanceBio } from '../services/ai';

interface BioEditorProps {
  initialBio: string;
  onSave: (newBio: string) => void;
}

export const BioEditor: React.FC<BioEditorProps> = ({ initialBio, onSave }) => {
  const [bio, setBio] = useState(initialBio);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState<string | null>(null);

  const handleEnhance = async () => {
    setIsGenerating(true);
    try {
      const enhanced = await enhanceBio(bio);
      setGeneratedBio(enhanced);
    } catch (error) {
      console.error("Failed to enhance bio", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = () => {
    if (generatedBio) {
      setBio(generatedBio);
      setGeneratedBio(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-rose-500" />
        AI Profile Assistant
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            placeholder="Tell us a bit about yourself..."
          />
        </div>

        {generatedBio && (
          <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 animate-fade-in">
            <h4 className="text-sm font-semibold text-rose-700 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Suggestion
            </h4>
            <p className="text-gray-700 text-sm mb-3">{generatedBio}</p>
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 text-white text-xs rounded-md hover:bg-rose-600 transition-colors"
              >
                <Check className="h-3 w-3" />
                Use This
              </button>
              <button
                onClick={() => setGeneratedBio(null)}
                className="px-3 py-1.5 bg-white text-gray-600 text-xs rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleEnhance}
            disabled={isGenerating || !bio}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Enhance with AI
              </>
            )}
          </button>
          
          <button
            onClick={() => onSave(bio)}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
