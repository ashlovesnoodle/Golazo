import { useState } from 'react';
import { profile } from '../../data/portfolioData';
import { Send, Inbox, Star, Trash2, Edit, Search } from 'lucide-react';

const mockEmails = [
  {
    id: '1',
    from: 'client@studio.com',
    subject: 'Design Project Inquiry',
    preview: 'Hi, I love your portfolio and would like to discuss a potential collaboration...',
    time: '10:30 AM',
    read: false,
    starred: true,
  },
  {
    id: '2',
    from: 'gallery@artspace.com',
    subject: 'Exhibition Invitation',
    preview: 'We would like to invite you to showcase your work at our upcoming exhibition...',
    time: 'Yesterday',
    read: true,
    starred: false,
  },
  {
    id: '3',
    from: 'brand@agency.com',
    subject: 'Brand Identity Project',
    preview: 'Following up on our conversation about the brand identity project...',
    time: 'Mon',
    read: true,
    starred: false,
  },
];

const sidebarItems = [
  { icon: <Inbox size={14} />, label: 'Inbox', count: 1 },
  { icon: <Star size={14} />, label: 'Starred', count: 1 },
  { icon: <Send size={14} />, label: 'Sent' },
  { icon: <Trash2 size={14} />, label: 'Trash' },
];

export default function MailApp() {
  const [selectedEmail, setSelectedEmail] = useState(mockEmails[0]);
  const [isComposing, setIsComposing] = useState(false);
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' });
  const [selectedSidebar, setSelectedSidebar] = useState('Inbox');

  const handleSend = () => {
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(compose.subject)}&body=${encodeURIComponent(compose.body)}`;
    setIsComposing(false);
    setCompose({ to: '', subject: '', body: '' });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Sidebar - Hidden on mobile, shown as drawer when needed */}
      <div className="hidden lg:flex w-44 flex-shrink-0 flex-col border-r border-white/5 bg-[#252527] py-2">
        <div className="px-3 mb-2">
          <button
            onClick={() => setIsComposing(true)}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium transition-colors"
          >
            <Edit size={12} />
            Compose
          </button>
        </div>
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setSelectedSidebar(item.label)}
            className={`flex items-center gap-2.5 px-4 py-1.5 text-sm transition-colors ${
              selectedSidebar === item.label
                ? 'bg-blue-500/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.count && (
              <span className="text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile sidebar toggle and compose button */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b border-white/5 bg-[#252527]">
        <button
          onClick={() => setSelectedSidebar(selectedSidebar === 'menu' ? 'Inbox' : 'menu')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>
        <button
          onClick={() => setIsComposing(true)}
          className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium transition-colors"
        >
          <Edit size={12} />
          Compose
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      {selectedSidebar === 'menu' && (
        <div className="lg:hidden absolute inset-0 z-50 bg-black/50" onClick={() => setSelectedSidebar('Inbox')}>
          <div className="w-64 h-full bg-[#252527] border-r border-white/5 py-2" onClick={(e) => e.stopPropagation()}>
            <div className="px-3 mb-2">
              <button
                onClick={() => {
                  setIsComposing(true);
                  setSelectedSidebar('Inbox');
                }}
                className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium transition-colors"
              >
                <Edit size={12} />
                Compose
              </button>
            </div>
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setSelectedSidebar(item.label)}
                className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-sm transition-colors ${
                  selectedSidebar === item.label
                    ? 'bg-blue-500/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <span className="text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Email list */}
      <div className="w-full lg:w-64 flex-shrink-0 flex flex-col border-r border-white/5 bg-[#2c2c2e] lg:border-r">
        <div className="p-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2.5 py-1.5">
            <Search size={11} className="text-white/40" />
            <input
              placeholder="Search Mail"
              className="bg-transparent text-white/80 text-xs outline-none flex-1 placeholder-white/30"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockEmails.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors ${
                selectedEmail.id === email.id ? 'bg-blue-500/15' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {!email.read && <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                  <p className={`text-sm truncate ${!email.read ? 'font-semibold text-white' : 'text-white/70'}`}>
                    {email.from}
                  </p>
                </div>
                <p className="text-[10px] text-white/30 flex-shrink-0 ml-2">{email.time}</p>
              </div>
              <p className="text-xs text-white/70 font-medium truncate">{email.subject}</p>
              <p className="text-xs text-white/40 truncate mt-0.5">{email.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Email content */}
      <div className="flex-1 overflow-y-auto bg-[#1c1c1e] min-h-0">
        {isComposing ? (
          <div className="flex flex-col h-full p-4 lg:p-6 gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">New Message</h2>
              <button
                onClick={() => setIsComposing(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-sm w-12">To:</span>
                  <input
                    value={compose.to}
                    onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                    placeholder={profile.email}
                    className="flex-1 bg-transparent text-white/80 text-sm outline-none placeholder-white/20"
                  />
                </div>
              </div>
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-sm w-12">Subject:</span>
                  <input
                    value={compose.subject}
                    onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                    placeholder="Subject"
                    className="flex-1 bg-transparent text-white/80 text-sm outline-none placeholder-white/20"
                  />
                </div>
              </div>
              <textarea
                value={compose.body}
                onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                placeholder="Write your message..."
                className="flex-1 bg-transparent text-white/70 text-sm outline-none resize-none placeholder-white/20 leading-relaxed"
              />
              <button
                onClick={handleSend}
                className="self-end flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-colors"
              >
                <Send size={13} />
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-white mb-2">{selectedEmail.subject}</h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {selectedEmail.from[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{selectedEmail.from}</p>
                <p className="text-xs text-white/40">To: {profile.email} · {selectedEmail.time}</p>
              </div>
            </div>
            <div className="text-sm text-white/70 leading-relaxed">
              <p>{selectedEmail.preview}</p>
              <p className="mt-4">
                I've been following your work for a while and I'm impressed by the quality and creativity. 
                Would love to set up a call to discuss details.
              </p>
              <p className="mt-4">Best regards,<br />The Team</p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsComposing(true);
                  setCompose({ to: selectedEmail.from, subject: `Re: ${selectedEmail.subject}`, body: '' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
