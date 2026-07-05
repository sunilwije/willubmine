import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Eye, EyeOff, CheckCircle, Mail } from 'lucide-react';
import { API_URL } from '../config';

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
].sort((a, b) => a.name.localeCompare(b.name));

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

const HEIGHT_OPTIONS: { cm: number; label: string }[] = [];
for (let cm = 140; cm <= 210; cm++) {
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm / 2.54) % 12);
  HEIGHT_OPTIONS.push({ cm, label: `${cm} cm (${feet}'${inches}")` });
}

export const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    country: '',
    city: '',
    height: '',
    education: '',
    occupation: '',
    religion: '',
    bio: '',
    lookingFor: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.gender || !formData.dateOfBirth || !formData.country) {
      setError('Please fill in all required fields');
      return false;
    }
    setError('');
    return true;
  };

  const sendVerificationCode = async () => {
    setLoading(true);
    setError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    // For demo, show code in alert (in production, send via email API)
    setTimeout(() => {
      setCodeSent(true);
      setLoading(false);
      alert(`Your verification code is: ${code}\n\n(In production, this would be sent to ${formData.email})`);
    }, 1000);
  };

  const verifyCode = () => {
    if (verificationCode === generatedCode) {
      setCodeVerified(true);
      setError('');
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeVerified) {
      setError('Please verify your email first');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(registerData.detail || 'Registration failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', registerData.access_token);
      localStorage.setItem('user', JSON.stringify(registerData.user));
      setStep(5);
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Page
  if (step === 5) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to willubemin.com!</h2>
            <p className="text-gray-600 mb-6">Your profile has been created successfully.</p>
            <button onClick={() => navigate('/')} className="w-full py-3 px-4 bg-rose-500 text-white rounded-md font-medium hover:bg-rose-600">
              Start Browsing Profiles
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
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Create Your Profile</h2>
            <p className="mt-2 text-center text-gray-600">Join for FREE and find your soulmate</p>
            
            <div className="flex justify-center mt-6">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>1</div>
                <div className={`w-12 h-1 ${step >= 2 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>2</div>
                <div className={`w-12 h-1 ${step >= 3 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>3</div>
                <div className={`w-12 h-1 ${step >= 4 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>4</div>
              </div>
            </div>
          </div>

          {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your full name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="you@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md" placeholder="At least 6 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1">
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md" placeholder="Confirm your password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <button type="button" onClick={() => validateStep1() && setStep(2)} className="w-full py-3 px-4 bg-rose-500 text-white rounded-md font-medium hover:bg-rose-600">
                  Next: Personal Details
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">I am a *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Country *</label>
                  <select name="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your city" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Height</label>
                  <select name="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select height</option>
                    {HEIGHT_OPTIONS.map(h => <option key={h.cm} value={h.cm.toString()}>{h.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <select name="education" value={formData.education} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select education level</option>
                    {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">Back</button>
                  <button type="button" onClick={() => validateStep2() && setStep(3)} className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600">Next: About You</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About You</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. Software Engineer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Religion</label>
                  <select name="religion" value={formData.religion} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select religion (optional)</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Islam">Islam</option>
                    <option value="Hinduism">Hinduism</option>
                    <option value="Buddhism">Buddhism</option>
                    <option value="Judaism">Judaism</option>
                    <option value="Sikhism">Sikhism</option>
                    <option value="Other">Other</option>
                    <option value="None">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">I am looking for</label>
                  <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select preference</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">About Me</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Tell potential matches about yourself..." />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">Back</button>
                  <button type="button" onClick={() => setStep(4)} className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600">Next: Verify Email</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Your Email</h3>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-rose-500" />
                  </div>
                  <p className="text-gray-600 mb-2">We will send a 6-digit verification code to:</p>
                  <p className="font-semibold text-gray-900 mb-4">{formData.email}</p>
                </div>

                {!codeSent ? (
                  <button type="button" onClick={sendVerificationCode} disabled={loading} className="w-full py-3 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50">
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                ) : !codeVerified ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                      Verification code sent! Check your email.
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-center mb-2">Enter 6-digit code</label>
                      <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} className="block w-full px-3 py-3 border border-gray-300 rounded-md text-center text-2xl tracking-widest" placeholder="000000" />
                    </div>
                    
                    <button type="button" onClick={verifyCode} disabled={verificationCode.length !== 6} className="w-full py-3 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50">
                      Verify Code
                    </button>
                    
                    <button type="button" onClick={sendVerificationCode} className="w-full py-2 text-sm text-rose-500 hover:text-rose-600">
                      Resend Code
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Email verified successfully!
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50">
                      {loading ? 'Creating Profile...' : 'Create My Profile'}
                    </button>
                  </div>
                )}

                <button type="button" onClick={() => setStep(3)} className="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Back
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-rose-500 hover:text-rose-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
