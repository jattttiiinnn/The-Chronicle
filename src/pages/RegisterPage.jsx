import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { PullQuote } from '../components/editorial/PullQuote.jsx';
import { useToast } from '../components/ui/Toast.jsx';

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

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
      const res = await registerAuth(data);
      toastSuccess(`Welcome to the readership, ${res.user.name}`);
      navigate('/');
    } catch (err) {
      toastError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <Seo title="Register — Readers Circle" />
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Editorial Left Column */}
        <div className="md:col-span-6 space-y-4 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-rule pb-8 md:pb-0">
          <span className="font-mono text-xs uppercase tracking-meta text-accent">
            JOIN THE READERSHIP
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
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="reader@example.com"
              {...register('email', { required: 'Email address is required' })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
              error={errors.password?.message}
            />

            <Input
              label="Short Reader Bio (Optional)"
              placeholder="Architectural observer, bibliophile..."
              {...register('bio')}
            />

            <div className="pt-2">
              <Button type="submit" variant="solid" className="w-full" disabled={submitting}>
                {submitting ? 'Creating Reader Folio...' : 'Create Reader Account'}
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
