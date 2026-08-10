const BASE_URL = 'https://www.sankavollerei.web.id/comic/shinigami';

export const GENRE_MAP = {
  'action': 'action', 'adventure': 'adventure', 'comedy': 'comedy',
  'drama': 'drama', 'ecchi': 'ecchi', 'fantasy': 'fantasy',
  'gender-bender': 'gender-bender', 'harem': 'harem', 'historical': 'historical',
  'horror': 'horror', 'isekai': 'isekai', 'josei': 'josei',
  'martial-arts': 'martial-arts', 'mature': 'mature', 'mecha': 'mecha',
  'mystery': 'mystery', 'psychological': 'psychological', 'romance': 'romance',
  'school-life': 'school-life', 'sci-fi': 'sci-fi', 'seinen': 'seinen',
  'shoujo': 'shoujo', 'shounen': 'shounen', 'slice-of-life': 'slice-of-life',
  'sports': 'sports', 'supernatural': 'supernatural', 'tragedy': 'tragedy'
};

const normalizeManga = (m) => {
  if (!m) return null;
  const coverUrl = m.cover || m.cover_portrait || m.thumbnail || '';

  let chapterDisplay = 'Latest';
  if (m.latest_chapter) {
    chapterDisplay = typeof m.latest_chapter === 'object'
      ? `Chapter ${m.latest_chapter.chapter_number}`
      : `Chapter ${m.latest_chapter}`;
  } else if (m.latest_chapter_number) {
    chapterDisplay = `Chapter ${m.latest_chapter_number}`;
  }

  let typeDisplay = 'Manhwa';
  if (Array.isArray(m.format) && m.format.length > 0) {
    typeDisplay = m.format[0].name || m.format[0];
  } else if (typeof m.format === 'string') {
    typeDisplay = m.format;
  } else if (Array.isArray(m.type) && m.type.length > 0) {
    typeDisplay = m.type[0].name || m.type[0];
  } else if (typeof m.type === 'string') {
    typeDisplay = m.type;
  }

  return {
    ...m,
    slug: m.manga_id || m.id,
    manga_id: m.manga_id || m.id,
    title: m.title || 'Untitled',
    image: coverUrl,
    latest_chapter: chapterDisplay,
    rating: m.rating ? parseFloat(m.rating).toFixed(1) : '8.5',
    type: typeDisplay
  };
};

export const api = {
  getHome: async () => {
    try {
      const response = await fetch(`${BASE_URL}/home`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      const rawList = Array.isArray(result.data)
        ? result.data
        : (result.data?.latest || result.data?.popular || []);

      const normalized = rawList.map(normalizeManga).filter(Boolean);

      return {
        trending: normalized.slice(0, 10),
        latest: normalized,
        popular: normalized.slice(0, 6)
      };
    } catch (error) {
      console.error('Failed to fetch home data from Shinigami API:', error);
      return { trending: [], latest: [], popular: [] };
    }
  },

  getAllComics: async (page = 1, genre = null, sortType = 'Terbaru') => {
    try {
      let endpoint = `${BASE_URL}/list?page=${page}`;

      if (sortType === 'Harian') endpoint = `${BASE_URL}/popular?page=${page}&range=daily`;
      else if (sortType === 'Mingguan') endpoint = `${BASE_URL}/popular?page=${page}&range=weekly`;
      else if (sortType === 'Populer Semua Waktu') endpoint = `${BASE_URL}/popular?page=${page}`;

      if (genre && sortType === 'Terbaru') endpoint += `&genre=${genre}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      const pagination = result.pagination || {};
      const hasNextPage = pagination.current_page < pagination.total_pages;

      const rawList = result.data || [];
      const normalizedComics = rawList.map(normalizeManga).filter(Boolean);

      return {
        comics: normalizedComics,
        hasNextPage
      };
    } catch (error) {
      console.error('Failed to fetch comics list from Shinigami API:', error);
      return { comics: [], hasNextPage: false };
    }
  },

  search: async (query) => {
    if (!query) return [];
    try {
      const response = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      const rawList = result.data || [];
      return rawList.map(normalizeManga).filter(Boolean);
    } catch (error) {
      console.error('Failed to search from Shinigami API:', error);
      return [];
    }
  },

  getComicDetail: async (mangaId) => {
    try {
      // Fetch detail info and chapters list in parallel
      const [detailRes, chaptersRes] = await Promise.all([
        fetch(`${BASE_URL}/detail/${mangaId}`),
        fetch(`${BASE_URL}/chapters/${mangaId}`)
      ]);

      if (!detailRes.ok) throw new Error(`Detail HTTP ${detailRes.status}`);
      const detailJson = await detailRes.json();
      const rawDetail = detailJson.data || {};

      let rawChapters = [];
      if (chaptersRes.ok) {
        const chaptersJson = await chaptersRes.json();
        rawChapters = chaptersJson.data || [];

        // Fetch remaining chapter pages sequentially with proactive delay
        const pagination = chaptersJson.pagination;
        if (pagination && pagination.total_pages > 1) {
          for (let i = 2; i <= pagination.total_pages; i++) {
            try {
              // Proactive delay to avoid triggering rate limits
              await new Promise(resolve => setTimeout(resolve, 300));
              let res = await fetch(`${BASE_URL}/chapters/${mangaId}?page=${i}`);

              // Exponential backoff buffer if still rate-limited
              if (res.status === 429) {
                console.warn(`Rate limit hit on page ${i}, cooling down for 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                res = await fetch(`${BASE_URL}/chapters/${mangaId}?page=${i}`);
              }

              if (res.ok) {
                const pageData = await res.json();
                if (pageData && pageData.data) {
                  rawChapters = rawChapters.concat(pageData.data);
                }
              } else {
                console.warn(`Failed fetching chapter page ${i}, status: ${res.status}`);
              }
            } catch (err) {
              console.warn(`Failed fetching chapter page ${i}`, err);
            }
          }
        }
      }

      const normalizedChapters = rawChapters.map(ch => ({
        chapter: `Chapter ${ch.chapter_number}`,
        title: ch.chapter_title ? `Chapter ${ch.chapter_number} - ${ch.chapter_title}` : `Chapter ${ch.chapter_number}`,
        slug: ch.chapter_id,
        chapter_id: ch.chapter_id,
        date: ch.release_date ? new Date(ch.release_date).toLocaleDateString('id-ID') : ''
      }));

      const normalized = normalizeManga(rawDetail);

      const authorsStr = Array.isArray(rawDetail.authors)
        ? rawDetail.authors.map(a => a.name).join(', ')
        : 'Unknown';

      return {
        ...normalized,
        title_indonesian: rawDetail.alternative_title || rawDetail.title,
        synopsis: rawDetail.description || 'Tidak ada deskripsi tersedia.',
        metadata: {
          type: normalized.type,
          author: authorsStr,
          status: rawDetail.status || 'Ongoing',
          concept: rawDetail.release_year ? `Tahun ${rawDetail.release_year}` : 'Manhwa',
          reading_direction: 'Kiri ke kanan'
        },
        genres: (rawDetail.genres || []).map(g => ({
          name: g.name,
          slug: g.slug || g.name?.toLowerCase()
        })),
        chapters: normalizedChapters
      };
    } catch (error) {
      console.error(`Failed to fetch comic detail for ${mangaId}:`, error);
      return null;
    }
  },

  getChapterImages: async (chapterId) => {
    try {
      const response = await fetch(`${BASE_URL}/read/${chapterId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const data = result.data || {};

      const chNum = data.chapter_number;
      const chTitle = data.chapter_title
        ? `Chapter ${chNum} - ${data.chapter_title}`
        : `Chapter ${chNum}`;

      return {
        images: data.images || [],
        chapter_title: chTitle,
        navigation: {
          previousChapter: data.prev_chapter?.chapter_id || null,
          nextChapter: data.next_chapter?.chapter_id || null,
          chapterList: data.manga_id || ''
        }
      };
    } catch (error) {
      console.error(`Failed to fetch chapter images for ${chapterId}:`, error);
      return null;
    }
  },

  getGenres: async () => {
    try {
      const response = await fetch(`${BASE_URL}/genres`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      return (result.data || []).map(g => ({
        id: g.id,
        slug: g.slug,
        name: g.name,
        label: g.name,
        value: g.slug
      }));
    } catch (error) {
      console.error('Failed to fetch genres from Shinigami API:', error);
      return [];
    }
  }
};
