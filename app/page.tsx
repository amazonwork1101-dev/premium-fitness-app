'use client';
import { useState } from 'react';
import { useAppGlobal } from './context/AppContext';
import Link from 'next/link';

export default function HomePage() {
  const { burned, water, meals, addIntake, removeMeal, addWater, resetWater, userName } = useAppGlobal();
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [foodKcal, setFoodKcal] = useState('');

  const handleLogFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !foodKcal) return;
    addIntake(foodName, Number(foodKcal));
    setFoodName('');
    setFoodKcal('');
    setShowFoodForm(false);
  };

  // FIX: Calculate total intake calories dynamically from your meals list
  const intake = meals.reduce((sum, meal) => sum + meal.calories, 0);

  const netCalories = intake - burned;
  const energyProgress = Math.min(100, Math.round((intake / 2300) * 100));

  return (
    <div className="w-full max-w-md mx-auto space-y-5 p-4 text-slate-100 pb-28 relative">
      {/* Upper Profile Banner */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Premium Tracker</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-100">{userName}</h1>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Mini Grid Stats Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Remaining Net</p>
          <p className="text-2xl font-black mt-1">{netCalories} <span className="text-xs text-slate-500 font-normal">kcal</span></p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Active Burn</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{burned} <span className="text-xs text-slate-500 font-normal">kcal</span></p>
        </div>
      </div>

      {/* Energy Balance Wrapper Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Energy Balance</p>
            <p className="text-2xl font-black mt-0.5">{intake} <span className="text-sm font-medium text-slate-500">/ 2300 kcal</span></p>
          </div>
          <div className="h-11 w-11 rounded-full border-4 border-slate-800 flex items-center justify-center text-[11px] font-black text-emerald-400 bg-slate-950">
            {energyProgress}%
          </div>
        </div>

        {/* Progress Bar Rendering */}
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${energyProgress}%` }} />
        </div>

        {/* Dynamic Meal List Mapping */}
        <div className="pt-2 space-y-2">
          <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Today's Meals</p>
          {meals.length === 0 ? (
            <p className="text-xs text-slate-600 italic py-1">No custom foods tracked yet today...</p>
          ) : (
            <div className="space-y-1.5">
              {meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between bg-slate-950/40 border border-slate-800/40 px-3 py-2 rounded-xl text-xs">
                  <span className="font-semibold text-slate-300">{meal.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{meal.calories} kcal</span>
                    <button onClick={() => removeMeal(meal.id, meal.calories)} className="text-slate-500 hover:text-red-400 font-bold pl-1">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inline Food Logger Toggle Window */}
        {showFoodForm ? (
          <form onSubmit={handleLogFood} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl space-y-2 mt-2">
            <input
              type="text" placeholder="Food item name..." value={foodName} onChange={(e) => setFoodName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 p-2 text-xs rounded-lg focus:outline-none focus:border-emerald-500" required
            />
            <input
              type="number" placeholder="Calories (kcal)..." value={foodKcal} onChange={(e) => setFoodKcal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 p-2 text-xs rounded-lg focus:outline-none focus:border-emerald-500" required
            />
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 bg-emerald-500 text-slate-950 text-[11px] font-black py-2 rounded-lg">Confirm</button>
              <button type="button" onClick={() => setShowFoodForm(false)} className="flex-1 bg-slate-800 text-slate-400 text-[11px] py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowFoodForm(true)} className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all text-center">
            + Log Specific Food
          </button>
        )}
      </div>

      {/* Hydration Tracker Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Hydration</p>
            <p className="text-2xl font-black text-sky-400 mt-0.5">{water}L <span className="text-sm font-medium text-slate-500">/ 2.5L Target</span></p>
          </div>
          <span className="text-xl">💧</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => addWater(0.25)} className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-xs font-bold text-slate-300 hover:bg-slate-900 transition-all">
            + 250ml Glass
          </button>
          <button onClick={resetWater} className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-xs font-bold text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-all">
            Reset
          </button>
        </div>
      </div>

      {/* Premium Fixed Bottom Navigation Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-slate-950/80 border border-slate-800 rounded-2xl h-16 flex justify-around items-center backdrop-blur-xl shadow-2xl z-50 px-2">
        <Link href="/" className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-emerald-400 bg-emerald-500/10">
          <span className="text-lg">🏠</span>
          <span className="text-[9px] font-black tracking-wide mt-0.5">Home</span>
        </Link>
        <Link href="/workouts" className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-400 hover:text-slate-200 transition-colors">
          <span className="text-lg">🏋️‍♂️</span>
          <span className="text-[9px] font-bold tracking-wide mt-0.5">Workout</span>
        </Link>
        <Link href="/stats" className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-400 hover:text-slate-200 transition-colors">
          <span className="text-lg">📊</span>
          <span className="text-[9px] font-bold tracking-wide mt-0.5">Stats</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-400 hover:text-slate-200 transition-colors">
          <span className="text-lg">🏆</span>
          <span className="text-[9px] font-bold tracking-wide mt-0.5">Profile</span>
        </Link>
      </div>

    </div>
  );
}