'use client';

import { useEffect, useState } from 'react';
import { songs as allSongs } from '@/data/songs';
import { supabase } from '@/utils/supabaseClient';
import SongCard from '@/components/SongCard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [songScores, setSongScores] = useState({});

  // 1. create / retrieve anonymous user
  useEffect(() => {
    const stored = localStorage.getItem('eurovision_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      const newUser = { id: crypto.randomUUID() };
      localStorage.setItem('eurovision_user', JSON.stringify(newUser));
      setUser(newUser);
    }
  }, []);

  // 2. fetch existing votes
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id);
      const map = {};
      data?.forEach((v) => {
        map[v.song_id] = v.total;
      });
      setSongScores(map);
    })();
  }, [user]);

  // 3. sort songs by total desc, then id
  const sortedSongs = [...allSongs].sort((a, b) => {
    const ta = songScores[a.id] ?? 0;
    const tb = songScores[b.id] ?? 0;
    return tb - ta || a.id - b.id;
  });

  const handleSave = (songId, total) => {
    setSongScores((s) => ({ ...s, [songId]: total }));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-display text-center text-primary mb-10">
        Eurovision 2025 · Grand Final Scorecard
      </h1>

      <div className="max-w-3xl mx-auto">
        {sortedSongs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            user={user}
            onSave={handleSave}
          />
        ))}
      </div>

      <footer className="mt-12 text-center text-xs text-gray-500">
        Powered by Supabase · Hosted on Vercel
      </footer>
    </main>
  );
}
