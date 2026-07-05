import React, { useState } from 'react';
import { Header } from '../components/Header';
import { BioEditor } from '../components/BioEditor';
import { useNavigate } from 'react-router-dom';

export const CreateProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    height: '',
    religion: '',
    education: '',
    occupation: '',
    maritalStatus: '',
    bio: '',
  });

  const handleBioSave = (newBio: string) => {
    setFormData({ ...formData, bio: newBio });
    // Simulate saving to backend
    setTimeout(() => {
      navigate('/chat'); // Redirect to chat/dashboard after creation
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Profile</h1>
          <p className="text-gray-500 mt-2">Step {step} of 3: {step === 1 ? 'Basics' : step === 2 ? 'Details' : 'About You'}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-rose-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Alex Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                placeholder="City, Country"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.age || !formData.gender || !formData.location}
              className="w-full bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              Next: Personal Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g. 5'10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Christian, Hindu, Muslim, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Bachelors in Arts"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors"
              >
                Next: Write Bio
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <BioEditor 
              initialBio={formData.bio} 
              onSave={handleBioSave} 
            />
            <button
              onClick={() => setStep(2)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
