import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import authService from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export default function ForgotPassword() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid work email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await authService.forgotPassword(email);
      setIsLoading(false);
      setIsSubmitted(true);
      addToast(res.message || 'Reset link sent!', 'success');
    } catch {
      setIsLoading(false);
      setError('Failed to trigger reset email. Please try again.');
    }
  };

  return (
    <Card glass className="w-full shadow-2xl border-indigo-500/20 animate-fade-in">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-black tracking-tight">
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your email and we will send instructions to recover your password
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isSubmitted ? (
          <div className="text-center space-y-4 py-4 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Link Dispatched!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              We sent a password recovery link to <strong className="text-indigo-300">{email}</strong>.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              size="sm"
            >
              Send Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="alex@dayflow.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
              icon={Mail}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              icon={Send}
            >
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
