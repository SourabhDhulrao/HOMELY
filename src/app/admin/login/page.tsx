'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Invalid administrative passkey.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Failed to connect to authentication service.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-purewhite p-8 sm:p-10 rounded-sm border border-softborder shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-ivory-200 flex items-center justify-center text-charcoal mx-auto">
            <Shield className="w-6 h-6 text-terracotta" />
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-charcoal">
            Editorial Studio
          </h1>
          <p className="text-xs text-warmgrey">
            Authorized admin access for HOMELY catalogue and Amazon Creators API
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
              Secret Passkey
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-warmgrey absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin secret key"
                className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm pl-10 pr-4 py-2.5 rounded-sm"
              />
            </div>
          </div>

          {status === 'error' && (
            <p className="text-xs text-terracotta flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={status === 'loading'}
            className="w-full py-3"
          >
            <span>{status === 'loading' ? 'Authenticating...' : 'Enter Studio'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="p-3 bg-ivory-100 rounded text-[11px] text-charcoal/70 border border-softborder leading-relaxed">
          <p className="font-semibold text-charcoal mb-0.5">Development Environment Note:</p>
          <p>
            Default passkey configured in <code>.env.local</code> is <code>homely2025</code>. Change <code>ADMIN_SECRET_KEY</code> in environment variables for production.
          </p>
        </div>
      </div>
    </div>
  );
}

