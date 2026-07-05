import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileModal } from '../components/ProfileModal';
import { profiles as mockProfiles, Profile } from '../data/profiles';
import { Heart, Globe, Shield, Users, Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const COUNTRIES = [
  { code: '', name: 'All Countries', flag: '🌍' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
];

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [ageRange, setAgeRange] = useState('any');
  const [countryFilter, setCountryFilter] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profilesData, setProfilesData] = useState<Profile[]>(mockProfiles);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/profiles`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProfilesData(data);
          }
        }
      } catch (error) {
        console.log('Using mock data');
      }
    };
    fetchProfiles();
  }, []);

  const handleSearch = () => {
    setSearched(true);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const getAgeRange = (range: string): [number, number] => {
    switch (range) {
      case '18-25': return [18, 25];
      case '26-35': return [26, 35];
      case '36-45': return [36, 45];
      case '46+': return [46, 100];
      default: return [18, 100];
    }
  };

  const filteredProfiles = useMemo(() => {
    const [minAge, maxAge] = getAgeRange(ageRange);
    return profilesData.filter((profile) => {
      const matchesSearch = searchTerm === '' ||
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGender = genderFilter === 'All' || profile.gender === genderFilter;
      const matchesAge = profile.age >= minAge && profile.age <= maxAge;
      const matchesCountry = countryFilter === '' || 
        profile.location.toLowerCase().includes(countryFilter.toLowerCase());
      return matchesSearch && matchesGender && matchesAge && matchesCountry;
    });
  }, [profilesData, searchTerm, genderFilter, ageRange, countryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="relative bg-gradient-to-br from-rose-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find your soulmate
                <span className="block text-rose-500">without a price tag</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Marriage is a fundamental right. We believe finding love should not cost a fortune. 
                Join the world first 100% free matrimonial platform for youth worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#browse" className="bg-rose-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors">
                  Start Browsing
                </a>
                <Link to="/register" className="bg-rose-100 text-rose-600 px-8 py-3 rounded-lg font-medium hover:bg-rose-200 transition-colors">
                  Create Profile
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=500&fit=crop" alt="Happy couple" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Free Forever</h3>
              <p className="text-gray-600">No hidden charges, no premium features. Everything is free.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Community</h3>
              <p className="text-gray-600">Connect with singles from around the world.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe and Secure</h3>
              <p className="text-gray-600">Verified profiles and secure messaging.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="browse" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Search Profiles</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="grid md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.name === 'All Countries' ? '' : country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Looking for</label>
                <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="any">Any Age</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46+">46+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Name, location..." className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex items-end">
                <button onClick={handleSearch} className="w-full bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 flex items-center justify-center">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : filteredProfiles.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-4">Found {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} onClick={() => setSelectedProfile(profile)} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matching Profiles Found</h3>
              <p className="text-gray-500 mb-6">
                {searched ? "We could not find any profiles matching your criteria. Try adjusting your filters." : "Click Search to find profiles matching your preferences."}
              </p>
              <Link to="/register" className="inline-block bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600">
                Be the First to Register!
              </Link>
            </div>
          )}
        </div>
      </section>

      {selectedProfile && (
        <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}

      <Footer />
    </div>
  );
};
