import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Car,
  Settings,
  LogOut,
  Edit2,
  ChevronRight,
  CreditCard,
  Bell,
  Shield,
  Heart,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { api } from '../lib/api';
import { cars as carsData } from '../data/cars';

type TabType = 'bookings' | 'favorites' | 'payments' | 'notifications' | 'security' | 'settings';

export const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated, refreshUser } = useAuth();
  const { favorites, isLoading: favoritesLoading, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('bookings');

  // Password state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState({
    email: user?.notifyEmail ?? true,
    push: user?.notifyPush ?? true,
    sms: user?.notifySms ?? false,
    marketing: user?.notifyMarketing ?? false,
  });
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Profile settings state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Preferences state
  const [language, setLanguage] = useState(user?.language || 'en');
  const [currency, setCurrency] = useState(user?.currency || 'THB');
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  // Delete account state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update state when user changes
  useEffect(() => {
    if (user) {
      setNotificationSettings({
        email: user.notifyEmail ?? true,
        push: user.notifyPush ?? true,
        sms: user.notifySms ?? false,
        marketing: user.notifyMarketing ?? false,
      });
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
      setLanguage(user.language || 'en');
      setCurrency(user.currency || 'THB');
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Handle notification toggle
  const handleNotificationToggle = async (key: keyof typeof notificationSettings) => {
    const newValue = !notificationSettings[key];
    setNotificationSettings(prev => ({ ...prev, [key]: newValue }));
    setNotificationsLoading(true);

    const updateData = {
      notifyEmail: key === 'email' ? newValue : notificationSettings.email,
      notifyPush: key === 'push' ? newValue : notificationSettings.push,
      notifySms: key === 'sms' ? newValue : notificationSettings.sms,
      notifyMarketing: key === 'marketing' ? newValue : notificationSettings.marketing,
    };

    const response = await api.user.updateNotifications(updateData);
    if (response.error) {
      // Revert on error
      setNotificationSettings(prev => ({ ...prev, [key]: !newValue }));
    }
    setNotificationsLoading(false);
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    const response = await api.user.changePassword({
      currentPassword,
      newPassword,
    });

    if (response.error) {
      setPasswordError(response.error);
    } else {
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    }
    setPasswordLoading(false);
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    const response = await api.user.updateProfile(profileForm);
    if (response.error) {
      setProfileError(response.error);
    } else {
      setProfileSuccess('Profile updated successfully');
      if (refreshUser) {
        await refreshUser();
      }
    }
    setProfileLoading(false);
  };

  // Handle preferences update
  const handlePreferencesUpdate = async () => {
    setPreferencesLoading(true);
    await api.user.updateSettings({ language, currency });
    if (refreshUser) {
      await refreshUser();
    }
    setPreferencesLoading(false);
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const response = await api.user.deleteAccount();
    if (!response.error) {
      await logout();
      navigate('/');
    }
    setDeleteLoading(false);
  };

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-3">Sign in to your account</h1>
          <p className="text-gray-500 mb-8">Access your bookings and preferences</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-in"
              className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/get-started"
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems: { icon: React.ElementType; label: string; tab: TabType; count?: number }[] = [
    { icon: Car, label: 'My Bookings', tab: 'bookings', count: 0 },
    { icon: Heart, label: 'Favorites', tab: 'favorites', count: favorites.length },
    { icon: CreditCard, label: 'Payment Methods', tab: 'payments' },
    { icon: Bell, label: 'Notifications', tab: 'notifications' },
    { icon: Shield, label: 'Security', tab: 'security' },
    { icon: Settings, label: 'Settings', tab: 'settings' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return (
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-gray-900">My Bookings</h3>
              <Link
                to="/cars"
                className="text-gray-900 hover:text-gray-600 transition-colors text-sm font-medium"
              >
                Browse Cars
              </Link>
            </div>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-light text-gray-900 mb-2">No bookings yet</h4>
              <p className="text-gray-500 mb-6">You haven't made any bookings yet</p>
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Car className="w-5 h-5" />
                Browse Cars
              </Link>
            </div>
          </div>
        );

      case 'favorites':
        const favoriteCars = carsData.filter(car => favorites.includes(car.id));
        return (
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-gray-900">Favorites ({favorites.length})</h3>
            </div>
            {favoritesLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-xl font-light text-gray-900 mb-2">No favorites yet</h4>
                <p className="text-gray-500 mb-6">Save your favorite cars for quick access</p>
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Explore Cars
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                    <Link to={`/cars/${car.id}`} className="flex items-center gap-4 flex-1">
                      <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{car.brand} {car.model}</p>
                        <p className="text-sm text-gray-500">{car.year} • ฿{car.pricePerDay.toLocaleString()}/day</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'payments':
        return (
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-gray-900">Payment Methods</h3>
              <button className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
            <div className="space-y-4">
              {/* Example saved card */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/25</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Default</span>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add new card button */}
              <button className="w-full bg-white rounded-xl p-4 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700">
                <Plus className="w-5 h-5" />
                <span>Add New Card</span>
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-light text-gray-900 mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'email' as const, label: 'Email Notifications', desc: 'Receive booking confirmations and updates via email' },
                { key: 'push' as const, label: 'Push Notifications', desc: 'Get instant updates on your device' },
                { key: 'sms' as const, label: 'SMS Notifications', desc: 'Receive text messages for important updates' },
                { key: 'marketing' as const, label: 'Marketing Emails', desc: 'Receive offers, promotions and news' },
              ].map((item) => (
                <div key={item.key} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(item.key)}
                    disabled={notificationsLoading}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notificationSettings[item.key]
                        ? 'bg-gray-900'
                        : 'bg-gray-200'
                    } ${notificationsLoading ? 'opacity-50' : ''}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notificationSettings[item.key]
                          ? 'translate-x-7'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-light text-gray-900 mb-6">Security Settings</h3>
            <div className="space-y-6">
              {/* Change Password */}
              <form onSubmit={handlePasswordChange} className="bg-white rounded-xl p-6 border border-gray-100">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>

                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="text-sm">{passwordSuccess}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent pr-12"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent pr-12"
                        placeholder="Enter new password (min 6 characters)"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>

              {/* Two-Factor Auth */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-colors text-sm font-medium">
                    Enable
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900 font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on macOS • Phuket, Thailand</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                  </div>
                </div>
                <button className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium">
                  Sign out all other sessions
                </button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-light text-gray-900 mb-6">Account Settings</h3>
            <div className="space-y-6">
              {/* Profile Information */}
              <form onSubmit={handleProfileUpdate} className="bg-white rounded-xl p-6 border border-gray-100">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h4>

                {profileError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{profileError}</span>
                  </div>
                )}

                {profileSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="text-sm">{profileSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="+66 XX XXX XXXX"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </form>

              {/* Language & Currency */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="th">Thai</option>
                      <option value="ru">Russian</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="THB">THB (฿)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="RUB">RUB (₽)</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handlePreferencesUpdate}
                  disabled={preferencesLoading}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {preferencesLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Preferences
                </button>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl p-6 border border-red-100">
                <h4 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-red-600 font-medium">Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Yes, Delete My Account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 bg-gray-50">
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl lg:text-4xl text-gray-900 mb-2" style={{ fontWeight: 200 }}>
              My Account
            </h1>
            <p className="text-gray-500">Manage your bookings and settings</p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-3xl lg:text-4xl font-light text-white">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-4">
                    {user?.firstName} {user?.lastName}
                  </h2>

                  <div className="flex flex-col gap-2 text-gray-500">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Member since {memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-light text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-light text-gray-900">{favorites.length}</div>
                    <div className="text-sm text-gray-500">Favorites</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Menu */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-50 rounded-2xl p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;
                    return (
                      <button
                        key={item.tab}
                        onClick={() => setActiveTab(item.tab)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors group ${
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-white hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-white/10'
                              : 'bg-white group-hover:bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.count !== undefined && item.count > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-sm ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {item.count}
                            </span>
                          )}
                          <ChevronRight className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                          }`} />
                        </div>
                      </button>
                    );
                  })}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </nav>
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2"
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
