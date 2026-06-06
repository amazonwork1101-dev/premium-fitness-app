'use client';
import './globals.css';
import { usePathname } from 'next/navigation';
import { AppProvider } from './context/AppContext';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Updated to match your exact visual layout assets from your screenshots
  const navItems = [
    { label: 'Home', path: '/', activeIcon: '🏠', inactiveIcon: '🏠' },
    { label: 'Workouts', path: '/workouts', activeIcon: '🏋️‍♂️', inactiveIcon: '💪' },
    { label: 'Stats', path: '/stats', activeIcon: '📊', inactiveIcon: '📊' },
    { label: 'Profile', path: '/profile', activeIcon: '🏆', inactiveIcon: '🏆' },
  ];

  return (
    <html lang="en">
      <body className="bg-[#0b0f19] text-slate-100 antialiased font-sans flex items-center justify-center p-0 sm:p-6 min-h-screen">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/10 to-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <AppProvider>
          <div className="w-full max-w-md h-[100vh] sm:h-[880px] bg-[#111827]/80 sm:rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative border border-slate-800/50 backdrop-blur-xl flex flex-col overflow-hidden">

            {/* Status Bar */}
            <div className="px-8 pt-4 pb-2 flex justify-between items-center text-xs text-slate-400/60 font-medium tracking-widest flex-shrink-0">
              <span>9:41</span>
              <div className="flex items-center gap-2"><span>📶</span><span>🔋</span></div>
            </div>

            {/* View Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-32 pt-4 scrollbar-none">
              {children}
            </div>

            {/* Navigation Bar */}
            <nav className="absolute bottom-0 inset-x-0 bg-slate-950/80 border-t border-slate-800/60 backdrop-blur-xl px-6 py-4 flex justify-between items-center z-40 rounded-b-none sm:rounded-b-[40px]">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      window.location.href = item.path;
                    }}
                    className="flex flex-col items-center gap-1 flex-1 transition active:scale-95 group text-center bg-transparent border-none outline-none cursor-pointer"
                  >
                    <span className={`text-xl transition duration-200 ${isActive ? 'scale-110' : 'opacity-50 group-hover:opacity-80'}`}>
                      {isActive ? item.activeIcon : item.inactiveIcon}
                    </span>
                    <span className={`text-[10px] font-bold tracking-wide transition duration-200 ${isActive ? 'text-emerald-400 font-black' : 'text-slate-500 font-medium'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

          </div>
        </AppProvider>

        {/* Performance Metric Monitor */}
        <SpeedInsights />
      </body>
    </html>
  );
}