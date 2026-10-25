import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { PullQuote } from '../components/editorial/PullQuote.jsx';
import { useToast } from '../components/ui/Toast.jsx';

export default function LoginPage() {
  const { login, switchMockRole } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  // Return to intended page if set, or /dashboard if author/admin, or /
  const from = location.state?.from?.pathname || new URLSearchParams(location.search).get('from') || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: 'julian.thorne@chronicle.press',
      password: 'password123'
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await login(data);
      toastSuccess(`Welcome back, ${res.user.name}`);
      navigate(from, { replace: true });
    } catch (err) {
      toastError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (role) => {
    switchMockRole(role);
    toastSuccess(`Switched to mock ${role}`);
    navigate(role === 'admin' ? '/admin/posts' : role === 'author' ? '/dashboard' : '/');
  };

  return (
    <div className="py-12 md:py-20">
      <Seo title="Sign In — Readers & Contributors" />
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Editorial Left Column */}
        <div className="md:col-span-6 space-y-4 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-rule pb-8 md:pb-0">
          <span className="font-mono text-xs uppercase tracking-meta text-accent">
            ARCHIVAL CREDENTIALS
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-ink">
            Access the Folios
          </h1>
          <PullQuote
            quote="To write is to engage in a conversation that requires neither haste nor volume, but strict fidelity to the idea."
            attribution="Eleanor Vance, Editor"
          />
        </div>

        {/* Form Right Column */}
        <div className="md:col-span-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              {...register('email', { required: 'Email address is required' })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />

            <div className="pt-2">
              <Button type="submit" variant="solid" className="w-full" disabled={submitting}>
                {submitting ? 'Authenticating...' : 'Sign In to Folio'}
              </Button>
            </div>
          </form>

          {/* Quick Mock Role Shortcuts */}
          <div className="p-3 bg-paper-2 border border-rule rounded-[2px] space-y-2">
            <p className="font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft">
              Instant Dev Sign In:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="font-mono text-xs uppercase tracking-meta px-2 py-1 border border-ink bg-paper text-ink hover:bg-ink hover:text-paper"
              >
                Admin (Eleanor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('author')}
                className="font-mono text-xs uppercase tracking-meta px-2 py-1 border border-accent bg-paper text-accent hover:bg-accent hover:text-white"
              >
                Author (Julian)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('reader')}
                className="font-mono text-xs uppercase tracking-meta px-2 py-1 border border-rule bg-paper text-ink-soft hover:border-ink hover:text-ink"
              >
                Reader (Clara)
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link to="/register" className="font-mono text-xs text-accent hover:underline uppercase tracking-meta">
              Don't have an account? Register as reader &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
