import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserCheck, IdCard, UserPlus, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import SpecularButton from '../../components/ui/SpecularButton';
import BorderGlow from '../../components/ui/BorderGlow';

export default function Register() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      addToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    } else {
      setApiError(result.message || 'Registration failed.');
      addToast(result.message || 'Registration failed', 'error');
    }
  };

  return (
    <BorderGlow
      borderRadius={28}
      backgroundColor="rgba(15, 23, 42, 0.95)"
      glowColor="270 85 80"
      colors={['#c084fc', '#818cf8', '#f472b6']}
      glowRadius={45}
      edgeSensitivity={25}
      className="w-full shadow-2xl animate-fade-in"
    >
      <div className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-xs text-slate-400">
            Register your employee or administrator profile
          </p>
        </div>

        {apiError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Employee ID"
            type="text"
            name="employeeId"
            placeholder="e.g. EMP-2045"
            value={formData.employeeId}
            onChange={handleChange}
            error={errors.employeeId}
            icon={IdCard}
          />

          <Input
            label="Work Email"
            type="email"
            name="email"
            placeholder="employee@dayflow.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Account Role
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="employee">Employee</option>
                <option value="admin">Administrator</option>
                <option value="hr">HR Specialist</option>
              </select>
            </div>
          </div>

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

          <Input
            label="Confirm Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={Lock}
          />

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
              <UserPlus className="w-4 h-4 mr-2" />
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </SpecularButton>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </BorderGlow>
  );
}
