import React, { useState } from 'react';
import { findPlaces } from '../services/geminiService';
import { GroundingSource } from '../types';

const FindView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [resultText, setResultText] = useState('');
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useLocation, setUseLocation] = useState(true);

  const handleFind = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResultText('');
    setSources([]);

    let userLocation;

    if (useLocation && navigator.geolocation) {
      try {
        const position: GeolocationPosition = await new Promise((resolve, reject) => {
           navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      } catch (error) {
        console.warn("Could not retrieve location, proceeding without it.");
      }
    }

    try {
      const result = await findPlaces(query, userLocation);
      setResultText(result.text);
      setSources(result.sources);
    } catch (error) {
      setResultText("An error occurred while finding places. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFind();
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Find Places</label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Coffee shops near me, Best pizza..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input 
            type="checkbox" 
            id="useLocation" 
            checked={useLocation} 
            onChange={(e) => setUseLocation(e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="useLocation" className="text-xs text-gray-600 cursor-pointer select-none">Use my current location</label>
        </div>
      </div>

      <button
        onClick={handleFind}
        disabled={isLoading || !query.trim()}
        className="w-full py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Finding...</span>
          </>
        ) : (
          <span>Find Places</span>
        )}
      </button>

      {resultText && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-sm text-gray-800 leading-relaxed shadow-sm">
             <div className="markdown-body">
               {resultText.split('\n').map((line, i) => (
                 <p key={i} className="mb-2 last:mb-0">{line}</p>
               ))}
             </div>
           </div>

           {sources.length > 0 && (
             <div className="space-y-2">
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Map Links</label>
               <div className="flex flex-col gap-2">
                 {sources.map((source, index) => (
                   <a 
                    key={index} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:border-green-200 transition-colors shadow-sm group"
                   >
                     <div className="flex items-center space-x-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{source.title}</span>
                     </div>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

export default FindView;
