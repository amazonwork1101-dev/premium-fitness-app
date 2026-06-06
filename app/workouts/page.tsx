'use client';
import { useState } from 'react';
import { useAppGlobal } from '../context/AppContext';

export default function WorkoutsPage() {
  const { workouts, youtubeVideos, addBurned, removeWorkout, addYouTubeVideo, removeYouTubeVideo } = useAppGlobal();
  
  // Exercise Form States
  const [workoutName, setWorkoutName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [calories, setCalories] = useState(150);

  // YouTube Form States
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName) return;
    addBurned({
      name: workoutName,
      sets: Number(sets),
      reps: Number(reps),
      caloriesBurned: Number(calories)
    });
    setWorkoutName('');
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl) return;
    addYouTubeVideo(videoTitle, videoUrl);
    setVideoTitle('');
    setVideoUrl('');
  };

  // Helper to safely format or clean embed links if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-4 text-slate-100 pb-24">
      <div>
        <h1 className="text-xs font-bold tracking-wider uppercase text-slate-400">Training Module</h1>
        <h2 className="text-3xl font-black text-slate-100 tracking-tight">Workouts</h2>
      </div>

      {/* 1. Exercise Tracker Creator Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-md space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Custom Exercise Creator</h3>
        <form onSubmit={handleAddExercise} className="space-y-3">
          <input 
            type="text" placeholder="Workout Name" value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm focus:border-emerald-500 focus:outline-none"
            required
          />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] uppercase text-slate-500 pl-1">Sets</label>
              <input type="number" value={sets} onChange={(e) => setSets(Number(e.target.value))} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-center text-sm focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase text-slate-500 pl-1">Reps</label>
              <input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-center text-sm focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase text-slate-500 pl-1">Est. Kcal</label>
              <input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-center text-sm focus:border-emerald-500 focus:outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-500 p-3 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all">
            Add to Active Session
          </button>
        </form>
      </div>

      {/* 2. YouTube Channel Routines Storage Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-md space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">Saved YouTube Video Routines</h3>
        <form onSubmit={handleAddVideo} className="space-y-3">
          <input 
            type="text" placeholder="Video Title / Channel Name" value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm focus:border-sky-500 focus:outline-none"
            required
          />
          <input 
            type="url" placeholder="Paste YouTube Link URL" value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm focus:border-sky-500 focus:outline-none"
            required
          />
          <button type="submit" className="w-full rounded-xl bg-sky-500 p-3 text-xs font-black text-slate-950 hover:bg-sky-400 transition-all">
            Save Video Library Reference
          </button>
        </form>
      </div>

      {/* 3. Render Active Routine Session Logs */}
      {workouts.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Today's Session</h4>
          <div className="space-y-2">
            {workouts.map((w) => (
              <div key={w.id} className="flex items-center justify-between bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl text-sm">
                <div>
                  <p className="font-bold text-slate-200">{w.name}</p>
                  <p className="text-xs text-slate-500">{w.sets} sets × {w.reps} reps · {w.caloriesBurned} kcal</p>
                </div>
                <button onClick={() => removeWorkout(w.id, w.caloriesBurned)} className="text-slate-500 hover:text-red-400 font-bold px-2 text-base">×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Render Saved YouTube Library List */}
      {youtubeVideos.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider pl-1">Video Library Feed</h4>
          <div className="space-y-4">
            {youtubeVideos.map((v) => (
              <div key={v.id} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                <div className="p-3 bg-slate-900 flex justify-between items-center border-b border-slate-800">
                  <span className="text-xs font-bold tracking-tight text-slate-300 truncate max-w-[80%]">{v.title}</span>
                  <button onClick={() => removeYouTubeVideo(v.id)} className="text-slate-500 hover:text-red-400 text-xs font-bold">Delete</button>
                </div>
                <div className="relative aspect-video w-full">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src={getEmbedUrl(v.url)} 
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}