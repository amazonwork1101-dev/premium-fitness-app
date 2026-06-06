'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';

interface MealItem {
  id: string;
  name: string;
  calories: number;
}

interface WorkoutItem {
  id: string;
  name: string;
  sets: number;
  reps: number;
  caloriesBurned: number;
}

interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
}

interface AppContextType {
  user: User | null;
  intake: number;
  burned: number;
  water: number;
  userName: string;
  loading: boolean;
  meals: MealItem[];
  workouts: WorkoutItem[];
  youtubeVideos: YouTubeVideo[];
  addIntake: (name: string, calories: number) => Promise<void>;
  removeMeal: (id: string, calories: number) => Promise<void>;
  addBurned: (workout: Omit<WorkoutItem, 'id'>) => Promise<void>;
  removeWorkout: (id: string, calories: number) => Promise<void>;
  addWater: (liters: number) => Promise<void>;
  resetWater: () => Promise<void>;
  addYouTubeVideo: (title: string, url: string) => Promise<void>;
  removeYouTubeVideo: (id: string) => Promise<void>;
  setUserName: (name: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [intake, setIntake] = useState(0);
  const [burned, setBurned] = useState(0);
  const [water, setWater] = useState(0);
  const [userName, setUserName] = useState('Alex Rivers');
  const [loading, setLoading] = useState(true);

  const [meals, setMeals] = useState<MealItem[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);

  // 1. Initial LocalStorage Baseline Load
  useEffect(() => {
    try {
      const savedIntake = localStorage.getItem('premium_fitness_intake');
      const savedBurned = localStorage.getItem('premium_fitness_burned');
      const savedWater = localStorage.getItem('premium_fitness_water');
      const savedName = localStorage.getItem('premium_fitness_username');
      const savedMeals = localStorage.getItem('premium_fitness_meals');
      const savedWorkouts = localStorage.getItem('premium_fitness_workouts');
      const savedVideos = localStorage.getItem('premium_fitness_videos');

      if (savedIntake !== null) setIntake(Number(savedIntake));
      if (savedBurned !== null) setBurned(Number(savedBurned));
      if (savedWater !== null) setWater(Number(savedWater));
      if (savedName !== null) setUserName(savedName);
      if (savedMeals !== null) setMeals(JSON.parse(savedMeals));
      if (savedWorkouts !== null) setWorkouts(JSON.parse(savedWorkouts));
      if (savedVideos !== null) setYoutubeVideos(JSON.parse(savedVideos));
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  // 2. Track Auth User Session Changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) await loadUserData(session.user.id);
      setLoading(false);
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        // FIXED: Clean defaults reset on sign out (No baseline numbers stuck in state)
        setIntake(0);
        setBurned(0);
        setWater(0);
        setUserName('Alex Rivers');
        setMeals([]);
        setWorkouts([]);
        setYoutubeVideos([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: profile } = await supabase.from('profiles').select('username').eq('id', userId).single();
      if (profile?.username) setUserName(profile.username);

      const today = new Date().toISOString().split('T')[0];
      let { data: logs } = await supabase.from('fitness_logs').select('*').eq('user_id', userId).eq('log_date', today).single();

      if (logs) {
        setIntake(logs.intake || 0);
        setBurned(logs.burned || 0);
        setWater(Number(logs.water) || 0);
      }
    } catch (err) {
      console.error('Error synchronizing with database state:', err);
    }
  };

  // Sync actions across LocalStorage and Cloud
  const addIntake = async (name: string, calories: number) => {
    const newMeal: MealItem = { id: Date.now().toString(), name, calories };
    setMeals((prev) => {
      const updated = [...prev, newMeal];
      localStorage.setItem('premium_fitness_meals', JSON.stringify(updated));
      return updated;
    });

    setIntake((prev) => {
      const nextVal = prev + calories;
      localStorage.setItem('premium_fitness_intake', nextVal.toString());
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        supabase.from('fitness_logs').upsert({ user_id: user.id, log_date: today, intake: nextVal }).then();
      }
      return nextVal;
    });
  };

  const removeMeal = async (id: string, calories: number) => {
    setMeals((prev) => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('premium_fitness_meals', JSON.stringify(updated));
      return updated;
    });
    setIntake((prev) => {
      const nextVal = Math.max(0, prev - calories);
      localStorage.setItem('premium_fitness_intake', nextVal.toString());
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        supabase.from('fitness_logs').upsert({ user_id: user.id, log_date: today, intake: nextVal }).then();
      }
      return nextVal;
    });
  };

  const addBurned = async (workout: Omit<WorkoutItem, 'id'>) => {
    const newWorkout: WorkoutItem = { ...workout, id: Date.now().toString() };
    setWorkouts((prev) => {
      const updated = [...prev, newWorkout];
      localStorage.setItem('premium_fitness_workouts', JSON.stringify(updated));
      return updated;
    });

    setBurned((prev) => {
      const nextVal = prev + workout.caloriesBurned;
      localStorage.setItem('premium_fitness_burned', nextVal.toString());
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        supabase.from('fitness_logs').upsert({ user_id: user.id, log_date: today, burned: nextVal }).then();
      }
      return nextVal;
    });
  };

  const removeWorkout = async (id: string, calories: number) => {
    setWorkouts((prev) => {
      const updated = prev.filter(w => w.id !== id);
      localStorage.setItem('premium_fitness_workouts', JSON.stringify(updated));
      return updated;
    });
    setBurned((prev) => {
      const nextVal = Math.max(0, prev - calories);
      localStorage.setItem('premium_fitness_burned', nextVal.toString());
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        supabase.from('fitness_logs').upsert({ user_id: user.id, log_date: today, burned: nextVal }).then();
      }
      return nextVal;
    });
  };

  const addWater = async (liters: number) => {
    setWater((prev) => {
      const nextVal = parseFloat((prev + liters).toFixed(2));
      localStorage.setItem('premium_fitness_water', nextVal.toString());
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        supabase.from('fitness_logs').upsert({ user_id: user.id, log_date: today, water: nextVal }).then();
      }
      return nextVal;
    });
  };

  const resetWater = async () => {
    setWater(0);
    localStorage.setItem('premium_fitness_water', '0');
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      // FIXED: Forces database to explicitly log 0 liters immediately
      await supabase.from('fitness_logs').upsert({ user_id: user.id, log_date: today, water: 0 });
    }
  };

  const addYouTubeVideo = async (title: string, url: string) => {
    setYoutubeVideos((prev) => {
      const updated = [...prev, { id: Date.now().toString(), title, url }];
      localStorage.setItem('premium_fitness_videos', JSON.stringify(updated));
      return updated;
    });
  };

  const removeYouTubeVideo = async (id: string) => {
    setYoutubeVideos((prev) => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem('premium_fitness_videos', JSON.stringify(updated));
      return updated;
    });
  };

  const setUserNameWithDB = async (name: string) => {
    setUserName(name);
    localStorage.setItem('premium_fitness_username', name);
    if (user) {
      await supabase.from('profiles').upsert({ id: user.id, username: name });
    }
  };

  return (
    <AppContext.Provider value={{
      user, intake, burned, water, userName, loading, meals, workouts, youtubeVideos,
      addIntake, removeMeal, addBurned, removeWorkout, addWater, resetWater, addYouTubeVideo, removeYouTubeVideo, setUserName: setUserNameWithDB
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppGlobal() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppGlobal must be used within an AppProvider');
  return context;
}