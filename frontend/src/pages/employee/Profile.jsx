import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building,
  Clock,
  DollarSign,
  Edit3,
  Check,
  IdCard,
  ShieldCheck,
  Sparkles,
  Camera,
  Layers,
} from 'lucide-react';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Loader from '../../components/common/Loader';

export default function Profile() {
  const { updateUser } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable Form State (Phone, Address, Profile Picture)
  const [editForm, setEditForm] = useState({
    phone: '',
    address: '',
    avatar: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // API integration: GET /api/employees/me
      const data = await employeeService.getProfile();
      setProfile(data);
      setEditForm({
        phone: data.phone || '',
        address: data.address || '',
        avatar: data.avatar || '',
      });
    } catch {
      addToast('Failed to load profile details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // API integration: PUT /api/employees/me
      const result = await employeeService.updateProfile(editForm);
      
      const updatedProfile = result.profile || { ...profile, ...editForm };
      setProfile(updatedProfile);
      
      // Sync auth context state
      updateUser({
        avatar: editForm.avatar,
        phone: editForm.phone,
        address: editForm.address,
      });

      addToast(result.message || 'Profile details updated successfully!', 'success');
      setIsEditModalOpen(false);
    } catch {
      addToast('Error saving profile changes. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading employee profile..." />;
  }

  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Profile Header Hero Banner */}
      <div className="relative glass-card rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl">
        {/* Banner Gradient Cover */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant="indigo" size="lg" dot>
              Active Employee
            </Badge>
          </div>
        </div>

        {/* Header Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            {/* Avatar Picture with Edit Overlay */}
            <div className="relative group">
              <img
                src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                alt={profile.name}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-900"
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-2 right-2 p-2 rounded-xl bg-indigo-600 text-white shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
                title="Change Picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Name, Employee ID, Designation, Department */}
            <div className="space-y-1.5 mb-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                  {profile.name}
                </h1>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-indigo-300">
                {profile.designation} &bull; <span className="text-slate-300">{profile.department}</span>
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400 font-mono">
                <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                  <IdCard className="w-3.5 h-3.5 text-indigo-400" /> ID: {profile.employeeId}
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Building className="w-3.5 h-3.5 text-purple-400" /> {profile.department}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="primary"
            size="md"
            icon={Edit3}
            className="shrink-0"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Grid Layout of Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Personal Information */}
        <Card glass hoverable className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <User className="w-5 h-5" />
              </div>
              <CardTitle>Personal Information</CardTitle>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-slate-200 font-medium truncate">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-slate-200 font-medium">{profile.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Address</p>
                <p className="text-slate-200 font-medium leading-snug">{profile.address || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</p>
                <p className="text-slate-200 font-medium">{formatDate(profile.dob)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Job Information */}
        <Card glass hoverable className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <CardTitle>Job Information</CardTitle>
            </div>
            <Badge variant="purple" size="sm">
              Official Record
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Building className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Department</p>
                <p className="text-slate-200 font-medium">{profile.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Designation</p>
                <p className="text-slate-200 font-medium">{profile.designation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Joining Date</p>
                <p className="text-slate-200 font-medium">{formatDate(profile.joiningDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Employment Type</p>
                <p className="text-slate-200 font-medium">{profile.employmentType || 'Full-Time'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card 3: Salary Summary */}
      <Card glass hoverable>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Salary Summary</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Monthly compensation breakdown</p>
            </div>
          </div>
          <Badge variant="success" size="md" dot>
            Confidential
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Basic Salary</p>
              <p className="text-xl font-bold text-slate-100">{formatCurrency(profile.basicSalary)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">HRA</p>
              <p className="text-xl font-bold text-slate-100">{formatCurrency(profile.hra)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Allowances</p>
              <p className="text-xl font-bold text-slate-100">{formatCurrency(profile.allowances)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 space-y-1 shadow-lg">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Net Monthly Salary</p>
              <p className="text-2xl font-black text-white">{formatCurrency(profile.netSalary)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Modal (Employee can edit: Phone, Address, Profile Picture) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Profile"
        subtitle="Update your phone, address, and profile photo avatar"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Phone Number"
            type="text"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={editForm.phone}
            onChange={handleEditChange}
            icon={Phone}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Address
            </label>
            <textarea
              name="address"
              rows={3}
              placeholder="Enter your current residential address..."
              value={editForm.address}
              onChange={handleEditChange}
              className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <Input
            label="Profile Picture URL"
            type="url"
            name="avatar"
            placeholder="https://images.unsplash.com/..."
            value={editForm.avatar}
            onChange={handleEditChange}
            icon={Camera}
            helperText="Enter a direct image link for your avatar picture"
          />

          {editForm.avatar && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={editForm.avatar}
                alt="Avatar preview"
                className="w-10 h-10 rounded-full object-cover border border-indigo-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                }}
              />
              <span className="text-xs text-slate-400 font-medium">Avatar Image Preview</span>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800/80">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              icon={Check}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
