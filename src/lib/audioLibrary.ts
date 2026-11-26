export interface AudioTrack {
  id: string;
  name: string; // identifier e.g. "divine-flute", "serene-sitar"
  title: string; // readable title
  url: string; // file path or data URL or remote URL
  type: "bg" | "correct" | "wrong";
}

export const DEFAULT_BG_MUSIC: AudioTrack[] = [
  {
    id: "bg-flute",
    name: "divine-flute",
    title: "Divine Flute (Default)",
    url: "/audio/bg-music.mp3",
    type: "bg"
  },
  {
    id: "bg-sitar",
    name: "sacred-sitar",
    title: "Sacred Sitar & Bells",
    url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    type: "bg"
  },
  {
    id: "bg-ambient",
    name: "ambient-flute",
    title: "Ambient Meditation Flute",
    url: "https://assets.mixkit.co/music/preview/mixkit-meditation-flute-247.mp3",
    type: "bg"
  }
];

export const DEFAULT_CORRECT_SOUNDS: AudioTrack[] = [
  {
    id: "sfx-chime",
    name: "harinam-chime",
    title: "Harinam Chime (Default)",
    url: "/audio/correct.mp3",
    type: "correct"
  },
  {
    id: "sfx-bell",
    name: "temple-bell",
    title: "Temple Bell Ding",
    url: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
    type: "correct"
  },
  {
    id: "sfx-flute-note",
    name: "celestial-flute",
    title: "Celestial Flute Note",
    url: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
    type: "correct"
  }
];

export const DEFAULT_WRONG_SOUNDS: AudioTrack[] = [
  {
    id: "sfx-gong",
    name: "temple-gong",
    title: "Soft Temple Gong (Default)",
    url: "/audio/wrong.mp3",
    type: "wrong"
  },
  {
    id: "sfx-deep-bell",
    name: "deep-bell",
    title: "Deep Resonance Bell",
    url: "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3",
    type: "wrong"
  },
  {
    id: "sfx-low-tone",
    name: "low-tone",
    title: "Low Meditation Tone",
    url: "https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3",
    type: "wrong"
  }
];

export function getStoredAudioLibrary(): {
  bgTracks: AudioTrack[];
  correctSounds: AudioTrack[];
  wrongSounds: AudioTrack[];
} {
  if (typeof window === "undefined") {
    return {
      bgTracks: DEFAULT_BG_MUSIC,
      correctSounds: DEFAULT_CORRECT_SOUNDS,
      wrongSounds: DEFAULT_WRONG_SOUNDS
    };
  }

  let bg = [...DEFAULT_BG_MUSIC];
  let correct = [...DEFAULT_CORRECT_SOUNDS];
  let wrong = [...DEFAULT_WRONG_SOUNDS];

  try {
    const customBg = localStorage.getItem("sr_audio_bg_tracks");
    if (customBg) {
      const parsed: AudioTrack[] = JSON.parse(customBg);
      parsed.forEach(p => {
        if (!bg.some(b => b.id === p.id || b.name === p.name)) bg.push(p);
      });
    }
    const customCorrect = localStorage.getItem("sr_audio_correct_sounds");
    if (customCorrect) {
      const parsed: AudioTrack[] = JSON.parse(customCorrect);
      parsed.forEach(p => {
        if (!correct.some(b => b.id === p.id || b.name === p.name)) correct.push(p);
      });
    }
    const customWrong = localStorage.getItem("sr_audio_wrong_sounds");
    if (customWrong) {
      const parsed: AudioTrack[] = JSON.parse(customWrong);
      parsed.forEach(p => {
        if (!wrong.some(b => b.id === p.id || b.name === p.name)) wrong.push(p);
      });
    }
  } catch (e) {}

  return { bgTracks: bg, correctSounds: correct, wrongSounds: wrong };
}

export function saveAudioTrack(track: AudioTrack) {
  if (typeof window === "undefined") return;
  const storageKey = 
    track.type === "bg" 
      ? "sr_audio_bg_tracks" 
      : track.type === "correct" 
        ? "sr_audio_correct_sounds" 
        : "sr_audio_wrong_sounds";

  try {
    const raw = localStorage.getItem(storageKey);
    let list: AudioTrack[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex(l => l.id === track.id || l.name === track.name);
    if (idx >= 0) {
      list[idx] = track;
    } else {
      list.push(track);
    }
    localStorage.setItem(storageKey, JSON.stringify(list));
  } catch (e) {}
}

export function deleteAudioTrack(id: string, type: "bg" | "correct" | "wrong") {
  if (typeof window === "undefined") return;
  const storageKey = 
    type === "bg" 
      ? "sr_audio_bg_tracks" 
      : type === "correct" 
        ? "sr_audio_correct_sounds" 
        : "sr_audio_wrong_sounds";

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const list: AudioTrack[] = JSON.parse(raw);
      const filtered = list.filter(l => l.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
    }
  } catch (e) {}
}
