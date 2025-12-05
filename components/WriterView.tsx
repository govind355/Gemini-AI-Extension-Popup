import React, { useState, useEffect } from 'react';
import { Tone } from '../types';
import { rewriteText } from '../services/geminiService';

const WriterView: React.FC = () => {
  const [input, setInput] = useState(() => localStorage.getItem('gemini_ext_writer_input') || '');
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini_ext_writer_input', input);
  }, [input]);

  const handleRewrite = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const result = await rewriteText(input, selectedTone);
      setOutput(result);
    } catch (error) {
      setOutput("Failed to rewrite text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tones = Object.values(Tone);

  return (
    <div className="flex flex-col h-full bg-white p-4 space-y-4 overflow-y-auto">
       <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Draft</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your draft here (e.g. an email, a tweet)..."
          className="w-full h-24 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Tone</label>
        <div className="grid grid-cols-2 gap-2">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => setSelectedTone(tone)}
              className={`px-3 py-2 text-xs font-medium rounded-md border transition-all ${
                selectedTone === tone
                  ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleRewrite}
        disabled={isLoading || !input.trim()}
        className="w-full py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Rewriting...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            <span>Rewrite</span>
          </>
        )}
      </button>

      {output && (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="flex justify-between items-center">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</label>
             <button 
              onClick={() => { navigator.clipboard.writeText(output); }}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium"
            >
              Copy
            </button>
           </div>
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-gray-800 leading-relaxed shadow-sm min-h-[100px]">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default WriterView;