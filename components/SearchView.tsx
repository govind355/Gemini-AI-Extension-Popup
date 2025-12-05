import React, { useState } from 'react';
import { searchWeb } from '../services/geminiService';
import { GroundingSource } from '../types';

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [resultText, setResultText] = useState('');
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResultText('');
    setSources([]);

    try {
      const result = await searchWeb(query);
      setResultText(result.text);
      setSources(result.sources);
    } catch (error) {
      setResultText("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Web Search</label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for recent news, facts, etc..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={isLoading || !query.trim()}
        className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Searching...</span>
          </>
        ) : (
          <span>Search Web</span>
        )}
      </button>

      {resultText && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-800 leading-relaxed shadow-sm">
             <div className="markdown-body">
               {resultText.split('\n').map((line, i) => (
                 <p key={i} className="mb-2 last:mb-0">{line}</p>
               ))}
             </div>
           </div>

           {sources.length > 0 && (
             <div className="space-y-2">
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sources</label>
               <div className="flex flex-wrap gap-2">
                 {sources.map((source, index) => (
                   <a 
                    key={index} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors max-w-full truncate shadow-sm"
                   >
                     <span className="truncate max-w-[150px]">{source.title}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                     </svg>
                   </a>
                 ))}
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default SearchView;
