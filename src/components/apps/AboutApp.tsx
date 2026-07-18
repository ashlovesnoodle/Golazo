import React from 'react';
import { profile, socialLinks } from '../../data/portfolioData';
import { ExternalLink, Mail, MapPin, Link2, User } from 'lucide-react';

const socialIcons: Record<string, React.ReactElement> = {
  instagram: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

// Apple-style row component
const SettingsRow = ({ 
  icon, 
  iconBg, 
  label, 
  value, 
  href,
  onClick,
  external = false,
  children 
}: { 
  icon: React.ReactNode; 
  iconBg: string;
  label: string; 
  value?: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  children?: React.ReactNode;
}) => {
  const content = (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-white font-normal">{label}</p>
        {value && <p className="text-[12px] text-white/40 truncate">{value}</p>}
        {children}
      </div>
      {external && <ExternalLink size={14} className="text-white/30 flex-shrink-0" />}
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block px-3 hover:bg-white/5 transition-colors cursor-pointer"
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className="w-full text-left block px-3 hover:bg-white/5 transition-colors cursor-pointer"
      >
        {content}
      </button>
    );
  }

  return <div className="px-3">{content}</div>;
};

// Apple-style section
const SettingsSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="mb-4">
    {title && (
      <h3 className="text-[11px] font-medium text-white/50 uppercase tracking-wide px-4 mb-1">
        {title}
      </h3>
    )}
    <div className="bg-[#1c1c1e]/80 backdrop-blur-xl rounded-xl overflow-hidden border border-white/5">
      {children}
    </div>
  </div>
);

// Apple-style button row
const SocialButton = ({ 
  platform, 
  url, 
  icon, 
  colorClass 
}: { 
  platform: string; 
  url: string; 
  icon: string;
  colorClass: string;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
  >
    <div className={`w-6 h-6 rounded-md ${colorClass} flex items-center justify-center`}>
      {socialIcons[icon] || <Link2 size={14} />}
    </div>
    <span className="text-[13px] text-white/80 font-medium group-hover:text-white">{platform}</span>
  </a>
);

export default function AboutApp() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#000000]">
      {/* macOS-style header with avatar */}
      <div className="flex flex-col items-center pt-10 pb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl mb-4">
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <h1 className="text-xl font-semibold text-white tracking-tight">{profile.name}</h1>
        <p className="text-sm text-white/50 mt-0.5">{profile.title}</p>
      </div>

      {/* Content - Apple Settings style */}
      <div className="px-4 pb-6">
        {/* Personal Info Section */}
        <SettingsSection>
          <SettingsRow
            icon={<User size={16} className="text-white" />}
            iconBg="bg-gray-500"
            label="Full Name"
            value={profile.name}
          />
          <div className="h-px bg-white/10 mx-3" />
          <SettingsRow
            icon={<Mail size={16} className="text-white" />}
            iconBg="bg-blue-500"
            label="Email"
            value={profile.email}
            href={`mailto:${profile.email}`}
          />
          <div className="h-px bg-white/10 mx-3" />
          <SettingsRow
            icon={<MapPin size={16} className="text-white" />}
            iconBg="bg-green-500"
            label="Location"
            value="Available Worldwide"
          />
        </SettingsSection>

        {/* Bio Section */}
        <SettingsSection title="About">
          <div className="px-4 py-3">
            <p className="text-[13px] text-white/80 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </SettingsSection>

        {/* Social Links Section */}
        <SettingsSection title="Social">
          <div className="p-2">
            {socialLinks.map((link, index) => (
              <React.Fragment key={link.platform}>
                <SocialButton
                  platform={link.platform}
                  url={link.url}
                  icon={link.icon}
                  colorClass={
                    link.icon === 'instagram' 
                      ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400'
                      : link.icon === 'linkedin'
                      ? 'bg-blue-600'
                      : link.icon === 'twitter'
                      ? 'bg-sky-500'
                      : 'bg-gray-600'
                  }
                />
                {index < socialLinks.length - 1 && (
                  <div className="h-px bg-white/10 mx-3" />
                )}
              </React.Fragment>
            ))}
          </div>
        </SettingsSection>

        {/* Skills Section */}
        <SettingsSection title="Skills">
          <div className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {['Visual Design', 'Brand Identity', 'Typography', 'Motion Graphics', 'Photography', 'UI/UX', 'Illustration', 'Print Design'].map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md bg-white/10 text-white/70 text-[11px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
