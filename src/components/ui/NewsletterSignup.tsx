'use client';

import React, { useState } from 'react';
import { Mail, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Thank you for joining our circle.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Unable to subscribe right now. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-ivory border-y border-softborder">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-2 block">
          Editorial Letter
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium mb-3">
          Good Finds, Delivered Occasionally.
        </h2>
        <p className="text-sm sm:text-base text-charcoal/75 max-w-lg mx-auto mb-8 leading-relaxed">
          No spam, no weekly clutter. Just thoughtful decor discoveries, small-space organizing tips, and verified budget finds for Indian homes.
        </p>

        {status === 'success' ? (
          <div className="p-4 bg-sage-50 border border-sage-300 rounded-sm text-sage-700 text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
            <Check className="w-5 h-5 text-sage-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-warmgrey absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-purewhite border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm pl-10 pr-4 py-3 rounded-sm transition-colors"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={status === 'loading'}
                className="whitespace-nowrap px-6 py-3"
              >
                <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {status === 'error' && (
              <p className="text-xs text-terracotta flex items-center justify-center gap-1.5 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{message}</span>
              </p>
            )}
            <p className="text-[11px] text-warmgrey">
              By subscribing, you agree to our{' '}
              <a href="/privacy-policy" className="underline hover:text-charcoal">
                Privacy Policy
              </a>
              . Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

