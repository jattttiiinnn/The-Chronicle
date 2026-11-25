import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { PullQuote } from '../components/editorial/PullQuote.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { cn } from '../utils/cn.js';

const ROLE_OPTIONS = [
  {
    value: 'reader',
    label: 'Reader',
    description: 'Follow the journal, comment, like and save stories.'
  },
  {
    value: 'author',
    label: 'Writer',
    description: 'Everything a reader can do, plus publish your own essays.'
  }
];

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState('reader');

  const returnTarget = location.state?.from?.pathname || searchParams.get('from') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: ''
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await registerAuth({ ...data, role });
      toastSuccess(
        role === 'author'
          ? `Welcome to the writing desk, ${res.user.name}`
          : `Welcome to the readership, ${res.user.name}`
      );
      navigate(role === 'author' ? '/dashboard' : returnTarget, { replace: true });
    } catch (err) {
      toastError(err.response?.data?.message || 'Registration failed. Please check form inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <Seo title="Register — Join the Journal" noindex={true} />
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Editorial Left Column */}
        <div className="md:col-span-6 space-y-4 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-rule pb-8 md:pb-0">
          <span className="font-mono text-xs uppercase tracking-meta text-accent">
            JOIN THE JOURNAL
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-ink">
            A Society of Quiet Attention
          </h1>
          <PullQuote
            quote="Reading is never a passive reception of information; it is a collaborative assembly of meaning between author and spectator."
            attribution="The Chronicle Editorial"
          />
        </div>

        {/* Form Right Column */}
        <div className="md:col-span-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Samuel Green"
              {...register('name', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="reader@example.com"
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
              placeholder="Minimum 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              error={errors.password?.message}
            />

            <Input
              label="Bio (Optional)"
              placeholder="Architectural observer, bibliophile..."
              {...register('bio')}
            />

            <fieldset>
              <legend className="block font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft mb-2">
                I am joining as
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLE_OPTIONS.map((option) => {
                  const selected = role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      aria-pressed={selected}
                      className={cn(
                        'text-left p-3 border rounded-[2px] transition-colors',
                        selected
                          ? 'border-accent bg-paper-2'
                          : 'border-rule hover:border-ink'
                      )}
                    >
                      <span
                        className={cn(
                          'block font-mono text-xs uppercase tracking-meta font-semibold mb-1',
                          selected ? 'text-accent' : 'text-ink'
                        )}
                      >
                        {option.label}
                      </span>
                      <span className="block text-xs text-ink-soft leading-snug">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="pt-2">
              <Button type="submit" variant="solid" className="w-full" disabled={submitting}>
                {submitting
                  ? role === 'author'
                    ? 'Creating Writer Account...'
                    : 'Creating Reader Account...'
                  : role === 'author'
                    ? 'Register as Writer'
                    : 'Register as Reader'}
              </Button>
            </div>
          </form>

          <div className="pt-2 text-center">
            <Link to="/login" className="font-mono text-xs text-accent hover:underline uppercase tracking-meta">
              Already have an account? Sign in &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
