import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldAlert, Sparkles, UserCheck, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import SpecularButton from '../../components/ui/SpecularButton';
import BorderGlow from '../../components/ui/BorderGlow';

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
    <BorderGlow
      borderRadius={28}
      backgroundColor="rgba(15, 23, 42, 0.95)"
      glowColor="250 85 80"
      colors={['#818cf8', '#c084fc', '#38bdf8']}
      glowRadius={45}
      edgeSensitivity={25}
      className="w-full shadow-2xl animate-fade-in"
    >
      <div className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to Dayflow
          </h2>
          <p className="text-xs text-slate-400">
            Enter your credentials to access your workplace portal
          </p>
        </div>

        {/* Quick Demo Selector */}
        <div className="p-3.5 bg-indigo-950/60 rounded-2xl border border-indigo-500/30 text-center space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Instant Test Login Presets
          </p>
          <div className="grid grid-cols-3 gap-2">
            <SpecularButton
              size="sm"
              radius={10}
              baseColor={formData.role === 'employee' ? '#4f46e5' : '#1e293b'}
              lineColor={formData.role === 'employee' ? '#a5b4fc' : '#64748b'}
              textColor="#ffffff"
              onClick={() => handleQuickDemo('employee')}
            >
              <UserCheck className="w-3 h-3 mr-1" /> Employee
            </SpecularButton>

            <SpecularButton
              size="sm"
              radius={10}
              baseColor={formData.role === 'hr' ? '#0d9488' : '#1e293b'}
              lineColor={formData.role === 'hr' ? '#5eead4' : '#64748b'}
              textColor="#ffffff"
              onClick={() => handleQuickDemo('hr')}
            >
              <UserCog className="w-3 h-3 mr-1" /> HR Manager
            </SpecularButton>

            <SpecularButton
              size="sm"
              radius={10}
              baseColor={formData.role === 'admin' ? '#7c3aed' : '#1e293b'}
              lineColor={formData.role === 'admin' ? '#c084fc' : '#64748b'}
              textColor="#ffffff"
              onClick={() => handleQuickDemo('admin')}
            >
              <ShieldCheck className="w-3 h-3 mr-1" /> Admin
            </SpecularButton>
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

          <div className="pt-2">
            <SpecularButton
              type="submit"
              size="lg"
              radius={16}
              baseColor="#6366f1"
              lineColor="#ffffff"
              textColor="#ffffff"
              intensity={1.2}
              disabled={isLoading}
              className="w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? 'Signing In...' : 'Sign In to Portal'}
            </SpecularButton>
          </div>
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
      </div>
    </BorderGlow>
  );
}
