// ============================================================
// PORTFOLIO DATA — Edit this file to update your portfolio
// ============================================================

export interface DesktopItem {
  id: string;
  title: string;
  image: string; // URL or path to image/video
  category: 'images' | 'videos' | 'blog' | 'photographs';
  description?: string;
  link?: string;
  thumbnail?: string; // Optional thumbnail for videos
  seekToTime?: number; // optional: seek to this time (in seconds) for thumbnail
  x: number; // percentage from left
  y: number; // percentage from top
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category?: string;
}

// ============================================================
// YOUR PROFILE — Edit these fields
// ============================================================
export const profile = {
  name: 'Aishwary Pratap Singh Chauhan',
  title: 'Creative Designer & Developer',
  bio: 'Hey People, Im a dumb little amibitious guy who wants to do all the cool stuff.',
  avatar: '/avatar.png',
  backgroundImage: '/bg.png',
  email: 'apsinghftp13@gmail.com',
};

// ============================================================
// SOCIAL LINKS — Edit URLs to point to your profiles
// ============================================================
export const socialLinks: SocialLink[] = [
  {
    platform: 'Instagram',
    url: 'https://instagram.com/ashlovesnoodle',
    icon: 'instagram',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/ashlovesnoodle',
    icon: 'linkedin',
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/ashlovesnoodle',
    icon: 'twitter',
  },
];

// ============================================================
// DESKTOP ITEMS — Manually add items to show on desktop
// Add items here to appear as desktop icons
// Categories: images, videos, blog, photographs
// ============================================================
export const desktopItems: DesktopItem[] = [
  {
    id: '1',
    title: 'Boredom',
    image: '/images/Boredom.png',
    category: 'images',
    description: 'Uploaded artwork',
    x: 20,
    y: 20,
  },
  {
    id: '2',
    title: 'Veni Vedi Vici',
    image: '/images/Veni Vedi Vici.png',
    category: 'images',
    description: 'Uploaded artwork',
    x: 40,
    y: 20,
  },
  {
    id: '3',
    title: 'Creative License',
    image: '/images/Creative License.png',
    category: 'images',
    description: 'Uploaded artwork',
    x: 60,
    y: 20,
  },
 
  {
    id: '6',
    title: 'War',
    image: '/images/War.png',
    category: 'images',
    description: 'Uploaded image',
    x: 60,
    y: 50,
  },
  {
    id: '7',
    title: 'Pug Rescue',
    image: '/photographs/Pug Rescue.jpg',
    category: 'photographs',
    description: 'Uploaded photo',
    x: 80,
    y: 50,
  },
  {
    id: '8',
    title: 'Damn',
    image: '/photographs/Damn.png',
    category: 'photographs',
    description: 'Uploaded photo',
    x: 20,
    y: 70,
  },
  {
    id: '9',
    title: 'Crawzy',
    image: '/photographs/Crawzy.png',
    category: 'photographs',
    description: 'Uploaded photo',
    x: 40,
    y: 70,
  },
  {
    id: '10',
    title: 'Constantia',
    image: '/photographs/Constantia.png',
    category: 'photographs',
    description: 'Uploaded photo',
    x: 60,
    y: 70,
  },
  {
    id: '11',
    title: 'Skyisdink',
    image: '/photographs/Skyisdink.jpg',
    category: 'photographs',
    description: 'Uploaded photo',
    x: 80,
    y: 70,
  },

   {
    id: '12',
    title: 'What?',
    image: '/images/What.png',
    category: 'images',
    description: 'Uploaded image',
    x: 80,
    y: 70,
  },

   {
    id: '13',
    title: 'Red Dead Redemption 2',
    image: '/images/Red Dead Redemption 2.png',
    category: 'images',
    description: 'Uploaded image',
    x: 80,
    y: 70,
  },

 {
    id: '14',
    title: 'Minecraft Inspiration',
    image: '/images/Minecraft Inspiration.png',
    category: 'images',
    description: 'Uploaded image',
    x: 80,
    y: 70,
  },
   {
    id: '15',
    title: 'Ash',
    image: '/images/Ash.png',
    category: 'images',
    description: 'Uploaded image',
    x: 80,
    y: 70,
  },

   {
    id: '16',
    title: 'JoeyLisa',
    image: '/images/JoeyLisa.png',
    category: 'images',
    description: 'Uploaded image',
    x: 80,
    y: 70,
  },

   {
    id: '17',
    title: 'Bye',
    image: '/images/Bye.png',
    category: 'images',
    description: 'Uploaded image',
    x: 80,
    y: 70,
  },
  {
    id: '18',
    title: 'combined effort',
    image: '/videos/Combined Effort.mp4',
    category: 'videos',
    description: 'Uploaded video',
    x: 50,
    y: 50,
  },
  {
    id: '19',
    title: 'Batman',
    image: '/videos/Batman.mp4',
    category: 'videos',
    description: 'Uploaded video',
    x: 20,
    y: 50,
    seekToTime: 32,
  },
  {
    id: '20',
    title: 'Random',
    image: '/images/Random.png',
    category: 'images',
    description: 'Random artwork',
    x: 10,
    y: 30,
  },
  {
    id: '21',
    title: 'Leo',
    image: '/images/Leo.png',
    category: 'images',
    description: 'Leo artwork',
    x: 30,
    y: 30,
  },
  {
    id: '22',
    title: 'Vagabond',
    image: '/images/Vagabond.png',
    category: 'images',
    description: 'Uploaded artwork',
    x: 20,
    y: 90,
  },
  {
    id: '23',
    title: 'Ayo',
    image: '/photographs/Ayo.jpeg',
    category: 'photographs',
    description: 'Uploaded photo',
    x: 40,
    y: 90,
  },
];

// ============================================================
// BLOG POSTS — Add/edit blog posts shown in Notes app
// To add a new blog post, copy the template below into the array:
//
// {
//   id: '1',
//   title: 'Your Post Title',
//   date: '2024-12-25',
//   excerpt: 'Short summary of your post.',
//   content: `Your post content here. Use backticks for multi-line text.
//
// You can use **bold** and *italic* formatting.
// New paragraphs need double line breaks.`,
//   coverImage: '/your-image.jpg',  // or use a URL
// },
// ============================================================
export const blogPosts: BlogPost[] = [

    {
      id: '1',
      title: 'A place that feels mine!',
      date: '2026-5-10',
      excerpt: 'Might be a good place to finally let my website chill for a while',
      content: `This will prolly be a place where I share my thoughts and experiences. 
      I will prolly write here pretty often so If you wanna read shit, You're welcome.`,
      coverImage: '/imgbbg.png',
    },
];

// ============================================================
// GALLERY IMAGES — Auto-populated from public folders
// Place images in these folders:
//   - public/images/      → shows as 'Images' category
//   - public/photographs/ → shows as 'Photographs' category
// Then run: npm run scan-media
// ============================================================
export const galleryImages: GalleryImage[] = [
  {
    "id": "1",
    "url": "/images/Abyuthanam.png",
    "caption": "Abyuthanam",
    "category": "Images"
  },
  {
    "id": "2",
    "url": "/images/Ash.png",
    "caption": "Ash",
    "category": "Images"
  },
  {
    "id": "3",
    "url": "/images/BitsnBytes.png",
    "caption": "BitsnBytes",
    "category": "Images"
  },
  {
    "id": "4",
    "url": "/images/Boredom.png",
    "caption": "Boredom",
    "category": "Images"
  },
  {
    "id": "5",
    "url": "/images/Bye.png",
    "caption": "Bye",
    "category": "Images"
  },
  {
    "id": "6",
    "url": "/images/Corny.png",
    "caption": "Corny",
    "category": "Images"
  },
  {
    "id": "7",
    "url": "/images/Creative License.png",
    "caption": "Creative License",
    "category": "Images"
  },
  {
    "id": "8",
    "url": "/images/design-01.png",
    "caption": "Design 01",
    "category": "Images"
  },
  {
    "id": "9",
    "url": "/images/design-03.png",
    "caption": "Design 03",
    "category": "Images"
  },
  {
    "id": "10",
    "url": "/images/design-04.png",
    "caption": "Design 04",
    "category": "Images"
  },
  {
    "id": "11",
    "url": "/images/design-05.png",
    "caption": "Design 05",
    "category": "Images"
  },
  {
    "id": "12",
    "url": "/images/Extra Corny.png",
    "caption": "Extra Corny",
    "category": "Images"
  },
  {
    "id": "13",
    "url": "/images/JoeyLisa.png",
    "caption": "JoeyLisa",
    "category": "Images"
  },
  {
    "id": "14",
    "url": "/images/Leo.png",
    "caption": "Leo",
    "category": "Images"
  },
  {
    "id": "15",
    "url": "/images/Minecraft Inspiration.png",
    "caption": "Minecraft Inspiration",
    "category": "Images"
  },
  {
    "id": "16",
    "url": "/images/Photo (1).jpeg",
    "caption": "Photo (1)",
    "category": "Images"
  },
  {
    "id": "17",
    "url": "/images/Photo (2).jpeg",
    "caption": "Photo (2)",
    "category": "Images"
  },
  {
    "id": "18",
    "url": "/images/Random.png",
    "caption": "Random",
    "category": "Images"
  },
  {
    "id": "19",
    "url": "/images/Red Dead Redemption 2.png",
    "caption": "Red Dead Redemption 2",
    "category": "Images"
  },
  {
    "id": "20",
    "url": "/images/Vagabond.png",
    "caption": "Vagabond",
    "category": "Images"
  },
  {
    "id": "21",
    "url": "/images/Veni Vedi Vici.png",
    "caption": "Veni Vedi Vici",
    "category": "Images"
  },
  {
    "id": "22",
    "url": "/images/War.png",
    "caption": "War",
    "category": "Images"
  },
  {
    "id": "23",
    "url": "/images/What.png",
    "caption": "What",
    "category": "Images"
  },
  {
    "id": "24",
    "url": "/photographs/Ayo.jpeg",
    "caption": "Ayo",
    "category": "Photographs"
  },
  {
    "id": "25",
    "url": "/photographs/Constantia.png",
    "caption": "Constantia",
    "category": "Photographs"
  },
  {
    "id": "26",
    "url": "/photographs/Crawzy.png",
    "caption": "Crawzy",
    "category": "Photographs"
  },
  {
    "id": "27",
    "url": "/photographs/Damn.png",
    "caption": "Damn",
    "category": "Photographs"
  },
  {
    "id": "28",
    "url": "/photographs/Dilkusha.png",
    "caption": "Dilkusha",
    "category": "Photographs"
  },
  {
    "id": "29",
    "url": "/photographs/Photo (1).jpeg",
    "caption": "Photo (1)",
    "category": "Photographs"
  },
  {
    "id": "30",
    "url": "/photographs/Photo (2).jpeg",
    "caption": "Photo (2)",
    "category": "Photographs"
  },
  {
    "id": "31",
    "url": "/photographs/Photographs (1).png",
    "caption": "Photographs (1)",
    "category": "Photographs"
  },
  {
    "id": "32",
    "url": "/photographs/Photographs (2).jpg",
    "caption": "Photographs (2)",
    "category": "Photographs"
  },
  {
    "id": "33",
    "url": "/photographs/Photographs (5).png",
    "caption": "Photographs (5)",
    "category": "Photographs"
  },
  {
    "id": "34",
    "url": "/photographs/Photographs (7).png",
    "caption": "Photographs (7)",
    "category": "Photographs"
  },
  {
    "id": "35",
    "url": "/photographs/Pug Rescue.jpg",
    "caption": "Pug Rescue",
    "category": "Photographs"
  },
  {
    "id": "36",
    "url": "/photographs/Skyisdink.jpg",
    "caption": "Skyisdink",
    "category": "Photographs"
  },
  {
    "id": "1000",
    "url": "/videos/Combined Effort.mp4",
    "caption": "combined effort",
    "category": "Images"
  },
  {
    "id": "1001",
    "url": "/videos/Batman.mp4",
    "caption": "Batman",
    "category": "Images"
  }
];
