import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Share2, Search, X, Plus, Pin } from 'lucide-react';
import { sanitizeAsset } from '../../utils/asset';

interface Tab {
  id: string;
  title: string;
  url: string;
  pinned: boolean;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
}

export default function SafariApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'portfolio-tab',
      title: 'Portfolio',
      url: 'https://olio-swart.vercel.app/',
      pinned: true,
      history: ['https://olio-swart.vercel.app/'],
      historyIndex: 0,
      isLoading: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('portfolio-tab');
  const [displayUrl, setDisplayUrl] = useState('https://olio-swart.vercel.app/');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const nextTabId = useRef(1);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    setDisplayUrl(sanitizeAsset(activeTab.url));
  }, [activeTab.id, activeTab.url]);

  const updateTab = (tabId: string, updates: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, ...updates } : t))
    );
  };

  const handleNavigate = (newUrl: string, tabId?: string) => {
    const targetTabId = tabId || activeTabId;
    let finalUrl = newUrl;

    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const tab = tabs.find((t) => t.id === targetTabId);
    if (!tab) return;

    const newHistory = tab.history.slice(0, tab.historyIndex + 1);
    newHistory.push(finalUrl);

    const title = new URL(finalUrl).hostname || 'New Tab';

    updateTab(targetTabId, {
      url: finalUrl,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      title: title,
      isLoading: true,
    });

    setTimeout(() => {
      updateTab(targetTabId, { isLoading: false });
    }, 800);
  };

  const goBack = (tabId?: string) => {
    const targetTabId = tabId || activeTabId;
    const tab = tabs.find((t) => t.id === targetTabId);
    if (!tab || tab.historyIndex <= 0) return;

    const newIndex = tab.historyIndex - 1;
    updateTab(targetTabId, {
      url: tab.history[newIndex],
      historyIndex: newIndex,
    });
  };

  const goForward = (tabId?: string) => {
    const targetTabId = tabId || activeTabId;
    const tab = tabs.find((t) => t.id === targetTabId);
    if (!tab || tab.historyIndex >= tab.history.length - 1) return;

    const newIndex = tab.historyIndex + 1;
    updateTab(targetTabId, {
      url: tab.history[newIndex],
      historyIndex: newIndex,
    });
  };

  const handleRefresh = () => {
    updateTab(activeTabId, { isLoading: true });
    setTimeout(() => {
      updateTab(activeTabId, { isLoading: false });
    }, 800);
  };

  const openNewTab = (url?: string) => {
    const newTabId = `tab-${nextTabId.current++}`;
    const finalUrl = url || 'https://www.google.com';

    const newTab: Tab = {
      id: newTabId,
      title: new URL(finalUrl).hostname || 'New Tab',
      url: finalUrl,
      pinned: false,
      history: [finalUrl],
      historyIndex: 0,
      isLoading: false,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;

    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(displayUrl);
  };

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Compact Safari toolbar */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto max-w-[34%] min-w-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer transition-colors min-h-7 ${
                activeTabId === tab.id
                  ? 'bg-white border border-gray-300 shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.pinned && (
                <Pin size={11} className="text-blue-500 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-700 truncate max-w-[7rem]">
                {tab.title}
              </span>
              {tab.isLoading && (
                <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex-shrink-0" />
              )}
              {!tab.pinned && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="w-3.5 h-3.5 rounded flex items-center justify-center hover:bg-gray-300 flex-shrink-0"
                >
                  <X size={10} className="text-gray-600" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => openNewTab()}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <Plus size={14} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => goBack()}
            disabled={!canGoBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-700" />
          </button>

          <button
            onClick={() => goForward()}
            disabled={!canGoForward}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} className="text-gray-700" />
          </button>

          <button
            onClick={handleRefresh}
            className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors ${
              activeTab.isLoading ? 'animate-spin' : ''
            }`}
          >
            <RotateCcw size={18} className="text-gray-700" />
          </button>

          <form onSubmit={handleUrlSubmit} className="flex-1 min-w-0">
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-300 focus-within:border-blue-500 transition-colors">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                value={displayUrl}
                onChange={(e) => setDisplayUrl(e.target.value)}
                placeholder="Search or enter website name"
                className="flex-1 min-w-0 outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
          </form>

          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Share2 size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          key={`${activeTabId}-${activeTab.url}`}
          src={sanitizeAsset(activeTab.url)}
          className="w-full h-full border-none"
          title={`Safari - ${activeTab.title}`}
          onLoad={() => {
            updateTab(activeTabId, { isLoading: false });
          }}
        />
      </div>
    </div>
  );
}
