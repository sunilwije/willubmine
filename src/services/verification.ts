import { Profile } from '../data/profiles';

export interface VerificationRequest {
  requesterId: string;
  targetProfileId: string;
  consentObtained: boolean;
  consentTimestamp?: string;
}

export interface VerificationReport {
  id: string;
  profileId: string;
  timestamp: string;
  overallScore: number; // 0-100
  status: 'verified' | 'pending' | 'failed';
  checks: {
    identity: {
      status: 'pass' | 'fail' | 'warn';
      details: string;
    };
    employment: {
      status: 'pass' | 'fail' | 'warn';
      details: string;
    };
    maritalStatus: {
      status: 'pass' | 'fail' | 'warn';
      details: string;
    };
    criminalRecord: {
      status: 'pass' | 'fail' | 'warn';
      details: string;
    };
  };
  aiAnalysis: string;
}

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const verificationService = {
  // Simulate requesting consent from the target user
  requestConsent: async (targetProfileId: string): Promise<boolean> => {
    await delay(1500); // Simulate network request
    // In a real app, this would trigger a notification to the target user
    // For MVP, we'll assume the target user "approves" immediately or via a simulated modal
    return true;
  },

  // Simulate performing the background check
  performVerification: async (profile: Profile): Promise<VerificationReport> => {
    await delay(3000); // Simulate AI agent searching public records

    // Generate a semi-random report based on the profile
    const isGoodProfile = Math.random() > 0.1; // 90% chance of good profile for demo

    return {
      id: `rep_${Date.now()}`,
      profileId: profile.id,
      timestamp: new Date().toISOString(),
      overallScore: isGoodProfile ? 95 : 65,
      status: 'verified',
      checks: {
        identity: {
          status: 'pass',
          details: `Name matches public records in ${profile.location}.`
        },
        employment: {
          status: isGoodProfile ? 'pass' : 'warn',
          details: isGoodProfile 
            ? `Confirmed employment at reported sector in ${profile.location}.`
            : 'Unable to verify current employer via public LinkedIn data.'
        },
        maritalStatus: {
          status: 'pass',
          details: 'No marriage records found in local jurisdiction (consistent with "Single").'
        },
        criminalRecord: {
          status: 'pass',
          details: 'No criminal records found in national databases.'
        }
      },
      aiAnalysis: `Based on an analysis of public social media footprints and government records, the profile for ${profile.name} appears highly authentic. The location and career details align with available data points.`
    };
  }
};
