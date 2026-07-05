import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ConsentDocument } from '../components/verification/ConsentDocument';
import { VerificationReport } from '../components/verification/VerificationReport';
import { verificationService, VerificationReport as ReportType } from '../services/verification';
import { profiles } from '../data/profiles';
import { Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type VerificationState = 'init' | 'requesting' | 'consent_pending' | 'verifying' | 'complete';

export const VerifyMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<VerificationState>('init');
  const [report, setReport] = useState<ReportType | null>(null);
  
  const profile = profiles.find(p => p.id === id);

  useEffect(() => {
    if (!profile) {
      // Handle invalid profile
      navigate('/');
    }
  }, [profile, navigate]);

  if (!profile) return null;

  const handleRequestVerification = async () => {
    setState('requesting');
    // Simulate API call to create request
    setTimeout(() => {
      setState('consent_pending');
    }, 1000);
  };

  const handleSignConsent = async () => {
    // In a real app, this would be done by the OTHER user
    // Here we simulate the target user signing it immediately for the demo
    await verificationService.requestConsent(profile.id);
    setState('verifying');
    
    const result = await verificationService.performVerification(profile);
    setReport(result);
    setState('complete');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← Back to Profile
          </button>
          
          <div className="flex items-center gap-4">
            <img 
              src={profile.imageUrl} 
              alt={profile.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verify {profile.name}</h1>
              <p className="text-gray-600">AI-Powered Background & Identity Check</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div className={`absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500`}
            style={{ 
              width: state === 'init' ? '0%' : 
                     state === 'requesting' ? '25%' :
                     state === 'consent_pending' ? '50%' :
                     state === 'verifying' ? '75%' : '100%'
            }}
          ></div>
          
          {['Request', 'Consent', 'Analysis', 'Report'].map((step, idx) => {
            const isActive = idx <= ['init', 'requesting', 'consent_pending', 'verifying', 'complete'].indexOf(state) - 1;
            const isCurrent = idx === ['init', 'requesting', 'consent_pending', 'verifying', 'complete'].indexOf(state) - 1;
            
            return (
              <div key={step} className="flex flex-col items-center bg-gray-50 px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors
                  ${isActive || isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {idx + 1}
                </div>
                <span className={`text-xs font-medium ${isActive || isCurrent ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
          {state === 'init' && (
            <div className="text-center max-w-lg mx-auto py-8">
              <Shield className="w-20 h-20 text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trust, but Verify</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Request a comprehensive background check for {profile.name}. 
                This process requires their digital consent and uses AI to verify public records.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-xl text-left mb-8">
                <h3 className="font-semibold text-blue-900 mb-3">What we verify:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Identity & Age Confirmation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Employment & Career History
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Marital Status Records
                  </li>
                </ul>
              </div>

              <button
                onClick={handleRequestVerification}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                Start Verification Request <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {state === 'requesting' && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
              <h3 className="text-xl font-semibold text-gray-900">Sending Request...</h3>
              <p className="text-gray-500">Notifying {profile.name} for consent.</p>
            </div>
          )}

          {state === 'consent_pending' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
                  <AlertCircle className="w-4 h-4" /> Waiting for Consent
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Consent Required</h2>
                <p className="text-gray-600 mt-2">
                  For this demo, you can act as {profile.name} and sign the consent form below.
                </p>
              </div>
              
              <ConsentDocument 
                targetName={profile.name}
                requesterName="You"
                onSign={handleSignConsent}
                isSigned={false}
              />
            </div>
          )}

          {state === 'verifying' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping"></div>
                <div className="relative bg-white p-4 rounded-full shadow-lg">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Agent Working...</h3>
              <div className="space-y-2 text-gray-500 text-sm">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Scanning public records...
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  Cross-referencing employment data...
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                >
                  Analyzing social footprint...
                </motion.p>
              </div>
            </div>
          )}

          {state === 'complete' && report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VerificationReport report={report} targetName={profile.name} />
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => navigate('/chat')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Return to Chat
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
