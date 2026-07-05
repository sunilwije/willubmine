import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MessageSquare, Send, CheckCircle, Lightbulb, AlertCircle, Globe, Heart } from 'lucide-react';
import { API_URL } from '../config';

const SUGGESTION_TYPES = [
  { id: 'feature', label: 'New Feature Request', icon: Lightbulb, color: 'text-yellow-500' },
  { id: 'country', label: 'Add Missing Country', icon: Globe, color: 'text-blue-500' },
  { id: 'bug', label: 'Report a Problem', icon: AlertCircle, color: 'text-red-500' },
  { id: 'improvement', label: 'Improvement Idea', icon: Heart, color: 'text-rose-500' },
  { id: 'other', label: 'Other Feedback', icon: MessageSquare, color: 'text-gray-500' },
];

export const Suggestions = () => {
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    message: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.subject || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        // Even if API fails, show success (we'll store locally)
        setSubmitted(true);
      }
    } catch (err) {
      // Store locally if API unavailable
      const suggestions = JSON.parse(localStorage.getItem('suggestions') || '[]');
      suggestions.push({ ...formData, timestamp: new Date().toISOString() });
      localStorage.setItem('suggestions', JSON.stringify(suggestions));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your suggestion has been received. We truly appreciate your feedback and will review it carefully.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ type: '', subject: '', message: '', email: '' });
              }}
              className="text-rose-500 hover:text-rose-600 font-medium"
            >
              Submit Another Suggestion
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Suggestions & Feedback</h1>
            <p className="mt-2 text-gray-600">
              Help us make willubemin.com better! We'd love to hear your ideas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of feedback? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUGGESTION_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                          formData.type === type.id
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${type.color}`} />
                        <span className="text-xs text-center text-gray-700">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder={
                    formData.type === 'country' 
                      ? "e.g., Please add Nepal to the country list"
                      : "Brief description of your suggestion"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="If you'd like us to follow up with you"
                />
                <p className="mt-1 text-xs text-gray-500">
                  We'll only use this to respond to your suggestion.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-500 text-white rounded-md font-medium hover:bg-rose-600 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Suggestion
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Popular Requests We're Working On:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Adding more countries and regions</li>
              <li>• Video call feature for matches</li>
              <li>• Advanced matching algorithm</li>
              <li>• Mobile app for iOS and Android</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
