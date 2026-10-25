import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  // Determine return path after sign-in
  const returnTarget = location.state?.from?.pathname || searchParams.get('from') || '/';

  const {
    register,
    handleSubmit,
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
      navigate(returnTarget, { replace: true });
    } catch (err) {
      toastError(err.response?.data?.message || 'Login failed. Please verify email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevQuickLogin = (role) => {
    switchMockRole(role);
    toastSuccess(`Switched session to ${role}`);
    navigate(returnTarget, { replace: true });
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
            Access the Press
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
              placeholder="editor@chronicle.press"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must contain at least 6 characters' }
              })}
              error={errors.password?.message}
            />

            <div className="pt-2">
              <Button type="submit" variant="solid" className="w-full" disabled={submitting}>
                {submitting ? 'Authenticating...' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Development Quick Role Shortcuts */}
          {import.meta.env.DEV && (
            <div className="p-3.5 bg-paper-2 border border-rule rounded-[2px] space-y-2">
              <p className="font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft">
                Development Instant Sign In:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleDevQuickLogin('admin')}
                  className="font-mono text-xs uppercase tracking-meta px-2.5 py-1 border border-ink bg-paper text-ink hover:bg-ink hover:text-paper rounded-[2px]"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDevQuickLogin('author')}
                  className="font-mono text-xs uppercase tracking-meta px-2.5 py-1 border border-accent bg-paper text-accent hover:bg-accent hover:text-white rounded-[2px]"
                >
                  Author
                </button>
                <button
                  type="button"
                  onClick={() => handleDevQuickLogin('reader')}
                  className="font-mono text-xs uppercase tracking-meta px-2.5 py-1 border border-rule bg-paper text-ink-soft hover:border-ink hover:text-ink rounded-[2px]"
                >
                  Reader
                </button>
              </div>
            </div>
          )}

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
