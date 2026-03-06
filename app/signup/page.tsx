'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username: username || email.split('@')[0],
      });
    }

    setSuccess(true);
    setLoading(false);

    if (data.session) {
      router.push('/');
      router.refresh();
    }
  };

  if (success && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-xl font-bold text-textPrimary mb-2">Welcome to StreamZero!</h2>
          <p className="text-textMuted text-sm mb-6">
            Your account is ready. Check your email to verify if required.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Start Watching</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-2/3 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span
              className="font-heading font-black text-3xl"
              style={{
                background: 'linear-gradient(90deg, #22D3EE, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              StreamZero
            </span>
          </Link>
          <p className="text-textMuted text-sm mt-2">Zero Ads. Zero Cost. Absolute cinema.</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl">
          <h1 className="text-xl font-bold text-textPrimary mb-6 font-heading">Create Account</h1>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm text-textMuted mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-textPrimary text-sm outline-none focus:border-primary/50 transition-all placeholder:text-textMuted/50"
                placeholder="your_username"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-textMuted mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-textPrimary text-sm outline-none focus:border-primary/50 transition-all placeholder:text-textMuted/50"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-textMuted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 pr-12 text-textPrimary text-sm outline-none focus:border-primary/50 transition-all placeholder:text-textMuted/50"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textPrimary transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating account...' : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-textMuted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
