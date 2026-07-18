import { motion } from 'framer-motion';
import { ExternalLink, Heart, MessageCircle, Share2, Users, Grid } from 'lucide-react';
import { galleryImages, profile } from '../../data/portfolioData';
import { sanitizeAsset } from '../../utils/asset';

interface SocialAppProps {
  platform: 'instagram' | 'twitter' | 'linkedin';
  url: string;
}

const mockPosts = {
  instagram: galleryImages.slice(0, 9).map((img) => ({
    id: img.id,
    image: img.url,
    likes: Math.floor(Math.random() * 900) + 100,
    comments: Math.floor(Math.random() * 50) + 5,
    caption: img.caption || 'Portfolio work',
  })),
};

export default function SocialApp({ platform, url }: SocialAppProps) {
  const handleOpen = () => window.open(url, '_blank');

  if (platform === 'instagram') {
    return (
      <div className="flex flex-col h-full bg-[#1c1c1e]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-white">{profile.name.replace(' ', '_').toLowerCase()}</h2>
            <p className="text-xs text-white/40">{profile.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-sm font-bold text-white">248</p>
              <p className="text-xs text-white/40">posts</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">12.4K</p>
              <p className="text-xs text-white/40">followers</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">384</p>
              <p className="text-xs text-white/40">following</p>
            </div>
          </div>
          <button
            onClick={handleOpen}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ExternalLink size={13} />
            Follow
          </button>
        </div>

        {/* Bio */}
        <div className="px-6 py-3 border-b border-white/5">
          <p className="text-sm text-white/70">{profile.bio}</p>
          <a href={url} onClick={(e) => { e.preventDefault(); handleOpen(); }} className="text-xs text-blue-400 mt-1 block hover:text-blue-300">
            {url}
          </a>
        </div>

        {/* Grid tabs */}
        <div className="flex border-b border-white/5">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-white border-b-2 border-white">
            <Grid size={13} />
            Grid
          </button>
        </div>

        {/* Photo grid */}
        <div className="flex-1 overflow-y-auto p-1">
          <div className="grid grid-cols-3 gap-0.5">
            {mockPosts.instagram.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative aspect-square cursor-pointer group overflow-hidden"
                onClick={handleOpen}
              >
                <img
                  src={sanitizeAsset(post.image)}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-1 text-white text-xs font-semibold">
                    <Heart size={14} fill="white" />
                    {post.likes}
                  </div>
                  <div className="flex items-center gap-1 text-white text-xs font-semibold">
                    <MessageCircle size={14} fill="white" />
                    {post.comments}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Open button */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleOpen}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ExternalLink size={14} />
            Open Instagram
          </button>
        </div>
      </div>
    );
  }

  if (platform === 'linkedin') {
    return (
      <div className="flex flex-col h-full bg-[#1c1c1e] overflow-y-auto">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative flex-shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-xl border-4 border-[#1c1c1e] overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{profile.name[0]}</span>
            </div>
          </div>
        </div>
        <div className="pt-12 px-6 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{profile.name}</h2>
              <p className="text-sm text-white/60">{profile.title}</p>
              <p className="text-xs text-white/40 mt-1">500+ connections</p>
            </div>
            <button
              onClick={handleOpen}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-400 transition-colors"
            >
              <Users size={13} />
              Connect
            </button>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-2">About</h3>
            <p className="text-sm text-white/60 leading-relaxed">{profile.bio}</p>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-3">Experience</h3>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-xs font-bold">C</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{profile.title}</p>
                <p className="text-xs text-white/40">Freelance · 2020 – Present</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpen}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <ExternalLink size={14} />
            View LinkedIn Profile
          </button>
        </div>
      </div>
    );
  }

  if (platform === 'twitter') {
    const mockTweets = [
      { id: 1, text: `Just finished a new design project! Really happy with how the visual identity came together. 🎨 #Design #Branding`, likes: 142, retweets: 28, time: '2h' },
      { id: 2, text: `The best stage visuals are the ones you feel, not just see. Working on something special for an upcoming show. 🎭`, likes: 89, retweets: 15, time: '1d' },
      { id: 3, text: `Typography is 90% of design. Change my mind. #Design #Typography`, likes: 312, retweets: 67, time: '3d' },
    ];

    return (
      <div className="flex flex-col h-full bg-[#1c1c1e] overflow-y-auto">
        {/* Header */}
        <div className="h-28 bg-gradient-to-r from-sky-600 to-blue-700 flex-shrink-0" />
        <div className="px-6 pb-4 -mt-8">
          <div className="flex items-end justify-between mb-3">
            <div className="w-14 h-14 rounded-full border-4 border-[#1c1c1e] bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{profile.name[0]}</span>
            </div>
            <button
              onClick={handleOpen}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Follow
            </button>
          </div>
          <h2 className="text-lg font-bold text-white">{profile.name}</h2>
          <p className="text-sm text-white/40">@{profile.name.toLowerCase().replace(' ', '_')}</p>
          <p className="text-sm text-white/70 mt-2">{profile.bio}</p>
          <div className="flex gap-4 mt-3 text-xs text-white/40">
            <span><strong className="text-white">842</strong> Following</span>
            <span><strong className="text-white">5.2K</strong> Followers</span>
          </div>
        </div>

        {/* Tweets */}
        <div className="border-t border-white/5">
          {mockTweets.map((tweet) => (
            <div key={tweet.id} className="px-6 py-4 border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer" onClick={handleOpen}>
              <p className="text-sm text-white/80 leading-relaxed">{tweet.text}</p>
              <div className="flex items-center gap-6 mt-3 text-white/30">
                <div className="flex items-center gap-1.5 text-xs hover:text-pink-400 transition-colors">
                  <Heart size={13} />
                  {tweet.likes}
                </div>
                <div className="flex items-center gap-1.5 text-xs hover:text-green-400 transition-colors">
                  <Share2 size={13} />
                  {tweet.retweets}
                </div>
                <span className="text-xs ml-auto">{tweet.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <button
            onClick={handleOpen}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-colors"
          >
            <ExternalLink size={14} />
            Open Twitter / X
          </button>
        </div>
      </div>
    );
  }

  return null;
}
