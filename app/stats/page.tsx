'use client';
import { useAppGlobal } from '../context/AppContext';

export default function StatsPage() {
  const { intake, burned, water, meals, workouts } = useAppGlobal();

  // Simple calculation metrics for analytics display panels
  const totalMealsCount = meals.length;
  const totalWorkoutsCount = workouts.length;
  const hydrationPercentage = Math.min(100, Math.round((water / 2.5) * 100));

  // Simulated week view baseline data mapping over your dynamic points
  const weeklyActivityData = [
    { day: 'Mon', kcal: 400 },
    { day: 'Tue', kcal: 300 },
    { day: 'Wed', kcal: 550 },
    { day: 'Thu', kcal: 200 },
    { day: 'Fri', kcal: 480 },
    { day: 'Sat', kcal: burned > 0 ? burned : 350 }, // Seamlessly injects your real active burned value
  ];

  const maxCalorieValue = Math.max(...weeklyActivityData.map(d => d.kcal));

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-4 text-slate-100 pb-24">
      <div>
        <h1 className="text-xs font-bold tracking-wider uppercase text-slate-400">Analytics Panel</h1>
        <h2 className="text-3xl font-black text-slate-100 tracking-tight">My Progress</h2>
      </div>

      {/* 1. Dynamic Bar Chart Visualization */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-md space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Energy Expenditure</h3>
          <p className="text-2xl font-black text-amber-500 mt-0.5">{burned} <span className="text-xs font-normal text-slate-500">kcal burned today</span></p>
        </div>

        {/* Custom pure CSS/Tailwind Graph Layout */}
        <div className="flex items-end justify-between h-32 pt-4 px-2 bg-slate-950/40 rounded-xl border border-slate-800/40">
          {weeklyActivityData.map((data, idx) => {
            const barHeightPercentage = maxCalorieValue > 0 ? (data.kcal / maxCalorieValue) * 100 : 10;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 space-y-2 group">
                {/* Tooltip on hover */}
                <span className="text-[9px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -translate-y-6 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {data.kcal}
                </span>
                <div 
                  className="w-4 bg-amber-500 rounded-t-md transition-all duration-500 min-h-[8px] group-hover:bg-amber-400"
                  style={{ height: `${barHeightPercentage}%` }}
                />
                <span className="text-[10px] font-bold text-slate-500">{data.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Structured Breakdown Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Nutrition Count</p>
          <p className="text-2xl font-black text-slate-200">{totalMealsCount} <span className="text-xs text-slate-500 font-normal">Items logged</span></p>
          <p className="text-[10px] text-emerald-400 font-medium">Total: {intake} kcal</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Hydration Index</p>
          <p className="text-2xl font-black text-sky-400">{hydrationPercentage}%</p>
          <p className="text-[10px] text-slate-500 font-medium">{water}L of 2.5L goal</p>
        </div>
      </div>

      {/* 3. Consistency Index Tracker */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Workout Frequency</h4>
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-300">Exercises Completed Today</p>
            <p className="text-[11px] text-slate-500">Syncs directly via Training module listings</p>
          </div>
          <span className="text-lg font-black bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20">
            {totalWorkoutsCount}
          </span>
        </div>
      </div>
    </div>
  );
}