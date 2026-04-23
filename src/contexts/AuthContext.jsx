import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Bookmark functions
  const addBookmark = async (manga) => {
    if (!user) return { error: { message: 'Harus login terlebih dahulu' } };
    const { data, error } = await supabase
      .from('bookmarks')
      .upsert({
        user_id: user.id,
        manga_slug: manga.slug,
        manga_title: manga.title,
        manga_image: manga.image,
        manga_latest_chapter: manga.latest_chapter || '',
      }, { onConflict: 'user_id,manga_slug' });
    return { data, error };
  };

  const removeBookmark = async (mangaSlug) => {
    if (!user) return { error: { message: 'Harus login terlebih dahulu' } };
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('manga_slug', mangaSlug);
    return { error };
  };

  const getBookmarks = async () => {
    if (!user) return { data: [], error: null };
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  };

  const isBookmarked = async (mangaSlug) => {
    if (!user) return false;
    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('manga_slug', mangaSlug)
      .single();
    return !!data;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    addBookmark,
    removeBookmark,
    getBookmarks,
    isBookmarked
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
