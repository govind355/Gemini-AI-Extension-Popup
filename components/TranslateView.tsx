import React, { useState, useEffect } from 'react';
import { translateText } from '../services/geminiService';

const LANGUAGES = [
  "Spanish", "French", "German", "Italian", "Portuguese",
  "Chinese (Simplified)", "Japanese", "Korean", 
  "Hindi", "Arabic", "Russian", "Dutch", "Turkish"
];

const TranslateView: React.FC = () => {
  const [input, setInput] = useState(() => localStorage.getItem('gemini_ext_translate_input') || '');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini_ext_translate_input', input);
  }, [input]);

  const handleTranslate = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const result = await translateText(input, targetLang);
      setOutput(result);
    } catch (error) {
      setOutput("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Translate From (Auto)</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to translate..."
          className="w-full h-24 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-gray-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Translate To</label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleTranslate}
        disabled={isLoading || !input.trim()}
        className="w-full py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Translating...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
            </svg>
            <span>Translate</span>
          </>
        )}
      </button>

      {output && (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="flex justify-between items-center">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Result ({targetLang})</label>
             <button 
              onClick={() => { navigator.clipboard.writeText(output); }}
              className="text-xs text-orange-600 hover:text-orange-800 font-medium"
            >
              Copy
            </button>
           </div>
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg text-sm text-gray-800 leading-relaxed shadow-sm min-h-[100px]">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslateView;
