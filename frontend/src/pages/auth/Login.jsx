import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldAlert, Sparkles, UserCheck, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');

    const result = await login(formData);
    setIsLoading(false);

    if (result.success) {
      addToast(`Welcome back, ${result.user.name}!`, 'success');
      const userRole = result.user.role || formData.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'hr') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } else {
      setApiError(result.message || 'Invalid email or password credentials.');
      addToast(result.message || 'Login failed', 'error');
    }
  };

  const handleQuickDemo = (roleType) => {
    let demoCredentials;
    if (roleType === 'admin') {
      demoCredentials = { email: 'admin@dayflow.com', password: 'password123', role: 'admin' };
    } else if (roleType === 'hr') {
      demoCredentials = { email: 'hr@dayflow.com', password: 'password123', role: 'hr' };
    } else {
      demoCredentials = { email: 'alex@dayflow.com', password: 'password123', role: 'employee' };
    }
    
    setFormData(demoCredentials);
    setErrors({});
    setApiError('');
  };

  return (
    <Card glass className="w-full shadow-2xl border-indigo-500/20 animate-fade-in">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-black tracking-tight">
          Sign In to Dayflow
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your workplace portal
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Demo Selector */}
        <div className="p-3.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Instant Test Login Presets
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('employee')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all border flex items-center justify-center gap-1 ${
                formData.role === 'employee'
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3 h-3" /> Employee
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('hr')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all border flex items-center justify-center gap-1 ${
                formData.role === 'hr'
                  ? 'bg-teal-600 text-white border-teal-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <UserCog className="w-3 h-3" /> HR Manager
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all border flex items-center justify-center gap-1 ${
                formData.role === 'admin'
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        {apiError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
              <span>Remember device</span>
            </label>
            <Link
              to="/forgot-password"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
            icon={LogIn}
          >
            Sign In to Portal
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Don't have an account registered yet?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            Register Employee
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
