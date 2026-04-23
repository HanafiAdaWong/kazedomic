const BASE_URL = 'https://www.sankavollerei.com/comic';

// Genre slug-to-value mapping for filtering
const GENRE_MAP = {
  'action': '15', 'adventure': '16', 'comedy': '2', 'doujinshi': '6305',
  'drama': '20', 'ecchi': '28', 'fantasy': '3', 'gender-bender': '443',
  'harem': '29', 'historical': '26', 'horror': '8', 'isekai': '1582',
  'josei': '1331', 'martial-arts': '17', 'mature': '369', 'mecha': '1235',
  'mystery': '10', 'oneshot': '2142', 'psychological': '11', 'romance': '18',
  'school-life': '12', 'sci-fi': '65', 'seinen': '5', 'shoujo': '25',
  'shoujo-ai': '1316', 'shounen': '13', 'shounen-ai': '1504',
  'slice-of-life': '21', 'sports': '233', 'supernatural': '4',
  'tragedy': '19', 'yaoi': '10872', 'yuri': '1320'
};

const proxyImage = (url) => {
  if (!url) return '';
  // Don't proxy data URIs or placeholder URLs
  if (url.startsWith('data:')) return '';
  // komikstation.org images load directly — no proxy needed
  if (url.includes('komikstation.org')) return url;
  // For other URLs (e.g., thumbnail.komiku.org), use Photon proxy
  if (url.startsWith('http')) {
    return `https://i0.wp.com/${url.replace(/^https?:\/\//, '')}`;
  }
  return url;
};

const SAMPLE_MANGA = [
  {
    slug: 'it-all-starts-with-trillions-of-nether-currency',
    title: 'It All Starts With Trillions Of Nether Currency',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/it-all-starts-with-trillions-of-nether-currency/manga_thumbnail-A2-It-All-Starts-With-Trillions-Of-Nether-Currency.png?w=500'),
    latest_chapter: '226',
    rating: '9.8',
    type: 'Manhua'
  },
  {
    slug: 'martial-peak',
    title: 'Martial Peak',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/martial-peak/manga_thumbnail.png?w=500'),
    latest_chapter: '3650',
    rating: '9.5',
    type: 'Manhua'
  },
  {
    slug: 'solo-leveling',
    title: 'Solo Leveling',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/solo-leveling/manga_thumbnail.png?w=500'),
    latest_chapter: '179',
    rating: '9.9',
    type: 'Manhwa'
  },
  {
    slug: 'one-piece',
    title: 'One Piece',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/one-piece/manga_thumbnail.png?w=500'),
    latest_chapter: '1112',
    rating: '9.7',
    type: 'Manga'
  },
  {
    slug: 'magic-emperor',
    title: 'Magic Emperor',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/magic-emperor/manga_thumbnail.png?w=500'),
    latest_chapter: '450',
    rating: '9.4',
    type: 'Manhua'
  },
  {
    slug: 'the-beginning-after-the-end',
    title: 'The Beginning After The End',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/the-beginning-after-the-end/manga_thumbnail.png?w=500'),
    latest_chapter: '175',
    rating: '9.8',
    type: 'Manhwa'
  },
  {
    slug: 'apotheosis',
    title: 'Apotheosis',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/apotheosis/manga_thumbnail.png?w=500'),
    latest_chapter: '1100',
    rating: '9.3',
    type: 'Manhua'
  },
  {
    slug: 'tales-of-demons-and-gods',
    title: 'Tales of Demons and Gods',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/tales-of-demons-and-gods/manga_thumbnail.png?w=500'),
    latest_chapter: '450',
    rating: '9.6',
    type: 'Manhua'
  },
  {
    slug: 'nanomachine',
    title: 'Nano Machine',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/nanomachine/manga_thumbnail.png?w=500'),
    latest_chapter: '180',
    rating: '9.7',
    type: 'Manhwa'
  },
  {
    slug: 'tower-of-god',
    title: 'Tower of God',
    image: proxyImage('https://thumbnail.komiku.org/uploads/manga/tower-of-god/manga_thumbnail.png?w=500'),
    latest_chapter: '580',
    rating: '9.5',
    type: 'Manhwa'
  }
];

const comicMap = new Map();
let isInitializing = false;

const initCatalog = async () => {
  if (isInitializing || comicMap.size > 0) return;
  isInitializing = true;
  try {
    const response = await fetch(`${BASE_URL}/unlimited`);
    if (response.ok) {
      const data = await response.json();
      (data.comics || []).forEach(c => {
        comicMap.set(c.title.toLowerCase(), c.image);
      });
    }
  } catch (e) {
    console.warn("Catalog init failed", e);
  } finally {
    isInitializing = false;
  }
};

export { GENRE_MAP };

export const api = {
  getHome: async () => {
    // Start initializing catalog in background if not already
    initCatalog();
    
    try {
      const response = await fetch(`${BASE_URL}/komikstation/home`);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      
      const fixManga = (m) => {
        let finalImage = m.imageSrc;
        
        // If placeholder, try to lookup in catalog
        if (!finalImage || finalImage.startsWith('data:image')) {
          const cached = comicMap.get(m.title.toLowerCase());
          if (cached) {
            finalImage = cached;
          } else {
            // Last resort: Predictable pattern
            finalImage = `https://thumbnail.komiku.org/uploads/manga/${m.slug}/manga_thumbnail.png?w=500`;
          }
        }

        return {
          ...m,
          image: proxyImage(finalImage),
          latest_chapter: m.latestChapter || (m.chapters ? m.chapters[0]?.title : 'Latest')
        };
      };

      return { 
        trending: (data.trending || []).map(fixManga),
        latest: (data.latestUpdates || []).map(fixManga),
        popular: (data.trending || []).slice(0, 5).map(fixManga)
      };
    } catch (error) {
      console.warn('API Blocked or Error - using sample data');
      return { 
        latest: SAMPLE_MANGA, 
        trending: [...SAMPLE_MANGA].reverse(), 
        popular: SAMPLE_MANGA.slice(0, 5) 
      };
    }
  },

  getLatest: async () => {
    try {
      const response = await fetch(`${BASE_URL}/terbaru`);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data.latest || SAMPLE_MANGA);
      return list.map(m => ({ ...m, image: proxyImage(m.image) }));
    } catch (error) {
      return SAMPLE_MANGA;
    }
  },

  search: async (query) => {
    try {
      const response = await fetch(`${BASE_URL}/komikstation/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      
      const fixManga = (m) => {
        let finalImage = m.image;
        if (!finalImage || finalImage.startsWith('data:image')) {
          const cached = comicMap.get(m.title.toLowerCase());
          if (cached) finalImage = cached;
          else finalImage = `https://thumbnail.komiku.org/uploads/manga/${m.slug}/manga_thumbnail.png?w=500`;
        }
        return {
          ...m,
          image: proxyImage(finalImage),
          latest_chapter: m.latestChapter || 'Chapter ?'
        };
      };

      return (data.seriesList || []).map(fixManga);
    } catch (error) {
       return SAMPLE_MANGA.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
    }
  },

  getComicDetail: async (slug) => {
    try {
      const response = await fetch(`${BASE_URL}/komikstation/manga/${slug}`);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      
      let coverImage = data.imageSrc || data.image;
      if (!coverImage || coverImage.startsWith('data:image')) {
        const cached = comicMap.get((data.title || '').toLowerCase());
        if (cached) coverImage = cached;
        else coverImage = `https://thumbnail.komiku.org/uploads/manga/${slug}/manga_thumbnail.png?w=500`;
      }
      
      return { 
        ...data, 
        image: proxyImage(coverImage),
        title_indonesian: data.title,
        chapters: data.chapters || []
      };
    } catch (error) {
      console.warn('Falling back to detailed sample for slug:', slug);
      const found = SAMPLE_MANGA.find(m => m.slug === slug) || SAMPLE_MANGA[0];
      const startChapter = found.slug === 'martial-peak' ? 3650 : (found.slug === 'one-piece' ? 1112 : 226);
      
      return {
        ...found,
        title_indonesian: found.title,
        synopsis: "Di dunia di mana kekuatan ditentukan oleh mata uang Nether, satu orang terbangun dengan triliunan di sakunya. Dimulailah perjalanan legendaris untuk mendominasi dunia virtual.",
        metadata: { type: found.type, author: 'E.B.S', status: 'Ongoing', concept: 'Fantasy', reading_direction: 'Kiri ke kanan' },
        genres: [{ name: 'Action', slug: 'action' }, { name: 'Adventure', slug: 'adventure' }, { name: 'Fantasy', slug: 'fantasy' }],
        chapters: Array.from({length: 100}, (_, i) => ({
          chapter: `Chapter ${startChapter - i}`,
          slug: `${slug}-chapter-${startChapter - i}`,
          date: '13/04/2026'
        }))
      };
    }
  },

  getChapterImages: async (chapterSlug) => {
    try {
      const response = await fetch(`${BASE_URL}/komikstation/chapter/${chapterSlug}`);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      // klikcdn.com images load directly — no proxy needed
      return { 
        images: data.images || [],
        chapter_title: data.title || chapterSlug.replace(/-/g, ' '),
        navigation: {
          previousChapter: data.prevSlug || null,
          nextChapter: data.nextSlug || null,
          chapterList: data.comicSlug || null
        }
      };
    } catch (error) {
      return {
        images: Array.from({length: 25}, (_, i) => `https://placehold.co/800x1200/121217/e2e8f0?text=Kazedomic+Chapter+Page+${i+1}`),
        chapter_title: chapterSlug.replace(/-/g, ' '),
        navigation: {}
      };
    }
  },

  getAllComics: async (page = 1, genreId = null) => {
    try {
      const url = genreId 
        ? `${BASE_URL}/komikstation/list?page=${page}&genre=${genreId}`
        : `${BASE_URL}/komikstation/list?page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      const comics = (data.results || []).map(c => {
        let finalImage = c.imageSrc;
        if (!finalImage || finalImage.startsWith('data:image')) {
          const cached = comicMap.get(c.title.toLowerCase());
          if (cached) finalImage = cached;
          else finalImage = `https://thumbnail.komiku.org/uploads/manga/${c.slug}/manga_thumbnail.png?w=500`;
        }
        return {
          ...c,
          image: proxyImage(finalImage),
          latest_chapter: c.latestChapter || 'Latest'
        };
      });
      
      return {
        comics,
        hasNextPage: data.pagination?.hasNextPage || false
      };
    } catch (error) {
      console.error("Failed to fetch list", error);
      return { comics: SAMPLE_MANGA, hasNextPage: false };
    }
  },

  getGenres: async () => {
    try {
      const response = await fetch(`${BASE_URL}/komikstation/genres`);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      return data.genres || [];
    } catch (error) {
      console.error("Failed to fetch genres", error);
      return [];
    }
  }
};
