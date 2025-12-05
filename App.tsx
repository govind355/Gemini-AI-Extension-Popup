import React, { useState } from 'react';
import ChatView from './components/ChatView';
import SummarizeView from './components/SummarizeView';
import WriterView from './components/WriterView';
import SearchView from './components/SearchView';
import FindView from './components/FindView';
import TranslateView from './components/TranslateView';
import { AppMode } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppMode>(AppMode.CHAT);

  // Helper to render the active view
  const renderView = () => {
    switch (activeTab) {
      case AppMode.CHAT:
        return <ChatView />;
      case AppMode.SEARCH:
        return <SearchView />;
      case AppMode.FIND:
        return <FindView />;
      case AppMode.TRANSLATE:
        return <TranslateView />;
      case AppMode.SUMMARIZE:
        return <SummarizeView />;
      case AppMode.WRITE:
        return <WriterView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="w-[375px] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436h.001c-3.798 2.956-8.85 4.316-13.725 3.525a.75.75 0 01-.6-1.107c1.78-2.618 2.966-5.748 3.328-9.083A14.654 14.654 0 019.315 7.584zM6.574 19.576A18.89 18.89 0 016 19.5a.75.75 0 01-.75-.75c0-.986.077-1.954.225-2.895.148.428.322.846.52 1.25.703 1.44 1.637 2.768 2.753 3.935l.006.006a.75.75 0 01-1.096 1.096c-.341-.36-.666-.738-.973-1.131a17.48 17.48 0 00-.111-.435zM3.468 15.694a17.436 17.436 0 00-.232.18.75.75 0 01-1.076-1.045c.404-.416.837-.806 1.293-1.168a.75.75 0 01.996 1.14c-.339.296-.667.61-.981.943v-.05z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="font-bold text-gray-800 tracking-tight">Gemini Assistant</h1>
        </div>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-1 py-2 grid grid-cols-6 gap-0.5">
        <NavButton 
          active={activeTab === AppMode.CHAT} 
          onClick={() => setActiveTab(AppMode.CHAT)} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>}
          label="Chat"
        />
        <NavButton 
          active={activeTab === AppMode.SEARCH} 
          onClick={() => setActiveTab(AppMode.SEARCH)} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
          label="Search"
        />
        <NavButton 
          active={activeTab === AppMode.FIND} 
          onClick={() => setActiveTab(AppMode.FIND)} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
          label="Find"
        />
        <NavButton 
          active={activeTab === AppMode.TRANSLATE} 
          onClick={() => setActiveTab(AppMode.TRANSLATE)} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>}
          label="Trans"
        />
        <NavButton 
          active={activeTab === AppMode.SUMMARIZE} 
          onClick={() => setActiveTab(AppMode.SUMMARIZE)} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>}
          label="Summ"
        />
        <NavButton 
          active={activeTab === AppMode.WRITE} 
          onClick={() => setActiveTab(AppMode.WRITE)} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>}
          label="Write"
        />
      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full py-1.5 rounded-lg transition-colors ${
        active ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div className={`mb-0.5 ${active ? 'scale-110 transform' : ''} transition-transform`}>
        {icon}
      </div>
      <span className="text-[9px] font-medium tracking-wide">{label}</span>
    </button>
  );
};

export default App;
