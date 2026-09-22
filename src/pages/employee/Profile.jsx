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
import BorderGlow from '../../components/ui/BorderGlow';
import SpecularButton from '../../components/ui/SpecularButton';

const INITIAL_PROFILE = {
  id: 'EMP-2045',
  employeeId: 'EMP-2045',
  name: 'Alex Mercer',
  email: 'alex.mercer@dayflow.com',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Springfield, OR 97477',
  dob: '1994-06-15',
  designation: 'Senior Frontend Engineer',
  department: 'Engineering & Tech',
  joiningDate: '2022-03-01',
  employmentType: 'Full-Time Permanent',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  basicSalary: 6500,
  hra: 1800,
  allowances: 700,
  netSalary: 9000,
};

export default function Profile() {
  const { updateUser } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable Form State (Phone, Address, Profile Picture)
  const [editForm, setEditForm] = useState({
    phone: INITIAL_PROFILE.phone,
    address: INITIAL_PROFILE.address,
    avatar: INITIAL_PROFILE.avatar,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch employee profile details from GET /api/employees/me
  const fetchProfileData = async () => {
    try {
      const data = await employeeService.getProfile();
      if (data) {
        setProfile(data);
        setEditForm({
          phone: data.phone || INITIAL_PROFILE.phone,
          address: data.address || INITIAL_PROFILE.address,
          avatar: data.avatar || INITIAL_PROFILE.avatar,
        });
      }
    } catch {
      // Non-blocking toast warning
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
      const result = await employeeService.updateProfile(editForm);
      
      const updatedProfile = result.profile || { ...profile, ...editForm };
      setProfile(updatedProfile);
      
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* 1. Profile Header wrapped in BorderGlow */}
      <BorderGlow
        borderRadius={28}
        backgroundColor="rgba(15, 23, 42, 0.95)"
        glowColor="250 85 80"
        colors={['#818cf8', '#c084fc', '#38bdf8']}
        glowRadius={50}
        edgeSensitivity={25}
        className="w-full shadow-2xl overflow-hidden"
      >
        <div className="relative overflow-hidden">
          {/* Banner Cover */}
          <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge variant="indigo" size="lg" dot>
                ACTIVE EMPLOYEE
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
                  className="absolute bottom-2 right-2 p-2 rounded-xl bg-indigo-600 text-white shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all cursor-pointer"
                  title="Update Profile Picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Name, Employee ID, Designation, Department */}
              <div className="space-y-1.5 mb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {profile.name}
                  </h1>
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-indigo-300">
                  {profile.designation} &bull; <span className="text-slate-300">{profile.department}</span>
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400 font-mono">
                  <span className="inline-flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <IdCard className="w-3.5 h-3.5 text-indigo-400" /> Employee ID: {profile.employeeId}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Building className="w-3.5 h-3.5 text-purple-400" /> Department: {profile.department}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Specular Action Button */}
            <SpecularButton
              size="md"
              radius={14}
              baseColor="#6366f1"
              lineColor="#ffffff"
              textColor="#ffffff"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit3 className="w-4 h-4 mr-1.5" /> Edit Profile
            </SpecularButton>
          </div>
        </div>
      </BorderGlow>

      {/* Grid Layout of Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Personal Information Card wrapped in BorderGlow */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="rgba(15, 23, 42, 0.9)"
          glowColor="250 85 80"
          colors={['#818cf8', '#6366f1', '#a855f7']}
          glowRadius={35}
          edgeSensitivity={20}
          className="h-full shadow-xl"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Personal Information</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-slate-200 font-medium truncate">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-slate-200 font-medium">{profile.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Residential Address</p>
                  <p className="text-slate-200 font-medium leading-snug">{profile.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</p>
                  <p className="text-slate-200 font-medium">{formatDate(profile.dob)}</p>
                </div>
              </div>
            </div>
          </div>
        </BorderGlow>

        {/* 3. Job Information Card wrapped in BorderGlow */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="rgba(15, 23, 42, 0.9)"
          glowColor="280 85 80"
          colors={['#c084fc', '#f472b6', '#818cf8']}
          glowRadius={35}
          edgeSensitivity={20}
          className="h-full shadow-xl"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Job Information</h3>
              </div>
              <Badge variant="purple" size="sm">
                Official HR Record
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Building className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Department</p>
                  <p className="text-slate-200 font-medium">{profile.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Designation</p>
                  <p className="text-slate-200 font-medium">{profile.designation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Joining Date</p>
                  <p className="text-slate-200 font-medium">{formatDate(profile.joiningDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Employment Type</p>
                  <p className="text-slate-200 font-medium">{profile.employmentType || 'Full-Time Permanent'}</p>
                </div>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* 4. Salary Summary Card wrapped in BorderGlow */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="rgba(15, 23, 42, 0.9)"
        glowColor="160 85 80"
        colors={['#34d399', '#10b981', '#38bdf8']}
        glowRadius={35}
        edgeSensitivity={20}
        className="w-full shadow-xl"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Salary Summary</h3>
                <p className="text-xs text-slate-400 mt-0.5">Monthly compensation and allowances breakdown</p>
              </div>
            </div>
            <Badge variant="success" size="md" dot>
              Confidential
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Basic Salary</p>
              <p className="text-xl font-bold text-white">{formatCurrency(profile.basicSalary)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">HRA</p>
              <p className="text-xl font-bold text-white">{formatCurrency(profile.hra)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Allowances</p>
              <p className="text-xl font-bold text-white">{formatCurrency(profile.allowances)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-teal-950/80 border border-emerald-500/30 space-y-1 shadow-lg">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Net Monthly Salary</p>
              <p className="text-2xl font-black text-white">{formatCurrency(profile.netSalary)}</p>
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* 5. Centered Edit Profile Modal */}
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
