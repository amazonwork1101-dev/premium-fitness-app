'use client';
import { useState } from 'react';
import { useAppGlobal } from '../context/AppContext';
import { supabase } from '../supabase';

export default function ProfilePage() {
  const { user, userName, setUserName } = useAppGlobal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Success! Check your email for a validation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Signed in successfully!');
      }
    } catch (err: any) {
      setMessage(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessage('Logged out.');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-4 text-slate-100">
      <h1 className="text-xs font-bold tracking-wider uppercase text-slate-400">User Profile</h1>
      <h2 className="text-3xl font-black text-slate-100 tracking-tight">My Profile</h2>

      {/* Profile Card Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-md">
        
        {user ? (
          /* IF USER IS LOGGED IN SHOW PROFILE CONTROL */
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm font-medium text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-800/60">
              <p className="text-xs text-slate-500 mb-2">Account: {user.email}</p>
              <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-slate-800 p-3 text-xs font-bold text-slate-300 hover:bg-red-950/40 hover:text-red-400 transition-all"
              >
                Sign Out Account
              </button>
            </div>
          </div>
        ) : (
          /* IF GUEST SHOW COMPACT AUTH INLINE FORM */
          <form onSubmit={handleAuth} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300">
              {isSignUp ? 'Create Premium Cloud Profile' : 'Sync Account to Cloud'}
            </h3>
            
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 p-3 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
            >
              {loading ? 'Connecting...' : isSignUp ? 'Sign Up' : 'Sign In & Sync'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-slate-500 hover:text-emerald-400 underline transition-all"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have a cloud backup? Sign Up"}
              </button>
            </div>
          </form>
        )}

        {/* Action Status Messages */}
        {message && (
          <p className="mt-4 text-center text-xs font-medium text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-lg">
            {message}
          </p>
        )}
      </div>

      {/* Keep your beautiful achievements card untouched beneath it */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">My Achievements</label>
        <div className="flex items-center justify-between bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Consistency Streak</p>
            <p className="text-xl font-black text-amber-500">5 Days Consecutive</p>
            <p className="text-[10px] text-slate-500 mt-0.5">All-time record: 12 days</p>
          </div>
          <div className="text-2xl bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">🔥</div>
        </div>
      </div>
    </div>
  );
}