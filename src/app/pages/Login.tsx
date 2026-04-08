import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Login() {
  const { login, signup } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [mode, setMode]           = useState<'signin' | 'signup'>('signin');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  // ── Tahoe tokens ────────────────────────────────────────────────
  const textPrimary   = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary = isDark ? '#aeaeb2' : '#6c6c70';
  const cardBg        = isDark ? 'rgba(30,30,34,0.72)' : 'rgba(255,255,255,0.60)';
  const cardBorder    = isDark ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.80)';
  const cardShadow    = isDark
    ? '0 20px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)'
    : '0 20px 48px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)';
  const inputBg     = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    const result = mode === 'signin'
      ? await login(email, password)
      : await signup(name, email, password);
    setLoading(false);

    if (result.ok) {
      navigate('/');
    } else {
      setError(result.error || 'Something went wrong.');
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: inputBg,
    border: `0.5px solid ${inputBorder}`,
    color: textPrimary,
    transition: 'border-color 0.15s',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 30% 20%, rgba(88,86,214,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,122,255,0.12) 0%, transparent 60%), #111113'
          : 'radial-gradient(ellipse at 30% 20%, rgba(0,122,255,0.10) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(175,82,222,0.08) 0%, transparent 60%), #dddde0',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '22px',
          backdropFilter: 'blur(60px) saturate(220%)',
          WebkitBackdropFilter: 'blur(60px) saturate(220%)',
          background: cardBg,
          border: `0.5px solid ${cardBorder}`,
          boxShadow: cardShadow,
          padding: '40px 36px',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="size-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              boxShadow: '0 4px 16px rgba(0,122,255,0.40), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            <BookOpen className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: textPrimary }}>
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            {mode === 'signin'
              ? 'Sign in to your journal'
              : 'Start your journaling journey'}
          </p>
        </div>

        {/* Mode toggle tabs */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
        >
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className="flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
              style={{
                color: mode === m ? textPrimary : textSecondary,
                background: mode === m
                  ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.90)')
                  : 'transparent',
                boxShadow: mode === m
                  ? (isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.08)')
                  : 'none',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className="pb-1">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: textSecondary }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    autoComplete="name"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: textSecondary }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: textSecondary }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '44px' }}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                style={{ color: textSecondary }}
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm px-3 py-2 rounded-xl"
                style={{
                  color: '#FF3B30',
                  background: isDark ? 'rgba(255,59,48,0.12)' : 'rgba(255,59,48,0.08)',
                  border: '0.5px solid rgba(255,59,48,0.25)',
                }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white rounded-xl transition-all hover:brightness-110 active:scale-98 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
              boxShadow: '0 2px 12px rgba(0,122,255,0.40), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: dividerColor }} />
          <span className="text-xs" style={{ color: textSecondary }}>or</span>
          <div className="flex-1 h-px" style={{ background: dividerColor }} />
        </div>

        {/* Continue as guest */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-2.5 text-sm font-medium rounded-xl transition-all hover:brightness-110 active:scale-98"
          style={{
            color: textSecondary,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            border: `0.5px solid ${inputBorder}`,
          }}
        >
          Continue as Guest
        </button>
      </motion.div>
    </div>
  );
}
