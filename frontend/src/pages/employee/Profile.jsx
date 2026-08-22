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
  Upload,
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

  // Fetch employee profile details from GET /api/employees/me
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
      addToast('Failed to load employee profile data.', 'error');
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

  // Handle local image file upload preview
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image size must be less than 5MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, avatar: reader.result }));
        addToast('Profile picture preview loaded!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile updates to PUT /api/employees/me
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

      addToast(result.message || 'Profile updated successfully!', 'success');
      setIsEditModalOpen(false);
    } catch {
      addToast('Error saving profile changes. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader text="Fetching profile details from GET /api/employees/me..." />;
  }

  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* 1. Profile Header */}
      <div className="relative glass-card rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl">
        {/* Banner Cover */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant="indigo" size="lg" dot>
              Active Employee
            </Badge>
          </div>
        </div>

        {/* Profile Header Main Content Bar */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            {/* Profile Picture */}
            <div className="relative group">
              <img
                src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                alt={profile.name}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-900"
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-2 right-2 p-2 rounded-xl bg-indigo-600 text-white shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
                title="Update Profile Picture"
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
                  <IdCard className="w-3.5 h-3.5 text-indigo-400" /> Employee ID: {profile.employeeId}
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Building className="w-3.5 h-3.5 text-purple-400" /> Department: {profile.department}
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
            className="shrink-0 shadow-lg shadow-indigo-600/30"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Grid Layout of Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Personal Information Card */}
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
            {/* Email */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-slate-200 font-medium truncate">{profile.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-slate-200 font-medium">{profile.phone || 'Not provided'}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Residential Address</p>
                <p className="text-slate-200 font-medium leading-snug">{profile.address || 'Not provided'}</p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</p>
                <p className="text-slate-200 font-medium">{formatDate(profile.dob)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Job Information Card */}
        <Card glass hoverable className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <CardTitle>Job Information</CardTitle>
            </div>
            <Badge variant="purple" size="sm">
              Official HR Record
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {/* Department */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Building className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Department</p>
                <p className="text-slate-200 font-medium">{profile.department}</p>
              </div>
            </div>

            {/* Designation */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Designation</p>
                <p className="text-slate-200 font-medium">{profile.designation}</p>
              </div>
            </div>

            {/* Joining Date */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Joining Date</p>
                <p className="text-slate-200 font-medium">{formatDate(profile.joiningDate)}</p>
              </div>
            </div>

            {/* Employment Type */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Employment Type</p>
                <p className="text-slate-200 font-medium">{profile.employmentType || 'Full-Time Permanent'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Salary Summary Card */}
      <Card glass hoverable>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Salary Summary</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Monthly compensation and allowances breakdown</p>
            </div>
          </div>
          <Badge variant="success" size="md" dot>
            Confidential
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Basic Salary */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Basic Salary</p>
              <p className="text-xl font-bold text-slate-100">{formatCurrency(profile.basicSalary)}</p>
            </div>

            {/* HRA */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">HRA</p>
              <p className="text-xl font-bold text-slate-100">{formatCurrency(profile.hra)}</p>
            </div>

            {/* Allowances */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Allowances</p>
              <p className="text-xl font-bold text-slate-100">{formatCurrency(profile.allowances)}</p>
            </div>

            {/* Net Salary */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 space-y-1 shadow-lg">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Net Monthly Salary</p>
              <p className="text-2xl font-black text-white">{formatCurrency(profile.netSalary)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Centered Edit Profile Modal with Sticky Footer */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Profile"
        subtitle="Update your phone number, residential address, or avatar picture"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-profile-form"
              variant="primary"
              isLoading={isSaving}
              icon={Check}
            >
              Save Profile Changes
            </Button>
          </>
        }
      >
        <form id="edit-profile-form" onSubmit={handleSaveProfile} className="space-y-4">
          {/* Editable: Phone */}
          <Input
            label="Phone Number"
            type="text"
            name="phone"
            placeholder="+1 (555) 234-5678"
            value={editForm.phone}
            onChange={handleEditChange}
            icon={Phone}
            helperText="Employee can update contact phone"
          />

          {/* Editable: Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Residential Address
            </label>
            <textarea
              name="address"
              rows={3}
              placeholder="Enter current residential address..."
              value={editForm.address}
              onChange={handleEditChange}
              className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Editable: Profile Picture URL / Upload */}
          <div className="space-y-2">
            <Input
              label="Profile Picture Image URL"
              type="url"
              name="avatar"
              placeholder="https://images.unsplash.com/..."
              value={editForm.avatar}
              onChange={handleEditChange}
              icon={Camera}
              helperText="Paste direct image link or upload a file below"
            />

            <div className="flex items-center gap-3 pt-1">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {editForm.avatar && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={editForm.avatar}
                alt="Avatar preview"
                className="w-12 h-12 rounded-xl object-cover border border-indigo-500 shadow-md"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200">Avatar Image Preview</p>
                <p className="text-[10px] text-slate-400 truncate">Ready to submit via PUT /api/employees/me</p>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
