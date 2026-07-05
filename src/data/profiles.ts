export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  gender: string;
  image: string;
  about: string;
  interests: string[];
  occupation?: string;
  education?: string;
  religion?: string;
  height?: string;
  lookingFor?: string;
  verified?: boolean;
  imageUrl?: string;
}

export const profiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    location: 'New York, USA',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    about: 'Software engineer who loves hiking and photography. Looking for someone who shares my passion for adventure.',
    interests: ['Hiking', 'Photography', 'Travel', 'Cooking'],
    occupation: 'Software Engineer',
    education: "Bachelor's Degree",
    verified: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 32,
    location: 'San Francisco, USA',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    about: 'Entrepreneur and fitness enthusiast. I believe in living life to the fullest.',
    interests: ['Fitness', 'Business', 'Music', 'Reading'],
    occupation: 'Entrepreneur',
    education: "Master's Degree",
    verified: true
  },
  {
    id: '3',
    name: 'Emily Williams',
    age: 26,
    location: 'London, UK',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    about: 'Art lover and yoga instructor. Seeking a kind soul who appreciates creativity.',
    interests: ['Yoga', 'Art', 'Meditation', 'Nature'],
    occupation: 'Yoga Instructor',
    education: "Bachelor's Degree",
    verified: false
  },
  {
    id: '4',
    name: 'James Wilson',
    age: 30,
    location: 'Toronto, Canada',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    about: 'Doctor with a love for travel and good food. Looking for my partner in adventure.',
    interests: ['Travel', 'Food', 'Sports', 'Movies'],
    occupation: 'Doctor',
    education: 'PhD / Doctorate',
    verified: true
  },
  {
    id: '5',
    name: 'Priya Sharma',
    age: 27,
    location: 'Mumbai, India',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    about: 'Marketing professional who loves dancing and exploring new cuisines.',
    interests: ['Dancing', 'Food', 'Marketing', 'Travel'],
    occupation: 'Marketing Manager',
    education: "Master's Degree",
    verified: true
  },
  {
    id: '6',
    name: 'David Kim',
    age: 29,
    location: 'Seoul, South Korea',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    about: 'Tech startup founder passionate about innovation and music.',
    interests: ['Technology', 'Music', 'Startups', 'Gaming'],
    occupation: 'Startup Founder',
    education: "Bachelor's Degree",
    verified: false
  }
];
