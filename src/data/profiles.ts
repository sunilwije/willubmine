export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  gender: string;
  image?: string;
  imageUrl?: string;
  about: string;
  interests?: string[];
  occupation?: string;
  education?: string;
  religion?: string;
  height?: string;
  lookingFor?: string;
  verified?: boolean;
}

export const profiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    location: 'New York, USA',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    about: 'Software engineer who loves hiking and photography.',
    interests: ['Hiking', 'Photography', 'Travel', 'Cooking'],
    occupation: 'Software Engineer',
    verified: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 32,
    location: 'San Francisco, USA',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    about: 'Entrepreneur and fitness enthusiast.',
    interests: ['Fitness', 'Business', 'Music', 'Reading'],
    occupation: 'Entrepreneur',
    verified: true
  },
  {
    id: '3',
    name: 'Priya Sharma',
    age: 27,
    location: 'Mumbai, India',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    about: 'Marketing professional who loves dancing.',
    interests: ['Dancing', 'Food', 'Marketing', 'Travel'],
    occupation: 'Marketing Manager',
    verified: true
  }
];
