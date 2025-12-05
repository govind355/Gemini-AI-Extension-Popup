import React, { useState, useEffect } from 'react';
import { summarizeText } from '../services/geminiService';

const SummarizeView: React.FC = () => {
  const [inputText, setInputText] = useState(() => localStorage.getItem('gemini_ext_summarize_input') || '');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini_ext_summarize_input', inputText);
  }, [inputText]);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeText(inputText);
      setSummary(result);
    } catch (error) {
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteDemo = () => {
    setInputText(`Google Gemini is a multimodal AI model developed by Google. It is designed to understand, operate on, and combine different types of information, including text, code, audio, image, and video. Gemini comes in different sizes: Ultra, Pro, Flash, and Nano, catering to various computational needs from data centers to mobile devices. It represents a significant leap forward in AI capabilities, demonstrating state-of-the-art performance on many leading benchmarks. The model is integrated into various Google products, including Search, Workspace, and Android.`);
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content to Summarize</label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text here to summarize..."
            className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-gray-50"
          />
          {inputText.length === 0 && (
             <button 
               onClick={handlePasteDemo}
               className="absolute top-2 right-2 text-xs text-indigo-600 hover:text-indigo-800 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100"
             >
               Paste Demo Text
             </button>
          )}
        </div>
      </div>

      <button
        onClick={handleSummarize}
        disabled={isLoading || !inputText.trim()}
        className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Summarizing...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
            <span>Summarize</span>
          </>
        )}
      </button>

      {summary && (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Summary</label>
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-gray-800 leading-relaxed shadow-sm">
             <div className="markdown-body">
               {summary.split('\n').map((line, i) => (
                 <p key={i} className="mb-1">{line}</p>
               ))}
             </div>
          </div>
          <button 
            onClick={() => { navigator.clipboard.writeText(summary); }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
            </svg>
            Copy Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default SummarizeView;