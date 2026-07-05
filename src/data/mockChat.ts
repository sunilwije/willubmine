import { Profile } from './profiles';

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Match {
  id: string;
  profile: Profile;
  lastMessage?: string;
}

export const mockMatches: Match[] = [
  {
    id: '1',
    profile: {
      id: '2',
      name: 'Sarah Johnson',
      age: 25,
      gender: 'Female',
      location: 'London, UK',
      occupation: 'Graphic Designer',
      about: 'Creative soul...',
      imageUrl: 'https://cdn.pixabay.com/photo/2018/08/04/20/48/woman-3584435_1280.jpg',
      interests: ['Art', 'Design']
    },
    lastMessage: 'Hey! I saw you like hiking too?'
  },
  {
    id: '2',
    profile: {
      id: '4',
      name: 'Elena Rodriguez',
      age: 27,
      gender: 'Female',
      location: 'Madrid, Spain',
      occupation: 'Teacher',
      about: 'Passionate educator...',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/06/19/22/46/girl-1467820_1280.jpg',
      interests: ['Teaching', 'Dancing']
    },
    lastMessage: 'Hola! How are you?'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    matchId: '1',
    senderId: '2', // Sarah
    content: 'Hey! I saw you like hiking too?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: '2',
    matchId: '1',
    senderId: 'current_user',
    content: 'Yes! I love it. Have you been to the Alps?',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  }
];
