'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Check, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setFeedback(data.message || 'Thank you for reaching out. Our team will review your message.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setFeedback('Network error. Please try again later.');
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
            Get In Touch
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
            Contact The HOMELY Editorial Team
          </h1>
          <p className="text-sm text-charcoal/75 leading-relaxed">
            Have a product recommendation, brand query, or suggestion for our next organizing guide? We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Information Column */}
          <div className="md:col-span-5 bg-purewhite p-6 sm:p-8 rounded-sm border border-softborder space-y-6 shadow-subtle">
            <h2 className="font-editorial text-xl font-medium text-charcoal">
              Editorial Inquiries
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-charcoal/80">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-charcoal">Direct Email</p>
                  <p className="text-warmgrey">editorial@homelyliving.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-charcoal">Product Submissions</p>
                  <p className="text-warmgrey leading-relaxed">
                    Indian craftspeople and Amazon sellers are welcome to submit catalog listings for editorial review.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-softborder text-[11px] text-warmgrey leading-relaxed">
              <p className="font-semibold text-charcoal mb-1">Customer Service Note:</p>
              <p>
                For questions regarding Amazon order tracking, returns, or shipping, please contact Amazon India customer service directly as HOMELY does not fulfill orders.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7 bg-purewhite p-6 sm:p-8 rounded-sm border border-softborder shadow-subtle">
            {status === 'success' ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-sage-100 flex items-center justify-center text-sage-700">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-xl text-charcoal font-medium">Message Received</h3>
                <p className="text-xs sm:text-sm text-charcoal/75 max-w-sm mx-auto leading-relaxed">
                  {feedback}
                </p>
                <Button variant="outline" size="sm" onClick={() => setStatus('idle')} className="mt-4">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs sm:text-sm p-3 rounded-sm"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs sm:text-sm p-3 rounded-sm"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs sm:text-sm p-3 rounded-sm"
                    placeholder="e.g. Suggestion for Kitchen Guide"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs sm:text-sm p-3 rounded-sm"
                    placeholder="How can we help you?"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-terracotta flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{feedback}</span>
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === 'loading'}
                  className="w-full py-3"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

