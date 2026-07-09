import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, Camera, X, Plus, Save } from 'lucide-react';
import { API_URL } from '../config';

const ALL_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
].sort(function(a, b) { return a.name.localeCompare(b.name); });

const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Professional Degree (MD, JD, etc.)',
  'Trade/Vocational Certificate',
  'Other'
];

const RELIGIONS = [
  'Christianity',
  'Islam',
  'Hinduism',
  'Buddhism',
  'Judaism',
  'Sikhism',
  'Other',
  'Prefer not to say'
];

interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  occupation: string;
  education: string;
  bio: string;
  image: string;
  photos: string[];
  interests: string[];
  looking_for: string;
  ideal_partner: string;
  religion: string;
  height: string;
}

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    bio: '',
    occupation: '',
    city: '',
    country: '',
    education: '',
    religion: '',
    height: '',
    looking_for: '',
    ideal_partner: ''
  });
  
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(function() {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async function() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL + '/api/profiles/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        const data: Profile = await response.json();
        
        // Parse location into city and country
        let city = '';
        let country = '';
        if (data.location) {
          const parts = data.location.split(', ');
          if (parts.length >= 2) {
            city = parts[0];
            country = parts[parts.length - 1];
          } else {
            city = data.location;
          }
        }
        
        setFormData({
          bio: data.bio || '',
          occupation: data.occupation || '',
          city: city,
          country: country,
          education: data.education || '',
          religion: data.religion || '',
          height: data.height || '',
          looking_for: data.looking_for || '',
          ideal_partner: data.ideal_partner || ''
        });
        
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = function(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(function(prev) {
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async function(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      // Build location string
      const location = formData.city && formData.country 
        ? formData.city + ', ' + formData.country 
        : formData.city || formData.country;

      const response = await fetch(API_URL + '/api/profiles/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          bio: formData.bio,
          occupation: formData.occupation,
          location: location,
          education: formData.education,
          religion: formData.religion,
          height: formData.height,
          looking_for: formData.looking_for,
          ideal_partner: formData.ideal_partner
        })
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setTimeout(function() {
          navigate('/my-profile');
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async function(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (photos.length >= 6) {
      setError('Maximum 6 photos allowed');
      return;
    }

    setUploadingPhoto(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch(API_URL + '/api/photos/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos(function(prev) {
          return [...prev, data.full_url || data.url];
        });
        setSuccess('Photo uploaded!');
        setTimeout(function() { setSuccess(''); }, 2000);
      } else {
        setError('Failed to upload photo');
      }
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async function(photoUrl: string, index: number) {
    // For now, just remove from UI
    // In a full implementation, you'd call an API to delete from R2
    setPhotos(function(prev) {
      return prev.filter(function(_, i) { return i !== index; });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={function() { navigate('/my-profile'); }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Photos Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-rose-500" />
              Photos
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              {photos.map(function(photo, index) {
                return (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={photo} alt={'Photo ' + (index + 1)} className="w-full h-full object-cover object-top" />
                    <button
                      type="button"
                      onClick={function() { handleRemovePhoto(photo, index); }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-rose-500 text-white text-xs px-2 py-1 rounded">Main</span>
                    )}
                  </div>
                );
              })}
              
              {photos.length < 6 && (
                <button
                  type="button"
                  onClick={function() { fileInputRef.current?.click(); }}
                  disabled={uploadingPhoto}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                >
                  {uploadingPhoto ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                  ) : (
                    <>
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-1">Add Photo</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-3">Upload up to 6 photos. First photo is your main profile photo.</p>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About You</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About Me</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder="e.g. Melbourne"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Select country</option>
                    {ALL_COUNTRIES.map(function(c) {
                      return <option key={c.code} value={c.name}>{c.flag} {c.name}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Select education</option>
                    {EDUCATION_LEVELS.map(function(level) {
                      return <option key={level} value={level}>{level}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Select religion</option>
                    {RELIGIONS.map(function(r) {
                      return <option key={r} value={r}>{r}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="e.g. 170"
                  min="100"
                  max="250"
                />
              </div>
            </div>
          </div>

          {/* Partner Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Partner Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Looking For</label>
                <select
                  name="looking_for"
                  value={formData.looking_for}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">Select preference</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Describe Your Ideal Partner</label>
                <textarea
                  name="ideal_partner"
                  value={formData.ideal_partner}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Describe the qualities you're looking for..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={function() { navigate('/my-profile'); }}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};
