import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Eye, EyeOff, CheckCircle, Mail, Camera, X, Plus, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

const ALL_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'Congo (DRC)', flag: '🇨🇩' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  
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
    lookingFor: '',
    idealPartner: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    // Reset email check when email changes
    if (name === 'email') {
      setEmailChecked(false);
      setEmailAvailable(false);
    }
  };

  const checkEmailAvailability = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    setCheckingEmail(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();
      setEmailChecked(true);
      
      if (data.exists) {
        setEmailAvailable(false);
        setError('This email is already registered. Please login instead.');
        return false;
      } else {
        setEmailAvailable(true);
        return true;
      }
    } catch (err) {
      // If API fails, allow to continue (will catch at registration)
      setEmailChecked(true);
      setEmailAvailable(true);
      return true;
    } finally {
      setCheckingEmail(false);
    }
  };

  const validateStep1 = async () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
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

    // Check email availability
    const isAvailable = await checkEmailAvailability();
    if (!isAvailable) {
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 6 - photos.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newPhotos = filesToAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPhotos([...photos, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index].preview);
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleNextStep1 = async () => {
    const isValid = await validateStep1();
    if (isValid) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (photos.length === 0) {
      setError('Please upload at least one photo');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Step 1: Register user
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
        if (registerData.detail === 'Email already registered') {
          setError('This email is already registered. Please login instead.');
        } else {
          setError(registerData.detail || 'Registration failed');
        }
        setLoading(false);
        return;
      }

      const token = registerData.access_token;

      // Step 2: Create profile
      const countryName = ALL_COUNTRIES.find(c => c.code === formData.country)?.name || formData.country;
      const location = formData.city ? `${formData.city}, ${countryName}` : countryName;
      
      const profileResponse = await fetch(`${API_URL}/api/profiles`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          gender: formData.gender,
          age: calculateAge(formData.dateOfBirth),
          location: location,
          height: formData.height,
          education: formData.education,
          occupation: formData.occupation,
          religion: formData.religion,
          bio: formData.bio || `Hi, I'm ${formData.name}. Looking forward to meeting new people!`,
          looking_for: formData.lookingFor,
          ideal_partner: formData.idealPartner,
          interests: []
        })
      });

      if (!profileResponse.ok) {
        console.error('Profile creation failed');
      }

      // Step 3: Upload photos
      setUploadingPhotos(true);
      for (const photo of photos) {
        const photoFormData = new FormData();
        photoFormData.append('file', photo.file);

        await fetch(`${API_URL}/api/photos/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: photoFormData
        });
      }
      setUploadingPhotos(false);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(registerData.user));
      setStep(6); // Success step
    } catch (err) {
      console.error('Registration error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
      setUploadingPhotos(false);
    }
  };

  // Success Page (Step 6)
  if (step === 6) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to willubmine.com!</h2>
            <p className="text-gray-600 mb-6">Your profile has been created successfully with {photos.length} photo{photos.length > 1 ? 's' : ''}.</p>
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
                {[1, 2, 3, 4, 5].map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>{s}</div>
                    {i < 4 && <div className={`w-8 h-1 ${step > s ? 'bg-rose-500' : 'bg-gray-200'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-2 text-xs text-gray-500">
              <span className="w-10 text-center">Account</span>
              <span className="w-8"></span>
              <span className="w-10 text-center">Personal</span>
              <span className="w-8"></span>
              <span className="w-10 text-center">About</span>
              <span className="w-8"></span>
              <span className="w-10 text-center">Verify</span>
              <span className="w-8"></span>
              <span className="w-10 text-center">Photos</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p>{error}</p>
                {error.includes('already registered') && (
                  <Link to="/login" className="text-rose-600 font-medium hover:underline">
                    Click here to login →
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your full name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                        emailChecked 
                          ? emailAvailable 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="you@example.com" 
                    />
                    {emailChecked && emailAvailable && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {emailChecked && emailAvailable && (
                    <p className="mt-1 text-sm text-green-600">✓ Email is available</p>
                  )}
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

                <button 
                  type="button" 
                  onClick={handleNextStep1} 
                  disabled={checkingEmail}
                  className="w-full py-3 px-4 bg-rose-500 text-white rounded-md font-medium hover:bg-rose-600 disabled:opacity-50"
                >
                  {checkingEmail ? 'Checking email...' : 'Next: Personal Details'}
                </button>
              </div>
            )}

            {/* Step 2: Personal Details */}
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
                  <label className="block text-sm font-medium text-gray-700">Looking for *</label>
                  <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select preference</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Describe your ideal partner</label>
                  <textarea name="idealPartner" value={formData.idealPartner} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Kind, intelligent, family-oriented, loves adventure..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Country *</label>
                  <select name="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select country</option>
                    {ALL_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
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

            {/* Step 3: About You */}
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
                  <label className="block text-sm font-medium text-gray-700">About Me</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Tell potential matches about yourself..." />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">Back</button>
                  <button type="button" onClick={() => setStep(4)} className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600">Next: Verify Email</button>
                </div>
              </div>
            )}

            {/* Step 4: Email Verification */}
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
                    
                    <button type="button" onClick={() => setStep(5)} className="w-full py-3 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600">
                      Next: Upload Photos
                    </button>
                  </div>
                )}

                <button type="button" onClick={() => setStep(3)} className="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Back
                </button>
              </div>
            )}

            {/* Step 5: Photo Upload */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Photos</h3>
                
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-rose-500" />
                  </div>
                  <p className="text-gray-600">Upload at least 1 photo (maximum 6)</p>
                  <p className="text-sm text-gray-500">Photos help you get more matches!</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img src={photo.preview} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-rose-500 text-white text-xs px-2 py-1 rounded">Main</span>
                      )}
                    </div>
                  ))}
                  
                  {photos.length < 6 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-1">Add Photo</span>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(4)} className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || photos.length === 0}
                    className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50"
                  >
                    {loading ? (uploadingPhotos ? 'Uploading Photos...' : 'Creating Profile...') : 'Create My Profile'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel Registration
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
