'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';

export default function SongCard({ song, user, onSave }) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState({ performance: 0, song: 0, vocal: 0 });
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (field) => (e) => {
    setScores({ ...scores, [field]: Number(e.target.value) });
  };

  const saveVote = async () => {
    const { error } = await supabase.from('votes').upsert({
      user_id: user.id,
      song_id: song.id,
      performance: scores.performance,
      song: scores.song,
      vocal: scores.vocal,
      total
    });
    if (!error) {
      onSave(song.id, total);
      setOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h3 className="font-display text-lg text-primary leading-tight">
            {song.title}
          </h3>
          <p className="text-sm text-gray-600">
            {song.country} · {song.artist}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span className="font-bold text-accent text-xl w-10 text-right">
              {total}
            </span>
          )}
          {open ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {['performance', 'song', 'vocal'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="mb-1 capitalize text-sm text-gray-700">
                    {field}
                  </label>
                  <select
                    value={scores[field]}
                    onChange={handleScoreChange(field)}
                    className="border rounded-xl p-2"
                  >
                    {Array.from({ length: 13 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button
              onClick={saveVote}
              className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90"
            >
              <Save size={18} /> Save
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
